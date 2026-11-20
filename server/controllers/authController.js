const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const passwordResetLimiter = require("../utils/passwordResetLimiter");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID
);

/**
 * Generate a unique, non-secret account ID (e.g. CF-A1B2-C3D4)
 */
const generateAccountId = () => {
  const part1 = crypto.randomBytes(2).toString("hex").toUpperCase();
  const part2 = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `CF-${part1}-${part2}`;
};

/**
 * Creates a unique account ID with collision-safe retry loop
 */
const createUniqueAccountId = async () => {
  let attempts = 0;
  while (attempts < 10) {
    const candidateId = generateAccountId();
    const existing = await User.findOne({ accountId: candidateId });
    if (!existing) {
      return candidateId;
    }
    attempts++;
  }
  // Fallback incorporating high-resolution timestamp if high collision
  return `CF-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
};

/**
 * HTML email template for new Google Sign-In user welcome email
 */
const buildWelcomeEmailHtml = (userName, accountId) => `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0;">🚀 CareerForge-AI</h2>
      <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Welcome to Your Career Acceleration Platform</p>
    </div>
    <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 16px 0 24px;" />
    <p style="font-size: 16px; color: #111827; margin-bottom: 12px;">Hello <strong>${userName || "there"}</strong>,</p>
    <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 0;">
      Your CareerForge-AI account has been successfully created via Google Sign-In. You now have full access to our AI resume builder, aptitude practice suite, and technical interview simulations.
    </p>
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
      <span style="font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">
        Your Unique Account ID
      </span>
      <span style="font-family: 'Courier New', Courier, monospace; font-size: 26px; font-weight: 800; color: #111827; letter-spacing: 2px;">
        ${accountId}
      </span>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 8px; margin-bottom: 0;">
        This Account ID identifies your profile. You do not need to memorize a password—simply use <strong>Continue with Google</strong> to sign in anytime.
      </p>
    </div>
    <div style="text-align: center; margin-top: 28px;">
      <a href="${(process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "")}/dashboard" style="background-color: #111827; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
        Open Your Dashboard
      </a>
    </div>
    <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 32px 0 16px;" />
    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
      © CareerForge-AI. All rights reserved.
    </p>
  </div>
`;

/**
 * HTML email template for password reset link
 */
const buildResetPasswordLinkHtml = (userName, resetUrl) => `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0;">🚀 CareerForge-AI</h2>
      <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Password Reset Request</p>
    </div>
    <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 16px 0 24px;" />
    <p style="font-size: 16px; color: #374151; margin-bottom: 8px;">Hello <strong>${userName || "there"}</strong>,</p>
    <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 0;">
      We received a request to reset your password for CareerForge-AI. Click the button below to set a new password:
    </p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${resetUrl}" target="_blank" style="background-color: #111827; color: #ffffff; padding: 14px 32px; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 13px; color: #4b5563; word-break: break-all; margin-top: 16px;">
      If the button above does not work, copy and paste this URL into your browser:<br/>
      <a href="${resetUrl}" style="color: #2563eb; text-decoration: underline;">${resetUrl}</a>
    </p>
    <p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin-top: 16px;">
      • This link is single-use and will expire in <strong>15 minutes</strong>.<br/>
      • If you did not request a password reset, you can safely ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0 16px;" />
    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
      © CareerForge-AI Security. Never share this link.
    </p>
  </div>
`;

/**
 * Masks an email for safe client presentation (e.g. j***n@example.com)
 */
const maskEmail = (email) => {
  if (!email || typeof email !== "string" || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
};

/**
 * HTML email template for 6-digit login verification OTP
 */
const buildLoginOtpHtml = (userName, otp) => `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0;">🚀 CareerForge-AI</h2>
      <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Two-Factor Authentication</p>
    </div>
    <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 16px 0 24px;" />
    <p style="font-size: 16px; color: #111827; margin-bottom: 8px;">Hello <strong>${userName || "there"}</strong>,</p>
    <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 0;">
      Someone requested to sign in to your CareerForge-AI account. Use the verification code below to complete your login:
    </p>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
      <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">
        Verification Code
      </span>
      <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: 8px;">
        ${otp}
      </span>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 12px; margin-bottom: 0;">
        Valid for <strong>10 minutes</strong> • Single use only
      </p>
    </div>
    <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
      • Never share this verification code with anyone. CareerForge-AI will never ask for your code.<br/>
      • If you did not attempt to log in, please reset your password immediately.
    </p>
    <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0 16px;" />
    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
      © CareerForge-AI Security. Protecting your account.
    </p>
  </div>
`;

// ============================================================================
// 1. REGISTER USER (EMAIL + PASSWORD SIGNUP)
// ============================================================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const accountId = await createUniqueAccountId();

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      accountId,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountId: user.accountId,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ============================================================================
// 2. LOGIN (STEP 1: CREDENTIALS VERIFICATION & OTP DISPATCH)
// ============================================================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact administrator.",
        isSuspended: true,
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account was created using Google Sign-In. Please sign in with Continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Rate Limiting: 60-second cooldown on requesting another code
    const cooldownSeconds = parseInt(process.env.OTP_COOLDOWN_SECONDS, 10) || 60;
    if (user.loginOtpLastRequestedAt) {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(user.loginOtpLastRequestedAt).getTime()) / 1000
      );
      if (
        elapsedSeconds < cooldownSeconds &&
        user.loginOtpHash &&
        user.loginOtpExpire &&
        new Date(user.loginOtpExpire).getTime() > Date.now()
      ) {
        const retryAfter = cooldownSeconds - elapsedSeconds;
        return res.status(429).json({
          success: false,
          requiresOtp: true,
          message: `Please wait ${retryAfter}s before requesting a new login code.`,
          retryAfter,
          email: user.email,
          maskedEmail: maskEmail(user.email),
          sessionToken: user.loginOtpSessionToken,
        });
      }
    }

    // Generate cryptographically secure 6-digit decimal code (100000 - 999999)
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const sessionToken = crypto.randomBytes(32).toString("hex");

    user.loginOtpHash = otpHash;
    user.loginOtpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.loginOtpAttempts = 0;
    user.loginOtpSessionToken = sessionToken;
    user.loginOtpLastRequestedAt = new Date();
    await user.save();

    // Send email using configured provider
    const emailResult = await sendEmail({
      email: user.email,
      subject: "CareerForge-AI - Login Verification Code",
      text: `Hello ${user.name},\n\nYour login verification code is: ${otp}\n\nThis code will expire in 10 minutes.\nIf you did not attempt to log in, please secure your account.`,
      html: buildLoginOtpHtml(user.name, otp),
    });

    if (!emailResult.sent) {
      // Roll back OTP fields so an un-emailed code is not active
      user.loginOtpHash = undefined;
      user.loginOtpExpire = undefined;
      user.loginOtpSessionToken = undefined;
      user.loginOtpLastRequestedAt = undefined;
      await user.save();

      const isDev = process.env.NODE_ENV !== "production";
      return res.status(503).json({
        success: false,
        message: "Unable to send login verification email. Please try again later.",
        missingConfig: Boolean(emailResult.missingConfig),
        ...(isDev && emailResult.missingConfig
          ? {
              devHint:
                "SMTP credentials (SMTP_USER / SMTP_PASS) are not configured in server/.env.",
            }
          : {}),
      });
    }

    // DO NOT return JWT session token! Require OTP verification first.
    return res.status(200).json({
      success: true,
      requiresOtp: true,
      message: `A verification code has been sent to ${maskEmail(user.email)}.`,
      email: user.email,
      maskedEmail: maskEmail(user.email),
      sessionToken,
      expiresIn: 600,
      cooldown: cooldownSeconds,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ============================================================================
// 2B. VERIFY LOGIN OTP (STEP 2: VALIDATE CODE & ISSUE AUTHENTICATED JWT)
// ============================================================================
const verifyLoginOtp = async (req, res) => {
  try {
    const { email, sessionToken, otp } = req.body;

    if (!email || !sessionToken || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email, session token, and 6-digit verification code are required",
      });
    }

    const cleanOtp = String(otp).trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "Verification code must be exactly 6 digits",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification request",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact administrator.",
        isSuspended: true,
      });
    }

    // Check if an active OTP session exists
    if (!user.loginOtpHash || !user.loginOtpExpire || !user.loginOtpSessionToken) {
      return res.status(400).json({
        success: false,
        message: "No active verification session found. Please enter your credentials to log in.",
      });
    }

    // Validate session token binding
    if (user.loginOtpSessionToken !== sessionToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification session. Please enter your credentials to log in.",
      });
    }

    // Check expiration
    if (Date.now() > new Date(user.loginOtpExpire).getTime()) {
      user.loginOtpHash = undefined;
      user.loginOtpExpire = undefined;
      user.loginOtpSessionToken = undefined;
      user.loginOtpAttempts = 0;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
        isExpired: true,
      });
    }

    // Increment attempts and guard against brute-force attacks (max 5 attempts)
    user.loginOtpAttempts = (user.loginOtpAttempts || 0) + 1;

    if (user.loginOtpAttempts > 5) {
      // Invalidate code upon exceeding attempts
      user.loginOtpHash = undefined;
      user.loginOtpExpire = undefined;
      user.loginOtpSessionToken = undefined;
      user.loginOtpAttempts = 0;
      await user.save();

      return res.status(429).json({
        success: false,
        message: "Too many failed verification attempts. This code has been invalidated. Please log in again.",
        isExhausted: true,
      });
    }

    // Hash submitted OTP with SHA-256 and compare
    const submittedHash = crypto.createHash("sha256").update(cleanOtp).digest("hex");
    if (submittedHash !== user.loginOtpHash) {
      await user.save(); // Persist incremented attempts
      const remaining = Math.max(0, 5 - user.loginOtpAttempts);
      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Invalid verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Too many failed attempts. This code has been invalidated. Please log in again.",
        attemptsRemaining: remaining,
      });
    }

    // Code is valid: invalidate OTP immediately (single use)
    user.loginOtpHash = undefined;
    user.loginOtpExpire = undefined;
    user.loginOtpSessionToken = undefined;
    user.loginOtpAttempts = 0;
    await user.save();

    // Issue normal authenticated JWT session token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || "active",
        avatar: user.avatar,
        accountId: user.accountId,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify login code",
    });
  }
};

// ============================================================================
// 2C. RESEND LOGIN OTP
// ============================================================================
const resendLoginOtp = async (req, res) => {
  try {
    const { email, sessionToken } = req.body;

    if (!email || !sessionToken) {
      return res.status(400).json({
        success: false,
        message: "Email and session token are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.status === "suspended") {
      return res.status(400).json({
        success: false,
        message: "Invalid verification session. Please log in again.",
      });
    }

    // Enforce sessionToken match
    if (user.loginOtpSessionToken !== sessionToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired session. Please log in again.",
      });
    }

    // Enforce 60-second cooldown
    const cooldownSeconds = parseInt(process.env.OTP_COOLDOWN_SECONDS, 10) || 60;
    if (user.loginOtpLastRequestedAt) {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(user.loginOtpLastRequestedAt).getTime()) / 1000
      );
      if (elapsedSeconds < cooldownSeconds) {
        const retryAfter = cooldownSeconds - elapsedSeconds;
        return res.status(429).json({
          success: false,
          message: `Please wait ${retryAfter}s before requesting a new verification code.`,
          retryAfter,
        });
      }
    }

    // Generate new OTP & sessionToken, invalidate previous
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const newSessionToken = crypto.randomBytes(32).toString("hex");

    user.loginOtpHash = otpHash;
    user.loginOtpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    user.loginOtpAttempts = 0;
    user.loginOtpSessionToken = newSessionToken;
    user.loginOtpLastRequestedAt = new Date();
    await user.save();

    const emailResult = await sendEmail({
      email: user.email,
      subject: "CareerForge-AI - Login Verification Code",
      text: `Hello ${user.name},\n\nYour new login verification code is: ${otp}\n\nThis code will expire in 10 minutes.\nIf you did not attempt to log in, please secure your account.`,
      html: buildLoginOtpHtml(user.name, otp),
    });

    if (!emailResult.sent) {
      const isDev = process.env.NODE_ENV !== "production";
      return res.status(503).json({
        success: false,
        message: "Unable to send login verification email. Please try again later.",
        missingConfig: Boolean(emailResult.missingConfig),
        ...(isDev && emailResult.missingConfig
          ? {
              devHint:
                "SMTP credentials (SMTP_USER / SMTP_PASS) are not configured in server/.env.",
            }
          : {}),
      });
    }

    return res.status(200).json({
      success: true,
      message: `A new verification code has been sent to ${maskEmail(user.email)}.`,
      sessionToken: newSessionToken,
      expiresIn: 600,
      cooldown: cooldownSeconds,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification code",
    });
  }
};

// ============================================================================
// 3. GOOGLE SIGN-IN (SERVER-SIDE IDENTITY VERIFICATION & WELCOME EMAIL)
// ============================================================================
const googleLogin = async (req, res) => {
  try {
    const { token: idToken, credential, accessToken, token } = req.body;
    const tokenToVerify = idToken || credential || token;

    let googlePayload = null;

    // 1. Verify Google OpenID Connect ID Token strictly on the server
    if (tokenToVerify) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: tokenToVerify,
          audience: [
            process.env.GOOGLE_CLIENT_ID,
            process.env.VITE_GOOGLE_CLIENT_ID,
          ].filter(Boolean),
        });
        googlePayload = ticket.getPayload();
      } catch (verifyErr) {
        console.warn("Google ID token verification failed:", verifyErr.message);
      }
    }

    // 2. If access_token was passed, verify directly with Google userinfo API
    if (!googlePayload && accessToken) {
      try {
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          googlePayload = await response.json();
        }
      } catch (fetchErr) {
        console.warn("Google userinfo fetch failed:", fetchErr.message);
      }
    }

    // Reject unverified or missing Google identity claims
    if (!googlePayload || !googlePayload.sub || !googlePayload.email) {
      return res.status(401).json({
        success: false,
        message: "Google verification failed: invalid or unverified Google identity token",
      });
    }

    // Ensure email is verified by Google
    if (googlePayload.email_verified === false) {
      return res.status(403).json({
        success: false,
        message: "Google account email is not verified by Google",
      });
    }

    const googleId = String(googlePayload.sub);
    const email = googlePayload.email.trim().toLowerCase();
    const name = googlePayload.name || email.split("@")[0];
    const avatar = googlePayload.picture || "";

    let isNewUser = false;
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if existing user with matching email already exists (Account Linking)
      user = await User.findOne({ email });

      if (user) {
        // Link existing account with Google stable provider subject ID
        user.googleId = googleId;
        if (!user.avatar && avatar) user.avatar = avatar;
        if (!user.accountId) {
          user.accountId = await createUniqueAccountId();
        }
        await user.save();
      } else {
        // Brand new Google user: generate unique Account ID and persist
        isNewUser = true;
        const accountId = await createUniqueAccountId();
        user = new User({
          name,
          email,
          googleId,
          avatar,
          accountId,
        });
        await user.save();

        // Dispatch Welcome Email containing the unique Account ID
        try {
          const emailResult = await sendEmail({
            email: user.email,
            subject: "Welcome to CareerForge-AI! Your Account Has Been Created",
            text: `Welcome to CareerForge-AI, ${user.name}!\n\nYour account has been created via Google Sign-In.\nYour unique Account ID: ${accountId}\n\nSign in anytime with Continue with Google.`,
            html: buildWelcomeEmailHtml(user.name, accountId),
          });

          if (!emailResult.sent) {
            console.warn(
              `⚠️ [WELCOME EMAIL NOTICE] Welcome email could not be sent to ${user.email} (${emailResult.reason || "delivery failed"}). Account was created successfully.`
            );
          }
        } catch (emailErr) {
          console.warn(`⚠️ [WELCOME EMAIL ERROR] Non-fatal delivery failure for ${user.email}:`, emailErr.message);
        }
      }
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact administrator.",
        isSuspended: true,
      });
    }

    const appToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: isNewUser
        ? "Account created successfully with Google"
        : "Google sign-in successful",
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || "active",
        avatar: user.avatar,
        accountId: user.accountId,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

// ============================================================================
// 4. FORGOT PASSWORD (STANDARD LINK-BASED RESET)
// ============================================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown_ip";

    // 1. Rate Limiting & Cooldown check (Sliding Window & Cooldown)
    const emailLimit = passwordResetLimiter.checkLimit(normalizedEmail);
    if (!emailLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: emailLimit.reason,
        retryAfter: emailLimit.retryAfter,
      });
    }

    const ipLimit = passwordResetLimiter.checkLimit(clientIp);
    if (!ipLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: ipLimit.reason,
        retryAfter: ipLimit.retryAfter,
      });
    }

    const GENERIC_SUCCESS_MESSAGE =
      "If an account exists with this email address, a password reset link has been sent.";

    const user = await User.findOne({ email: normalizedEmail });

    // Anti-enumeration defense: return identical success message if user does not exist
    if (!user || user.status === "suspended" || (!user.password && user.googleId)) {
      passwordResetLimiter.recordSuccess(normalizedEmail);
      passwordResetLimiter.recordSuccess(clientIp);
      return res.status(200).json({
        success: true,
        message: GENERIC_SUCCESS_MESSAGE,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    // Support both CLIENT_URL and FRONTEND_URL to prevent broken links across deployments
    const frontendBaseUrl = (
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173"
    ).replace(/\/+$/, "");
    const resetUrl = `${frontendBaseUrl}/reset-password/${resetToken}`;

    const emailResult = await sendEmail({
      email: user.email,
      subject: "CareerForge-AI - Password Reset Request",
      text: `Hello ${user.name || "there"},\n\nWe received a request to reset your password for CareerForge-AI.\n\nReset your password by visiting this link:\n${resetUrl}\n\nThis link is single-use and will expire in 15 minutes.\nIf you did not request a password reset, you can safely ignore this email.`,
      html: buildResetPasswordLinkHtml(user.name, resetUrl),
    });

    if (!emailResult.sent) {
      // Roll back reset token so an un-emailed token never lingers in the database
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      const isDev = process.env.NODE_ENV !== "production";
      return res.status(503).json({
        success: false,
        message: "Unable to send password reset email. Please try again later.",
        missingConfig: Boolean(emailResult.missingConfig),
        ...(isDev && emailResult.missingConfig
          ? {
              devHint:
                "SMTP credentials (SMTP_USER / SMTP_PASS) are not configured in server/.env. Please configure your Gmail 16-character App Password or custom SMTP host.",
            }
          : {}),
      });
    }

    // Record success to activate cooldown
    passwordResetLimiter.recordSuccess(normalizedEmail);
    passwordResetLimiter.recordSuccess(clientIp);

    // Anti-enumeration: never return resetToken or resetUrl in HTTP response
    return res.status(200).json({
      success: true,
      message: GENERIC_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
    });
  }
};

// ============================================================================
// 5. RESET PASSWORD (STANDARD TOKEN-BASED PASSWORD RESET)
// ============================================================================
const resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link. Please request a new password reset.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.passwordChangedAt = new Date(); // Revokes previous JWT sessions

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

// ============================================================================
// 6. GET CURRENT USER PROFILE
// ============================================================================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
  googleLogin,
  forgotPassword,
  resetPassword,
  getMe,
  createUniqueAccountId,
  generateAccountId,
  passwordResetLimiter,
  maskEmail,
};
