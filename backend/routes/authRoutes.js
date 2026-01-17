const router = require("express").Router();

const {
  signup,
  verifyOtp,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout
} = require("../controllers/authController");

const { authLimiter, otpLimiter } = require("../middleware/rateLimit");

/* ---------------- AUTH ROUTES ---------------- */

// Signup & OTP
router.post("/signup", otpLimiter, signup);
router.post("/verify-otp", otpLimiter, verifyOtp);

// Login
router.post("/login", authLimiter, login);

// Google login (rate-limited)
router.post("/google", authLimiter, googleLogin);

// Forgot / Reset password
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/reset-password", otpLimiter, resetPassword);

// Token handling
router.post("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;
