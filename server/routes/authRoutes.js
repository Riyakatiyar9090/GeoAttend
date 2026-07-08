const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const {
  validateStudentRegister,
  validateTeacherRegister,
  validateLogin,
  validateVerifyOTP,
  validateResendOTP,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
} = require("../middleware/validationMiddleware");

const {
  loginLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  registerLimiter,
  passwordResetLimiter,
} = require("../middleware/rateLimitMiddleware");

// ─────────────────────────────────────────
// Public routes — no JWT required
// ─────────────────────────────────────────

/**
 * @route   POST /api/v1/auth/register/student
 * @desc    Register a new student
 * @access  Public
 */
router.post(
  "/register/student",
  registerLimiter,
  validateStudentRegister,
  authController.registerStudent,
);

/**
 * @route   POST /api/v1/auth/register/teacher
 * @desc    Register a new teacher
 * @access  Public
 */
router.post(
  "/register/teacher",
  registerLimiter,
  validateTeacherRegister,
  authController.registerTeacher,
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login — returns JWT in cookie and body
 * @access  Public
 */
router.post("/login", loginLimiter, validateLogin, authController.login);

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify an OTP (email verification, password reset, 2FA)
 * @access  Public
 */
router.post(
  "/verify-otp",
  otpVerifyLimiter,
  validateVerifyOTP,
  authController.verifyOTP,
);

/**
 * @route   POST /api/v1/auth/resend-otp
 * @desc    Resend OTP to email
 * @access  Public
 */
router.post(
  "/resend-otp",
  otpSendLimiter,
  validateResendOTP,
  authController.resendOTP,
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password-reset OTP
 * @access  Public
 */
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateForgotPassword,
  authController.forgotPassword,
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password using OTP
 * @access  Public
 */
router.post(
  "/reset-password",
  passwordResetLimiter,
  validateResetPassword,
  authController.resetPassword,
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Issue a new access token using the refresh cookie
 * @access  Public (requires valid refresh cookie)
 */
router.post("/refresh-token", authController.refreshToken);

// ─────────────────────────────────────────
// Protected routes — JWT required
// ─────────────────────────────────────────

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Clear auth cookies
 * @access  Private
 */
router.post("/logout", protect, authController.logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get logged-in user profile
 * @access  Private
 */
router.get("/me", protect, authController.getMe);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Change password while logged in
 * @access  Private
 */
router.put(
  "/change-password",
  protect,
  validateChangePassword,
  authController.changePassword,
);

// ─────────────────────────────────────────
// Role-restricted example (ready to use)
// ─────────────────────────────────────────

/**
 * @route   GET /api/v1/auth/admin-only
 * @desc    Example admin-only route
 * @access  Private — Admin only
 */
router.get("/admin-only", protect, restrictTo("admin"), (req, res) =>
  res.json({ success: true, message: "Admin access confirmed." }),
);

module.exports = router;
