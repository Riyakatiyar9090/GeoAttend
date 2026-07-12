const logger = require("../utils/logger");

/**
 * Response-time tracking middleware.
 * Logs every request with method, URL, status and duration
 * after the response is sent — using the 'finish' event.
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Attach response-finish listener
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logLevel =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    logger[logLevel]("Request completed", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection?.remoteAddress,
      userId: req.user?._id || "unauthenticated",
      userAgent: req.headers["user-agent"],
      contentLength: res.getHeader("content-length") || 0,
      referrer: req.headers["referer"] || "",
    });
  });

  // Log request errors
  res.on("error", (err) => {
    logger.error("Response error", {
      error: err.message,
      url: req.originalUrl,
    });
  });

  next();
};

module.exports = requestLogger;
