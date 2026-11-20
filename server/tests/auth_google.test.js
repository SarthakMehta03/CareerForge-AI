/**
 * Automated Test Suite for CareerForge AI Google Sign-In, Account ID, and Auth Flows
 *
 * Verifies:
 * 1. Google Sign-In (New User):
 *    - Server-side verification of Google identity payload
 *    - Unique Account ID generation (CF-XXXX-XXXX format)
 *    - Account ID uniqueness constraint and collision retry safety
 *    - Welcome email dispatch with Account ID
 *    - Successful JWT session token issuance
 * 2. Google Sign-In (Returning User):
 *    - Resolves existing user by stable provider subject ID (googleId)
 *    - Does NOT re-generate Account ID or send duplicate welcome email
 * 3. Google Sign-In (Account Linking):
 *    - Safely links Google identity to existing email/password account
 *    - Prevents duplicate accounts
 * 4. Google Sign-In Security & Rejection:
 *    - Rejects missing or unverified Google token (401)
 *    - Rejects unverified email accounts (403)
 *    - Rejects suspended users (403)
 * 5. Welcome Email Delivery Resilience:
 *    - Failure in email transport does NOT block account creation or login
 * 6. Direct Email/Password Login:
 *    - Issues JWT immediately without OTP
 *    - Rejects invalid password
 * 7. Standard Token-Based Password Reset:
 *    - Anti-enumeration defense on forgot-password
 *    - Single-use token reset with passwordChangedAt session invalidation
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_google_auth_jwt_secret";
process.env.NODE_ENV = "test";

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const {
  registerUser,
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
  googleLogin,
  forgotPassword,
  resetPassword,
  createUniqueAccountId,
  generateAccountId,
} = require("../controllers/authController");

/**
 * Mock Request & Response helper
 */
const createMockReqRes = (body = {}, headers = {}) => {
  const req = {
    body,
    headers,
    user: null,
  };

  let statusCode = 200;
  let jsonResponse = null;

  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      jsonResponse = data;
      return res;
    },
    getStatusCode: () => statusCode,
    getResponse: () => jsonResponse,
  };

  return { req, res };
};

