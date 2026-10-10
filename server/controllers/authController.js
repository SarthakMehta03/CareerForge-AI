const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
    try{
         const {name,email,password} = req.body;

         if (!name || !email || !password ) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
         }

         const existingUser = await User.findOne({email});
         if(existingUser){
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
         }

         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password,salt);

         const user = new User({
            name,
            email,
            password: hashedPassword
         });

         await user.save();

         res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
         });
    }
    catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false, 
            message: 'Server error' 
        });
    }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account was created using Google Sign-In. Please log in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

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

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token: idToken, credential, userInfo } = req.body;
    const tokenToVerify = idToken || credential;

    let email, name, googleId, avatar;

    if (tokenToVerify) {
      try {
        if (process.env.GOOGLE_CLIENT_ID) {
          const ticket = await googleClient.verifyIdToken({
            idToken: tokenToVerify,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();
          email = payload.email;
          name = payload.name;
          googleId = payload.sub;
          avatar = payload.picture;
        } else {
          const decoded = jwt.decode(tokenToVerify);
          if (decoded && decoded.email) {
            email = decoded.email;
            name = decoded.name;
            googleId = decoded.sub;
            avatar = decoded.picture;
          }
        }
      } catch (verifyErr) {
        console.warn("Google token verify fallback:", verifyErr.message);
        const decoded = jwt.decode(tokenToVerify);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name;
          googleId = decoded.sub;
          avatar = decoded.picture;
        }
      }
    }

    if (!email && userInfo) {
      email = userInfo.email;
      name = userInfo.name;
      googleId = userInfo.sub || userInfo.googleId;
      avatar = userInfo.picture || userInfo.avatar;
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google user data or token",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: name || email.split("@")[0],
        email,
        googleId: googleId || `google_${Date.now()}`,
        avatar: avatar || "",
      });
      await user.save();
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.avatar && avatar) user.avatar = avatar;
      await user.save();
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

    res.status(200).json({
      success: true,
      message: "Google login successful",
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user account exists with this email address.",
      });
    }

    if (!user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This account was registered using Google. Please log in with Google.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    const frontendResetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const messageHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #111827; text-align: center; margin-bottom: 8px;">🚀 CareerForge-AI</h2>
        <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 0;">AI-Powered Career & Interview Preparation</p>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
        <p style="font-size: 16px; color: #374151;">Hello <strong>${user.name || "User"}</strong>,</p>
        <p style="font-size: 15px; color: #4b5563; line-height: 1.5;">
          You requested a password reset for your CareerForge-AI account. Click the button below to create a new password:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${frontendResetUrl}" target="_blank" style="background-color: #000000; color: #ffffff; padding: 14px 32px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 13px; color: #6b7280; line-height: 1.4;">
          This link will expire in <strong>15 minutes</strong>. If you did not request a password reset, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; word-break: break-all;">
          If the button doesn't work, copy and paste this URL into your browser:<br/>
          <a href="${frontendResetUrl}" style="color: #4f46e5;">${frontendResetUrl}</a>
        </p>
      </div>
    `;

    const emailResult = await sendEmail({
      email: user.email,
      subject: "CareerForge-AI - Password Reset Request",
      text: `Reset your password by visiting this link: ${frontendResetUrl}`,
      html: messageHtml,
    });

    console.log(`\n========================================`);
    console.log(`[PASSWORD RESET REQUEST] User: ${user.email}`);
    console.log(`Email Sent: ${emailResult.sent ? "YES" : "NO (SMTP not set or error)"}`);
    console.log(`Reset URL: ${frontendResetUrl}`);
    console.log(`========================================\n`);

    res.status(200).json({
      success: true,
      message: emailResult.sent
        ? "Password reset email sent! Please check your inbox."
        : "Password reset link generated successfully.",
      emailSent: emailResult.sent,
      resetUrl: frontendResetUrl,
      resetToken,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
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
        message: "Invalid or expired reset token. Please request a new password reset.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
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
  googleLogin,
  forgotPassword,
  resetPassword,
  getMe,
};