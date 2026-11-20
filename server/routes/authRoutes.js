const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
  googleLogin,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Authentication Endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyLoginOtp);
router.post("/resend-otp", resendLoginOtp);
router.post("/google", googleLogin);

// Standard Password Reset Endpoints
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Profile
router.get("/me", protect, getMe);

module.exports = router;
