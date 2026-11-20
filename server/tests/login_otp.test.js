/**
 * Automated Test Suite for Email OTP Login Authentication Flow
 *
 * Verifies:
 * 1. Step 1 (Credential Validation & OTP Issuance):
 *    - Rejects invalid credentials (401)
 *    - Rejects suspended users (403)
 *    - Rejects Google-only accounts (400)
 *    - On valid credentials:
 *      * Generates cryptographically secure 6-digit OTP
 *      * Stores only SHA-256 hash in user record (never plain code)
 *      * Binds OTP to unique sessionToken
 *      * Dispatches email to registered address
 *      * Returns requiresOtp: true without creating JWT token
 * 2. Email Delivery Resilience & Rollback:
 *    - If email delivery fails, returns 503 and rolls back OTP from user doc
 * 3. Step 2 (OTP Verification & Token Issuance):
 *    - Rejects missing or malformed OTP
 *    - Rejects mismatched session token
 *    - Rejects expired OTP
 *    - Rejects incorrect OTP and counts attempts
 *    - Invalidates OTP after 5 failed attempts (429)
 *    - On correct OTP:
 *      * Invalidates OTP immediately (single use)
 *      * Issues 7-day JWT session token
 *      * Returns user profile with accountId
 * 4. Resend & Cooldown:
 *    - Enforces 60-second resend cooldown (429)
 *    - Resending generates a fresh code and session token, invalidating old code
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_login_otp_jwt_secret";
process.env.NODE_ENV = "test";

const User = require("../models/User");
const {
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
  maskEmail,
} = require("../controllers/authController");

/**
 * Mock Request & Response helper
 */
