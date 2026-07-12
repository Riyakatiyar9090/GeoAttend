const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * Factory that builds a rate limiter with consistent
 * response shape matching the rest of the API.
 */
const makeLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true, // RateLimit-* headers
    legacyHeaders: false, // Suppress X-RateLimit-* (legacy)
    handler: (req, res) => {
      const retryAfterSeconds = Math.ceil(windowMs / 1000);
      res.setHeader("Retry-After", retryAfterSeconds);
      res.status(429).json({
        success: false,
        status: "error",
        message,
        retryAfter: retryAfterSeconds,
      });
    },
    // Use user ID when available for logged-in users,
    // fall back to IP address for public routes
    keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req),
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === "/health";
    },
  });

// ─────────────────────────────────────────
// Limiters
// ─────────────────────────────────────────

/**
 * Global API limiter — 100 requests per IP per 15 minutes.
 * Applied to all /api/* routes in app.js.
 */
const globalLimiter = makeLimiter(
  15 * 60 * 1000,
  100,
  "Too many requests. Please try again in 15 minutes.",
);

/**
 * Strict limiter for login — 10 attempts per 15 minutes.
 * Counts only failed requests.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed logins
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
        "Too many login attempts. Account temporarily restricted. Try again in 15 minutes.",
      retryAfter: 900,
    });
  },
});

/** OTP send — 5 per hour (prevents SMS/email spam). */
const otpSendLimiter = makeLimiter(
  60 * 60 * 1000,
  5,
  "Too many OTP requests. Please wait 1 hour before requesting another OTP.",
);

/** OTP verify — 10 per 30 minutes (prevents brute-force guessing). */
const otpVerifyLimiter = makeLimiter(
  30 * 60 * 1000,
  10,
  "Too many OTP verification attempts. Please wait 30 minutes.",
);

/** Registration — 5 per hour per IP. */
const registerLimiter = makeLimiter(
  60 * 60 * 1000,
  5,
  "Too many registration attempts from this IP. Please try again in 1 hour.",
);

/** Password reset — 5 per hour. */
const passwordResetLimiter = makeLimiter(
  60 * 60 * 1000,
  5,
  "Too many password reset requests. Please wait 1 hour.",
);

/** File upload — 20 uploads per hour. */
const uploadLimiter = makeLimiter(
  60 * 60 * 1000,
  20,
  "Upload limit reached. Please wait 1 hour before uploading again.",
);

/** QR scan — 30 per 15 minutes (prevents scan flooding). */
const qrScanLimiter = makeLimiter(
  15 * 60 * 1000,
  30,
  "Too many QR scan attempts. Please wait 15 minutes.",
);

module.exports = {
  globalLimiter,
  loginLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  registerLimiter,
  passwordResetLimiter,
  uploadLimiter,
  qrScanLimiter,
};
