const rateLimit = require("express-rate-limit");

const makeMessage = (action) => ({
  success: false,
  message: `Too many ${action} attempts. Please try again later.`,
});

/**
 * Strict limiter for login — 10 attempts per 15 min per IP.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: makeMessage("login"),
  skipSuccessfulRequests: true, // Only count failed attempts
});

/**
 * OTP send — 5 per hour per IP (prevent spam).
 */
const otpSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: makeMessage("OTP send"),
});

/**
 * OTP verify — 10 per 30 min per IP.
 */
const otpVerifyLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: makeMessage("OTP verification"),
});

/**
 * Register — 5 registrations per hour per IP.
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: makeMessage("registration"),
});

/**
 * Password reset — 5 per hour per IP.
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: makeMessage("password reset"),
});

module.exports = {
  loginLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  registerLimiter,
  passwordResetLimiter,
};
