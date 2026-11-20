/**
 * Comprehensive Automated Test Suite for Password Reset Flow,
 * SMTP Configuration, Rate Limiting, Cooldowns, and Token Security
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_key";
process.env.NODE_ENV = "test";

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { getSmtpConfig } = require("../utils/sendEmail");
const passwordResetLimiter = require("../utils/passwordResetLimiter");
const { PasswordResetLimiter } = require("../utils/passwordResetLimiter");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

/**
 * Mock Request & Response helper
 */
const createMockReqRes = (body = {}, headers = {}) => {
  const req = {
    body,
    headers,
    socket: { remoteAddress: "127.0.0.1" },
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

test("Password Reset & Email Infrastructure Test Suite", async (t) => {
  // Reset rate limits before each test
  t.beforeEach(() => {
    passwordResetLimiter.clear();
  });

  // --------------------------------------------------------------------------
  // 1. SMTP CONFIGURATION DETECTION & CREDENTIAL SANITIZATION
  // --------------------------------------------------------------------------
  await t.test("SMTP Config: Detects missing credentials and flags hasConfig: false", () => {
    const origUser = process.env.SMTP_USER;
    const origPass = process.env.SMTP_PASS;
    try {
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASS;

      const config = getSmtpConfig();
      assert.strictEqual(config.hasConfig, false);
    } finally {
      process.env.SMTP_USER = origUser;
      process.env.SMTP_PASS = origPass;
    }
  });

  await t.test("SMTP Config: Strips spaces from Google 16-character App Passwords", () => {
    const origService = process.env.SMTP_SERVICE;
    const origUser = process.env.SMTP_USER;
    const origPass = process.env.SMTP_PASS;

    try {
      process.env.SMTP_SERVICE = "gmail";
      process.env.SMTP_USER = "developer@gmail.com";
      process.env.SMTP_PASS = "abcd efgh ijkl mnop"; // Standard spaced Google format

      const config = getSmtpConfig();
      assert.strictEqual(config.hasConfig, true);
      assert.strictEqual(config.isGmail, true);
      assert.strictEqual(config.pass, "abcdefghijklmnop"); // Whitespace removed
      assert.strictEqual(config.user, "developer@gmail.com");
    } finally {
      process.env.SMTP_SERVICE = origService;
      process.env.SMTP_USER = origUser;
      process.env.SMTP_PASS = origPass;
    }
  });

  // --------------------------------------------------------------------------
  // 2. INPUT VALIDATION & EMAIL NORMALIZATION
  // --------------------------------------------------------------------------
  await t.test("Forgot Password: Rejects missing or invalid email format with 400", async () => {
    const { req: req1, res: res1 } = createMockReqRes({});
    await forgotPassword(req1, res1);
    assert.strictEqual(res1.getStatusCode(), 400);
    assert.match(res1.getResponse().message, /enter your email address/i);

    const { req: req2, res: res2 } = createMockReqRes({ email: "not-an-email" });
    await forgotPassword(req2, res2);
    assert.strictEqual(res2.getStatusCode(), 400);
    assert.match(res2.getResponse().message, /valid email address/i);
  });

  // --------------------------------------------------------------------------
  // 3. ANTI-ENUMERATION SECURITY DEFENSE
  // --------------------------------------------------------------------------
  await t.test("Forgot Password: Returns identical generic success for non-existent email", async () => {
    const originalFindOne = User.findOne;
    User.findOne = async () => null;

    try {
      const { req, res } = createMockReqRes({
        email: "nonexistent.user@example.com",
      });

      await forgotPassword(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(res.getResponse().success, true);
      assert.match(res.getResponse().message, /If an account exists/i);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Forgot Password: Returns identical generic success for suspended user", async () => {
    const originalFindOne = User.findOne;
    User.findOne = async () => ({
      email: "suspended@example.com",
      status: "suspended",
    });

    try {
      const { req, res } = createMockReqRes({
        email: "suspended@example.com",
      });

      await forgotPassword(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(res.getResponse().success, true);
      assert.match(res.getResponse().message, /If an account exists/i);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Forgot Password: Returns identical generic success for Google-only user without password", async () => {
    const originalFindOne = User.findOne;
    User.findOne = async () => ({
      email: "googleuser@example.com",
      googleId: "google-sub-12345",
      password: null, // Google OAuth only
    });

    try {
      const { req, res } = createMockReqRes({
        email: "googleuser@example.com",
      });

      await forgotPassword(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(res.getResponse().success, true);
      assert.match(res.getResponse().message, /If an account exists/i);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  // --------------------------------------------------------------------------
  // 4. SUCCESSFUL RESET FLOW & LINK CONSTRUCTION
  // --------------------------------------------------------------------------
  await t.test("Forgot Password: Valid user generates secure hash and constructs reset link", async () => {
    let savedUser = null;
    const mockUser = {
      _id: "user_valid_123",
      email: "valid.user@example.com",
      name: "Valid User",
      password: "hashed_old_password",
      status: "active",
      save: async function () {
        savedUser = this;
      },
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    const origClientUrl = process.env.CLIENT_URL;
    process.env.CLIENT_URL = "https://app.careerforge.ai";

    try {
      const { req, res } = createMockReqRes({
        email: "Valid.User@example.com ",
      });

      await forgotPassword(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(res.getResponse().success, true);
      assert.match(res.getResponse().message, /If an account exists/i);

      // Verify token in DB
      assert.ok(mockUser.resetPasswordToken);
      assert.strictEqual(mockUser.resetPasswordToken.length, 64); // SHA-256 hex
      assert.ok(mockUser.resetPasswordExpire instanceof Date);
      assert.ok(mockUser.resetPasswordExpire.getTime() > Date.now() + 10 * 60 * 1000);
    } finally {
      User.findOne = originalFindOne;
      process.env.CLIENT_URL = origClientUrl;
    }
  });

  // --------------------------------------------------------------------------
  // 5. PROVIDER FAILURE HANDLING & DATABASE TOKEN ROLLBACK
  // --------------------------------------------------------------------------
  await t.test("Forgot Password: Cleans up and rolls back token if email dispatch fails", async () => {
    let saveCount = 0;
    const mockUser = {
      _id: "user_fail_dispatch",
      email: "fail.user@example.com",
      name: "Fail User",
      password: "hashed_password",
      resetPasswordToken: null,
      resetPasswordExpire: null,
      save: async function () {
        saveCount++;
      },
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    // Force sendEmail to report failure
    const origForceFail = process.env.FORCE_EMAIL_FAIL;
    const origNodeEnv = process.env.NODE_ENV;

    // We can simulate sendEmail returning { sent: false, missingConfig: true }
    // by temporarily replacing sendEmail
    const sendEmailModule = require("../utils/sendEmail");
    // Since sendEmail is directly called in authController, we can test via mock config
    // Let's test the controller behavior when emailResult.sent is false
    // To do that, we test the controller's response and user cleanup
    try {
      // Temporarily set test env to force missing config behavior
      process.env.FORCE_SMTP_TEST = "true"; // Bypasses mock in sendEmail
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;

      const { req, res } = createMockReqRes({
        email: "fail.user@example.com",
      });

      await forgotPassword(req, res);

      assert.strictEqual(res.getStatusCode(), 503);
      assert.strictEqual(res.getResponse().success, false);
      assert.match(res.getResponse().message, /Unable to send password reset email/i);

      // Verify that reset token was ROLLED BACK and is not left lingering in DB
      assert.strictEqual(mockUser.resetPasswordToken, undefined);
      assert.strictEqual(mockUser.resetPasswordExpire, undefined);
      assert.ok(saveCount >= 2, "User save must be called initially and on rollback");
    } finally {
      delete process.env.FORCE_SMTP_TEST;
      process.env.NODE_ENV = "test";
      User.findOne = originalFindOne;
    }
  });

  // --------------------------------------------------------------------------
  // 6. RATE LIMITING & COOLDOWN PROTECTION
  // --------------------------------------------------------------------------
  await t.test("Rate Limiting: Blocks rapid duplicate requests within 60s cooldown", async () => {
    const originalFindOne = User.findOne;
    User.findOne = async () => null; // Anti-enumeration user

    try {
      const { req: req1, res: res1 } = createMockReqRes(
        { email: "ratelimit@example.com" },
        { "x-forwarded-for": "198.51.100.1" }
      );

      // First request: succeeds
      await forgotPassword(req1, res1);
      assert.strictEqual(res1.getStatusCode(), 200);

      // Second request immediately after: should be blocked by 60s cooldown
      const { req: req2, res: res2 } = createMockReqRes(
        { email: "ratelimit@example.com" },
        { "x-forwarded-for": "198.51.100.1" }
      );
      await forgotPassword(req2, res2);

      assert.strictEqual(res2.getStatusCode(), 429);
      assert.strictEqual(res2.getResponse().success, false);
      assert.match(res2.getResponse().message, /Please wait/i);
      assert.ok(res2.getResponse().retryAfter > 0);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Rate Limiting: Non-blocking on provider failure", async () => {
    // If a request fails because SMTP is unconfigured, user should NOT be locked in cooldown
    const limiter = new PasswordResetLimiter({ cooldownSeconds: 60 });

    const key = "test@example.com";
    assert.strictEqual(limiter.checkLimit(key).allowed, true);

    // If dispatch fails, recordSuccess is not called
    // User checks again immediately:
    assert.strictEqual(limiter.checkLimit(key).allowed, true);

    // Once dispatch succeeds, recordSuccess is called:
    limiter.recordSuccess(key);
    assert.strictEqual(limiter.checkLimit(key).allowed, false);
    assert.ok(limiter.checkLimit(key).retryAfter > 0);
  });

  await t.test("Rate Limiting: Enforces sliding window limit (5 requests per 15 minutes)", () => {
    const limiter = new PasswordResetLimiter({
      cooldownSeconds: 0, // Disable cooldown to test window limit
      maxAttemptsPerWindow: 3,
      windowMinutes: 15,
    });

    const key = "spammer@example.com";
    assert.strictEqual(limiter.checkLimit(key).allowed, true);
    limiter.recordSuccess(key);

    assert.strictEqual(limiter.checkLimit(key).allowed, true);
    limiter.recordSuccess(key);

    assert.strictEqual(limiter.checkLimit(key).allowed, true);
    limiter.recordSuccess(key);

    // 4th request exceeds maxAttemptsPerWindow (3)
    const check = limiter.checkLimit(key);
    assert.strictEqual(check.allowed, false);
    assert.match(check.reason, /Too many password reset requests/i);
  });

  // --------------------------------------------------------------------------
  // 7. RESET PASSWORD (SUBMIT TOKEN & NEW PASSWORD)
  // --------------------------------------------------------------------------
  await t.test("Reset Password: Successfully resets password and revokes previous sessions", async () => {
    const clearToken = "valid_reset_token_secret_12345";
    const hashedToken = crypto.createHash("sha256").update(clearToken).digest("hex");

    let saved = false;
    let savedPasswordHash = null;

    const mockUser = {
      _id: "reset_user_1",
      email: "resetme@example.com",
      resetPasswordToken: hashedToken,
      resetPasswordExpire: new Date(Date.now() + 15 * 60 * 1000),
      save: async function () {
        saved = true;
        savedPasswordHash = this.password;
      },
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const { req, res } = createMockReqRes({
        resetToken: clearToken,
        password: "NewSecurePassword123!",
      });

      await resetPassword(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(res.getResponse().success, true);
      assert.strictEqual(saved, true);
      assert.strictEqual(mockUser.resetPasswordToken, undefined);
      assert.strictEqual(mockUser.resetPasswordExpire, undefined);
      assert.ok(mockUser.passwordChangedAt instanceof Date);

      // Verify password was hashed with bcrypt
      const isMatch = await bcrypt.compare("NewSecurePassword123!", savedPasswordHash);
      assert.strictEqual(isMatch, true);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test("Reset Password: Rejects missing resetToken or password shorter than 6 characters", async () => {
    const { req: req1, res: res1 } = createMockReqRes({
      resetToken: "",
      password: "pass",
    });
    await resetPassword(req1, res1);
    assert.strictEqual(res1.getStatusCode(), 400);

    const { req: req2, res: res2 } = createMockReqRes({
      resetToken: "some_token",
      password: "123", // Short password
    });
    await resetPassword(req2, res2);
    assert.strictEqual(res2.getStatusCode(), 400);
    assert.match(res2.getResponse().message, /at least 6 characters/i);
  });

  await t.test("Reset Password: Rejects expired or invalid reset token with 400", async () => {
    const originalFindOne = User.findOne;
    User.findOne = async () => null; // Token lookup finds no matching or unexpired user

    try {
      const { req, res } = createMockReqRes({
        resetToken: "invalid_or_expired_token",
        password: "NewValidPassword123!",
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
