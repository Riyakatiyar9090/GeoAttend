const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

// ── Register Mongoose models ──────────────
require("./models/User");
require("./models/Teacher");
require("./models/Student");
require("./models/AttendanceSession");
require("./models/Attendance");
require("./models/OTP");
require("./models/Notification");
app.use("/api/v1/auth", require("./routes/authRoutes"));
const {
  globalErrorHandler,
  notFound,
} = require("./middleware/errorMiddleware");
const connectCloudinary = require("./config/cloudinary");

// ─────────────────────────────────────────
// Initialise app
// ─────────────────────────────────────────
const app = express();

// Configure Cloudinary once at startup
connectCloudinary();

// ─────────────────────────────────────────
// Security middleware
// ─────────────────────────────────────────

/**
 * Helmet sets secure HTTP headers:
 * CSP, X-Frame-Options, HSTS, X-Content-Type-Options, etc.
 */
app.use(helmet());

/**
 * CORS — allow requests only from our React frontend.
 * credentials: true is required for HttpOnly cookies.
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/**
 * Global rate limiter — 100 requests per IP per 15 minutes.
 * Auth routes will add a stricter limiter on top of this.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests from this IP. Please try again after 15 minutes.",
  },
});
app.use("/api", globalLimiter);

// ─────────────────────────────────────────
// Body parsers
// ─────────────────────────────────────────

app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded forms
app.use(cookieParser()); // Parse cookies

// ─────────────────────────────────────────
// Logging
// ─────────────────────────────────────────

/**
 * Morgan logs every request.
 *   development → 'dev' format (colourised, concise)
 *   production  → 'combined' Apache format
 */
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// ─────────────────────────────────────────
// Static files (multer uploads folder)
// ─────────────────────────────────────────

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─────────────────────────────────────────
// Health check — no auth, no rate limit
// ─────────────────────────────────────────

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GeoAttend API is up and running ✅",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────
// API routes — mounted here as they are built
// ─────────────────────────────────────────
// Add these two lines in the routes section of app.js:
app.use("/api/v1/teacher", require("./routes/teacherRoutes"));
app.use("/api/v1/sessions", require("./routes/sessionRoutes"));
app.use("/api/v1/student", require("./routes/studentRoutes"));
app.use("/api/v1/attendance", require("./routes/attendanceRoutes"));
// Add inside the routes section:
app.use("/api/v1/qr", require("./routes/qrAttendanceRoutes"));
// Add in the routes section of app.js:
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
// app.use('/api/v1/auth',         require('./routes/authRoutes'));
// ap// Add in the routes section of app.js:
app.use("/api/v1/location", require("./routes/locationRoutes"));
p.use("/api/v1/students", require("./routes/studentRoutes"));
// app.use('/api/v1/teachers',     require('./routes/teacherRoutes'));
// app.use('/api/v1/sessions',     require('./routes/sessionRoutes'));
// app.use('/api/v1/attendance',   require('./routes/attendanceRoutes'));
// app.use('/api/v1/admin',        require('./routes/adminRoutes'));
// app.use('/api/v1/upload',       require('./routes/uploadRoutes'));

// ─────────────────────────────────────────
// 404 handler — for any route not matched above
// ─────────────────────────────────────────

app.use(notFound);

// ─────────────────────────────────────────
// Global error handler — MUST be last
// ─────────────────────────────────────────

app.use(globalErrorHandler);

module.exports = app;