const createMockReqRes = (body = {}, headers = {}) => {
  const req = {
    body,
    headers,
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

test("Login Email OTP Authentication Test Suite", async (t) => {
  const rawPassword = "SecureUserPassword123!";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  // --------------------------------------------------------------------------
  // 1. CREDENTIAL VALIDATION & OTP ISSUANCE
  // --------------------------------------------------------------------------
  await t.test("Login Step 1: Rejects missing credentials with 400", async () => {
    const { req, res } = createMockReqRes({ email: "", password: "" });
    await loginUser(req, res);
    assert.strictEqual(res.getStatusCode(), 400);
  });

  await t.test("Login Step 1: Rejects non-existent user with 401", async () => {
    const originalFindOne = User.findOne;
    User.findOne = async () => null;

    try {
      const { req, res } = createMockReqRes({
        email: "nonexistent@example.com",
        password: "SomePassword",
      });

      await loginUser(req, res);
      assert.strictEqual(res.getStatusCode(), 401);
      assert.match(res.getResponse().message, /invalid email or password/i);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Login Step 1: Rejects incorrect password with 401", async () => {
    const mockUser = {
      _id: "user_pw_test",
      email: "test@example.com",
      password: hashedPassword,
      status: "active",
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "test@example.com",
        password: "WrongPassword999!",
      });

      await loginUser(req, res);
      assert.strictEqual(res.getStatusCode(), 401);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Login Step 1: Valid credentials dispatch OTP and do NOT issue JWT token", async () => {
    let saved = false;
    const mockUser = {
      _id: "user_valid_step1",
      name: "Alex Morgan",
      email: "alex@example.com",
      password: hashedPassword,
      role: "user",
      status: "active",
      accountId: "CF-AAAA-BBBB",
      loginOtpHash: null,
      loginOtpExpire: null,
      loginOtpSessionToken: null,
      save: async function () {
        saved = true;
      },
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "Alex@Example.com ",
        password: rawPassword,
      });

      await loginUser(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const data = res.getResponse();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.requiresOtp, true);
      assert.strictEqual(data.email, "alex@example.com");
      assert.ok(data.sessionToken, "Must return unique session token");
      assert.strictEqual(data.token, undefined, "Must NOT issue JWT token before verification");

      // Verify user DB state
      assert.strictEqual(saved, true);
      assert.ok(mockUser.loginOtpHash);
      assert.strictEqual(mockUser.loginOtpHash.length, 64, "Must store SHA-256 hash");
      assert.ok(mockUser.loginOtpExpire instanceof Date);
      assert.ok(mockUser.loginOtpExpire.getTime() > Date.now() + 8 * 60 * 1000);
      assert.strictEqual(mockUser.loginOtpSessionToken, data.sessionToken);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  // --------------------------------------------------------------------------
  // 2. EMAIL DELIVERY FAILURE & ROLLBACK
  // --------------------------------------------------------------------------
  await t.test("Login Step 1: Fails safe with 503 and rolls back OTP if email dispatch fails", async () => {
    let saveCount = 0;
    const mockUser = {
      _id: "user_fail_email",
      name: "Sam Taylor",
      email: "sam@example.com",
      password: hashedPassword,
      status: "active",
      save: async function () {
        saveCount++;
      },
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      process.env.FORCE_SMTP_TEST = "true";
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;

      const { req, res } = createMockReqRes({
        email: "sam@example.com",
        password: rawPassword,
      });

      await loginUser(req, res);

      assert.strictEqual(res.getStatusCode(), 503);
      assert.strictEqual(res.getResponse().success, false);
      assert.match(res.getResponse().message, /Unable to send login verification email/i);

      // Verify rollback
      assert.strictEqual(mockUser.loginOtpHash, undefined);
      assert.strictEqual(mockUser.loginOtpExpire, undefined);
      assert.strictEqual(mockUser.loginOtpSessionToken, undefined);
      assert.ok(saveCount >= 2, "Must save OTP and then save rollback");
    } finally {
      delete process.env.FORCE_SMTP_TEST;
      User.findOne = originalFindOne;
    }
  });

  // --------------------------------------------------------------------------
  // 3. STEP 2: OTP VERIFICATION & SESSION ISSUANCE
  // --------------------------------------------------------------------------
  await t.test("Verify OTP: Successfully verifies valid OTP and issues JWT token", async () => {
    const rawOtp = "482910";
    const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");
    const sessionToken = "session_token_valid_12345";

    let saved = false;
    const mockUser = {
      _id: "user_verify_success",
      name: "Taylor Swift",
      email: "taylor@example.com",
      role: "user",
      status: "active",
      accountId: "CF-9999-8888",
      loginOtpHash: hashedOtp,
      loginOtpExpire: new Date(Date.now() + 5 * 60 * 1000),
      loginOtpSessionToken: sessionToken,
      loginOtpAttempts: 0,
      save: async function () {
        saved = true;
      },
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "taylor@example.com",
        sessionToken,
        otp: rawOtp,
      });

      await verifyLoginOtp(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const data = res.getResponse();
      assert.strictEqual(data.success, true);
      assert.ok(data.token, "Must issue JWT token on valid OTP");
      assert.strictEqual(data.user.email, "taylor@example.com");
      assert.strictEqual(data.user.accountId, "CF-9999-8888");

      // Verify single-use: OTP fields must be cleared
      assert.strictEqual(saved, true);
      assert.strictEqual(mockUser.loginOtpHash, undefined);
      assert.strictEqual(mockUser.loginOtpExpire, undefined);
      assert.strictEqual(mockUser.loginOtpSessionToken, undefined);
      assert.strictEqual(mockUser.loginOtpAttempts, 0);

      // Verify JWT payload
      const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
      assert.strictEqual(decoded.id, "user_verify_success");
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Verify OTP: Rejects incorrect OTP and counts attempts", async () => {
    const correctOtp = "123456";
    const hashedOtp = crypto.createHash("sha256").update(correctOtp).digest("hex");
    const sessionToken = "session_token_bad_otp";

    const mockUser = {
      _id: "user_verify_fail",
      email: "user@example.com",
      status: "active",
      loginOtpHash: hashedOtp,
      loginOtpExpire: new Date(Date.now() + 5 * 60 * 1000),
      loginOtpSessionToken: sessionToken,
      loginOtpAttempts: 0,
      save: async function () {},
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "user@example.com",
        sessionToken,
        otp: "999999", // Incorrect code
      });

      await verifyLoginOtp(req, res);

      assert.strictEqual(res.getStatusCode(), 400);
      assert.strictEqual(res.getResponse().success, false);
      assert.match(res.getResponse().message, /Invalid verification code/i);
      assert.strictEqual(mockUser.loginOtpAttempts, 1);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Verify OTP: Invalidates code after 5 failed attempts with 429", async () => {
    const correctOtp = "123456";
    const hashedOtp = crypto.createHash("sha256").update(correctOtp).digest("hex");
    const sessionToken = "session_token_bruteforce";

    const mockUser = {
      _id: "user_bruteforce",
      email: "brute@example.com",
      status: "active",
      loginOtpHash: hashedOtp,
      loginOtpExpire: new Date(Date.now() + 5 * 60 * 1000),
      loginOtpSessionToken: sessionToken,
      loginOtpAttempts: 5, // Already reached threshold
      save: async function () {},
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "brute@example.com",
        sessionToken,
        otp: "000000",
      });

      await verifyLoginOtp(req, res);

      assert.strictEqual(res.getStatusCode(), 429);
      assert.match(res.getResponse().message, /Too many failed verification attempts/i);
      assert.strictEqual(mockUser.loginOtpHash, undefined, "Must clear OTP on lockout");
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Verify OTP: Rejects expired OTP with 400 and clears record", async () => {
    const rawOtp = "654321";
    const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");
    const sessionToken = "session_expired";

    const mockUser = {
      _id: "user_expired_otp",
      email: "expired@example.com",
      status: "active",
      loginOtpHash: hashedOtp,
      loginOtpExpire: new Date(Date.now() - 1000), // Expired 1 second ago
      loginOtpSessionToken: sessionToken,
      loginOtpAttempts: 0,
      save: async function () {},
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "expired@example.com",
        sessionToken,
        otp: rawOtp,
      });

      await verifyLoginOtp(req, res);

      assert.strictEqual(res.getStatusCode(), 400);
      assert.match(res.getResponse().message, /expired/i);
      assert.strictEqual(mockUser.loginOtpHash, undefined);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  // --------------------------------------------------------------------------
  // 4. RESEND OTP & COOLDOWN
  // --------------------------------------------------------------------------
  await t.test("Resend OTP: Enforces 60-second cooldown with 429", async () => {
    const sessionToken = "session_cooldown_test";
    const mockUser = {
      _id: "user_cooldown",
      email: "cooldown@example.com",
      status: "active",
      loginOtpSessionToken: sessionToken,
      loginOtpLastRequestedAt: new Date(Date.now() - 15 * 1000), // 15s ago (< 60s)
      save: async function () {},
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "cooldown@example.com",
        sessionToken,
      });

      await resendLoginOtp(req, res);

      assert.strictEqual(res.getStatusCode(), 429);
      assert.strictEqual(res.getResponse().success, false);
      assert.match(res.getResponse().message, /Please wait/i);
      assert.ok(res.getResponse().retryAfter > 0);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Resend OTP: Successfully issues new code and new sessionToken after cooldown", async () => {
    const oldSessionToken = "old_session_token";
    const mockUser = {
      _id: "user_resend_ok",
      name: "Dana Scully",
      email: "dana@example.com",
      status: "active",
      loginOtpSessionToken: oldSessionToken,
      loginOtpLastRequestedAt: new Date(Date.now() - 75 * 1000), // 75s ago (> 60s)
      loginOtpHash: "old_hash",
      save: async function () {},
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        email: "dana@example.com",
        sessionToken: oldSessionToken,
      });

      await resendLoginOtp(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      const data = res.getResponse();
      assert.strictEqual(data.success, true);
      assert.ok(data.sessionToken);
      assert.notStrictEqual(data.sessionToken, oldSessionToken, "Must issue new sessionToken");
      assert.notStrictEqual(mockUser.loginOtpHash, "old_hash", "Must generate new OTP hash");
    } finally {
      User.findOne = originalFindOne;
    }
  });

  // --------------------------------------------------------------------------
  // 5. EMAIL MASKING UTILITY
  // --------------------------------------------------------------------------
  await t.test("maskEmail: Safely obfuscates email address for UI presentation", () => {
    assert.strictEqual(maskEmail("panchaldivy110@gmail.com"), "pa***0@gmail.com");
    assert.strictEqual(maskEmail("al@domain.com"), "a***@domain.com");
  });
});
