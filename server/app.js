/**
 * app.js — Express Application Factory
 *
 * Assembles all middleware, security layers, routes
 * and error handlers in the correct order.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

// ── Config builders ─────────────────────────────
const buildCorsOptions = require("./config/corsConfig");
const buildHelmetConfig = require("./config/helmetConfig");
const { globalLimiter } = require("./config/rateLimitConfig");
const { buildMorganMiddleware } = require("./config/loggerConfig");
const connectCloudinary = require("./config/cloudinary");

// ── Middleware ───────────────────────────────────
const {
  csrfProtection,
  mongoSanitisation,
  xssCleaner,
  hppProtection,
  maxRequestSize,
  additionalSecurityHeaders,
  requestInspector,
} = require("./middleware/securityMiddleware");
const buildCompressionMiddleware = require("./middleware/compressionMiddleware");
const requestLogger = require("./middleware/requestLogger");
const {
  globalErrorHandler,
  notFound,
} = require("./middleware/errorMiddleware");
//*************************** */

// ── Register Mongoose models (must run before routes) ──
require("./models/User");
require("./models/Teacher");
require("./models/Student");
require("./models/AttendanceSession");
require("./models/Attendance");
require("./models/OTP");
require("./models/Notification");

// ─────────────────────────────────────────
// Initialise app
// ─────────────────────────────────────────
const app = express();
// *******************
const { sendOTPEmail } = require("./config/mailConfig");

app.get("/test-email", async (req, res) => {
  try {
    await sendOTPEmail({
      name: "Riya",
      email: "katiyarriya625@gmail.com",
      otp: "123456",
      purpose: "verify your email address",
    });

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Trust proxy headers from Render's load balancer
// (required for correct req.ip, rate limiting by IP)
app.set("trust proxy", 1);

// ─────────────────────────────────────────
// 1. Cloudinary
// ─────────────────────────────────────────
connectCloudinary();

// ─────────────────────────────────────────
// 2. Compression
// Must be FIRST — before any response is sent
// ─────────────────────────────────────────
app.use(buildCompressionMiddleware());

// ─────────────────────────────────────────
// 3. Security headers
// ─────────────────────────────────────────
app.use(helmet(buildHelmetConfig()));
app.use(additionalSecurityHeaders);
app.use(requestInspector);

// ─────────────────────────────────────────
// 4. CORS
// Must be before routes and before the rate limiter
// so preflight OPTIONS requests are not blocked
// ─────────────────────────────────────────
app.use(cors(buildCorsOptions()));
app.options("/{*splat}", cors(buildCorsOptions())); // Handle preflight for all routes

// ─────────────────────────────────────────
// 5. HTTP Logging (Morgan → Winston)
// ─────────────────────────────────────────
app.use(buildMorganMiddleware());
app.use(requestLogger);

// ─────────────────────────────────────────
// 6. Body parsers
// ─────────────────────────────────────────
app.use(maxRequestSize(10));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─────────────────────────────────────────
// 7. Input sanitisation
// Must run AFTER body parsers so req.body is populated
// ─────────────────────────────────────────
app.use(mongoSanitisation);
app.use(xssCleaner);
app.use(hppProtection);

// ─────────────────────────────────────────
// 8. CSRF protection
// After cookie-parser, before routes
// ─────────────────────────────────────────
app.use(csrfProtection);

// ─────────────────────────────────────────
// 9. Global rate limiter
// After security middleware
// ─────────────────────────────────────────
app.use("/api", globalLimiter);

// ─────────────────────────────────────────
// 10. Static files (local uploads — dev only)
// ─────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─────────────────────────────────────────
// 11. Health check (no auth, no rate limit)
// ─────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    app: process.env.APP_NAME || "GeoAttend API",
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    memory: {
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
    },
  });
});

// ─────────────────────────────────────────
// 12. API Routes
// ─────────────────────────────────────────
const {
  loginLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  registerLimiter,
  passwordResetLimiter,
  uploadLimiter,
  qrScanLimiter,
} = require("./config/rateLimitConfig");

app.use("/api/v1/auth/login", loginLimiter);
app.use("/api/v1/auth/register", registerLimiter);
app.use("/api/v1/auth/verify-otp", otpVerifyLimiter);
app.use("/api/v1/auth/resend-otp", otpSendLimiter);
app.use("/api/v1/auth/forgot-password", passwordResetLimiter);
app.use("/api/v1/auth/reset-password", passwordResetLimiter);
app.use("/api/v1/upload", uploadLimiter);
app.use("/api/v1/qr/scan", qrScanLimiter);
app.use("/api/v1/qr/submit", qrScanLimiter);

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/teacher", require("./routes/teacherRoutes"));
app.use("/api/v1/sessions", require("./routes/sessionRoutes"));
app.use("/api/v1/student", require("./routes/studentRoutes"));
app.use("/api/v1/attendance", require("./routes/attendanceRoutes"));
app.use("/api/v1/qr", require("./routes/qrAttendanceRoutes"));
app.use("/api/v1/location", require("./routes/locationRoutes"));
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
app.use("/api/v1/upload", require("./routes/uploadRoutes"));

// ─────────────────────────────────────────
// 13. 404 handler — unmatched routes
// ─────────────────────────────────────────
app.use(notFound);

// ─────────────────────────────────────────
// 14. Global error handler — MUST be last
// ─────────────────────────────────────────
app.use(globalErrorHandler);

module.exports = app;
