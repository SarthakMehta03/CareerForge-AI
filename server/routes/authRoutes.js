const express = require("express");
const router = express.Router();


const {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyCode,
  directVerifyEmail,
  resendVerification,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/verify-code", verifyCode);
router.get("/verify-email/:token", verifyEmail);
router.get("/verify/:token", directVerifyEmail);
router.post("/verify-email", (req, res, next) => {
  if (req.body.token && !req.params.token) {
    req.params.token = req.body.token;
  }
  verifyEmail(req, res, next);
});
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

module.exports = router;