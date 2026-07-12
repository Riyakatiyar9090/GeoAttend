const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

// ─────────────────────────────────────────
// Ensure logs directory exists
// ─────────────────────────────────────────
const LOG_DIR = path.join(__dirname, "..", "logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

// ─────────────────────────────────────────
// Custom format: timestamp + level + message + meta
// ─────────────────────────────────────────
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.splat(),
  format.json(),
);

/**
 * Colourised console format for development.
 * Shows: [TIMESTAMP] LEVEL: message
 */
const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: "HH:mm:ss" }),
  format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? "\n" + JSON.stringify(meta, null, 2)
      : "";
    return `[${timestamp}] ${level}: ${stack || message}${metaStr}`;
  }),
);

// ─────────────────────────────────────────
// Build transports
// ─────────────────────────────────────────
const loggerTransports = [
  // Always log errors to a dedicated file
  new transports.File({
    filename: path.join(LOG_DIR, "error.log"),
    level: "error",
    format: logFormat,
    maxsize: 10 * 1024 * 1024, // 10 MB per file
    maxFiles: 5, // Keep last 5 rotations
    tailable: true,
  }),
  // Combined log (info + warn + error)
  new transports.File({
    filename: path.join(LOG_DIR, "combined.log"),
    level: "info",
    format: logFormat,
    maxsize: 20 * 1024 * 1024,
    maxFiles: 5,
    tailable: true,
  }),
];

// In development, also log to console with colours
if (process.env.NODE_ENV !== "production") {
  loggerTransports.push(
    new transports.Console({
      format: consoleFormat,
      level: process.env.LOG_LEVEL || "debug",
    }),
  );
} else {
  // In production, console logs are plain JSON (Render captures stdout)
  loggerTransports.push(
    new transports.Console({
      format: logFormat,
      level: "info",
    }),
  );
}

// ─────────────────────────────────────────
// Create logger instance
// ─────────────────────────────────────────
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: loggerTransports,
  exitOnError: false,
  // Silence logs during tests
  silent: process.env.NODE_ENV === "test",
});

/**
 * Convenience method — log HTTP request details.
 */
logger.http = (req, statusCode, responseTimeMs) => {
  logger.info("HTTP Request", {
    method: req.method,
    url: req.originalUrl,
    status: statusCode,
    responseTime: `${responseTimeMs}ms`,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers["user-agent"],
    userId: req.user?._id || "unauthenticated",
  });
};

module.exports = logger;