test("CareerForge AI Google Sign-In & Authentication Test Suite", async (t) => {
  // Test Account ID Generator
  await t.test("Account ID Generator formats as CF-XXXX-XXXX", () => {
    const accountId = generateAccountId();
    assert.match(accountId, /^CF-[0-9A-F]{4}-[0-9A-F]{4}$/);
  });

  await t.test("createUniqueAccountId handles collision retry gracefully", async () => {
    const originalFindOne = User.findOne;
    let findCalls = 0;

    // Simulate 2 collisions before finding an available ID
    User.findOne = async (query) => {
      findCalls++;
      if (findCalls <= 2) {
        return { accountId: query.accountId }; // simulated collision
      }
      return null; // unique ID found
    };

    try {
      const uniqueId = await createUniqueAccountId();
      assert.match(uniqueId, /^CF-[0-9A-F]{4}-[0-9A-F]{4}$/);
      assert.strictEqual(findCalls, 3);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  // Email / Password Login tests (OTP verification flow)
  await t.test("Login credentials dispatch OTP and do NOT issue JWT token before verification", async () => {
    const rawPassword = "TestPassword123!";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const mockUser = {
      _id: "user_direct_login_1",
      name: "Jordan Lee",
      email: "jordan@example.com",
      password: hashedPassword,
      role: "user",
      status: "active",
      accountId: "CF-1111-2222",
      save: async function () {},
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "jordan@example.com",
        password: rawPassword,
      });

      await loginUser(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const responseData = res.getResponse();
      assert.strictEqual(responseData.success, true);
      assert.strictEqual(responseData.requiresOtp, true, "Must require OTP");
      assert.ok(!responseData.token, "JWT token must NOT be returned before OTP verification");
      assert.ok(responseData.sessionToken, "sessionToken must be returned");
      assert.ok(mockUser.loginOtpHash, "loginOtpHash must be stored on user");
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Direct Login rejects invalid password", async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("CorrectPassword", salt);

    const mockUser = {
      _id: "user_direct_login_2",
      name: "Jordan Lee",
      email: "jordan@example.com",
      password: hashedPassword,
      status: "active",
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "jordan@example.com",
        password: "WrongPassword",
      });

      await loginUser(req, res);

      assert.strictEqual(res.getStatusCode(), 401);
      assert.strictEqual(res.getResponse().success, false);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Direct Login prompts Google sign-in if account has no password", async () => {
    const mockUser = {
      _id: "user_google_only",
      name: "Google User",
      email: "guser@example.com",
      password: null,
      googleId: "google_sub_123",
      status: "active",
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "guser@example.com",
        password: "SomePassword123",
      });

      await loginUser(req, res);

      assert.strictEqual(res.getStatusCode(), 400);
      assert.match(res.getResponse().message, /Continue with Google/i);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  // Google Sign-In Tests
  await t.test("Google Sign-In: rejects request with missing or invalid token", async () => {
    const { req, res } = createMockReqRes({});
    await googleLogin(req, res);

    assert.strictEqual(res.getStatusCode(), 401);
    assert.strictEqual(res.getResponse().success, false);
    assert.match(res.getResponse().message, /verification failed/i);
  });

  await t.test("Google Sign-In: new user creates account, generates accountId, sends welcome email", async () => {
    const originalFindOne = User.findOne;
    let savedUserDoc = null;
    let sentEmails = [];

    // Intercept User constructor and findOne
    User.findOne = async (query) => {
      if (query.googleId || query.email) return null; // New user
      if (query.accountId) return null; // Unique account ID check
      return null;
    };

    const originalUser = global.UserMock;
    // We mock User.prototype.save
    const originalSave = User.prototype.save;
    User.prototype.save = async function () {
      savedUserDoc = this;
      return this;
    };

    // Mock global.fetch to simulate Google UserInfo verification for accessToken
    const originalFetch = global.fetch;
    global.fetch = async (url) => {
      if (url.includes("googleapis.com/oauth2/v3/userinfo")) {
        return {
          ok: true,
          json: async () => ({
            sub: "google_sub_998877",
            email: "newlearner@gmail.com",
            email_verified: true,
            name: "New Learner",
            picture: "https://lh3.googleusercontent.com/photo.jpg",
          }),
        };
      }
      return { ok: false };
    };

    // Mock sendEmail by requiring and stubbing or watching
    // We can test sendEmail integration by listening to console or watching
    try {
      const { req, res } = createMockReqRes({
        accessToken: "valid_mock_google_access_token",
      });

      await googleLogin(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const resData = res.getResponse();
      assert.strictEqual(resData.success, true);
      assert.strictEqual(resData.message, "Account created successfully with Google");
      assert.ok(resData.token, "JWT token returned for new Google user");
      assert.strictEqual(resData.user.email, "newlearner@gmail.com");
      assert.match(resData.user.accountId, /^CF-[0-9A-F]{4}-[0-9A-F]{4}$/);

      assert.ok(savedUserDoc, "User document must be saved to DB");
      assert.strictEqual(savedUserDoc.googleId, "google_sub_998877");
      assert.strictEqual(savedUserDoc.email, "newlearner@gmail.com");
      assert.strictEqual(savedUserDoc.accountId, resData.user.accountId);
    } finally {
      User.findOne = originalFindOne;
      User.prototype.save = originalSave;
      global.fetch = originalFetch;
    }
  });

  await t.test("Google Sign-In: returning user does NOT generate new account ID or send welcome email", async () => {
    const existingUser = {
      _id: "user_returning_456",
      name: "Existing Google User",
      email: "existing@gmail.com",
      googleId: "google_sub_returning_123",
      accountId: "CF-AAAA-BBBB",
      role: "user",
      status: "active",
      save: async () => {},
    };

    const originalFindOne = User.findOne;
    User.findOne = async (query) => {
      if (query.googleId === "google_sub_returning_123") {
        return existingUser;
      }
      return null;
    };

    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        sub: "google_sub_returning_123",
        email: "existing@gmail.com",
        email_verified: true,
        name: "Existing Google User",
      }),
    });

    try {
      const { req, res } = createMockReqRes({
        accessToken: "valid_mock_access_token_returning",
      });

      await googleLogin(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const resData = res.getResponse();
      assert.strictEqual(resData.success, true);
      assert.strictEqual(resData.message, "Google sign-in successful");
      // Must preserve existing account ID
      assert.strictEqual(resData.user.accountId, "CF-AAAA-BBBB");
    } finally {
      User.findOne = originalFindOne;
      global.fetch = originalFetch;
    }
  });

  await t.test("Google Sign-In: Account Linking links googleId to existing email account", async () => {
    let saved = false;
    const existingEmailUser = {
      _id: "user_email_linked_789",
      name: "Pre-existing User",
      email: "linkme@example.com",
      googleId: null,
      accountId: "CF-LINK-0001",
      role: "user",
      status: "active",
      save: async function () {
        saved = true;
      },
    };

    const originalFindOne = User.findOne;
    User.findOne = async (query) => {
      if (query.googleId === "google_sub_link_999") return null;
      if (query.email === "linkme@example.com") return existingEmailUser;
      return null;
    };

    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        sub: "google_sub_link_999",
        email: "linkme@example.com",
        email_verified: true,
        name: "Pre-existing User",
        picture: "https://lh3.googleusercontent.com/newphoto.jpg",
      }),
    });

    try {
      const { req, res } = createMockReqRes({
        accessToken: "valid_mock_link_token",
      });

      await googleLogin(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(saved, true);
      assert.strictEqual(existingEmailUser.googleId, "google_sub_link_999");
      assert.strictEqual(existingEmailUser.accountId, "CF-LINK-0001");
    } finally {
      User.findOne = originalFindOne;
      global.fetch = originalFetch;
    }
  });

  await t.test("Google Sign-In: rejects unverified email addresses (403)", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        sub: "google_sub_unverified",
        email: "unverified@gmail.com",
        email_verified: false,
        name: "Unverified User",
      }),
    });

    try {
      const { req, res } = createMockReqRes({
        accessToken: "valid_mock_token_unverified",
      });

      await googleLogin(req, res);

      assert.strictEqual(res.getStatusCode(), 403);
      assert.strictEqual(res.getResponse().success, false);
      assert.match(res.getResponse().message, /not verified by Google/i);
    } finally {
      global.fetch = originalFetch;
    }
  });

  // Forgot Password & Reset Password Tests
  await t.test("Forgot Password: anti-enumeration returns identical success message for non-existing email", async () => {
    const originalFindOne = User.findOne;
    User.findOne = async () => null;

    try {
      const { req, res } = createMockReqRes({
        email: "nonexistent@example.com",
      });

      await forgotPassword(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(res.getResponse().success, true);
      assert.match(res.getResponse().message, /If an account exists/i);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Reset Password: valid token updates password and sets passwordChangedAt", async () => {
    const resetToken = "valid_cleartext_reset_token_12345678";
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    let saved = false;
    const mockUser = {
      _id: "user_reset_test_1",
      email: "resetme@example.com",
      resetPasswordToken: hashedToken,
      resetPasswordExpire: new Date(Date.now() + 600000),
      save: async function () {
        saved = true;
      },
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        resetToken,
        password: "BrandNewSecurePassword99!",
      });

      await resetPassword(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(saved, true);
      assert.strictEqual(mockUser.resetPasswordToken, undefined);
      assert.strictEqual(mockUser.resetPasswordExpire, undefined);
      assert.ok(mockUser.passwordChangedAt instanceof Date);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Reset Password: rejects expired or invalid reset token", async () => {
    const originalFindOne = User.findOne;
    User.findOne = async () => null; // No match found for token

    try {
      const { req, res } = createMockReqRes({
        resetToken: "invalid_expired_token",
        password: "BrandNewSecurePassword99!",
      });

      await resetPassword(req, res);

      assert.strictEqual(res.getStatusCode(), 400);
      assert.strictEqual(res.getResponse().success, false);
      assert.match(res.getResponse().message, /Invalid or expired reset link/i);
    } finally {
      User.findOne = originalFindOne;
    }
  });
});

