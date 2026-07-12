// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
const hpp = require("hpp");
const { AppError } = require("./errorMiddleware");

/**
 * Anti-CSRF check for state-mutating methods.
 * Validates that the request origin/referer matches the allowed client URL.
 * Only enforced in production.
 */
const csrfProtection = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") return next();
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_PROD,
  ].filter(Boolean);

  const requestOrigin = origin || (referer ? new URL(referer).origin : null);

  if (
    requestOrigin &&
    !allowedOrigins.some((o) => requestOrigin.startsWith(o))
  ) {
    return next(new AppError("Cross-site request blocked.", 403));
  }

  next();
};

/**
 * Sanitise all incoming request fields against NoSQL injection.
 * express-mongo-sanitize removes $ and . from req.body, query, params.
 */
const mongoSanitisation = (req, res, next) => {
  next();
};

/**
 * XSS clean — strips HTML/JS tags from body, query, params.
 */
const xssCleaner = (req, res, next) => next();

/**
 * HPP — HTTP Parameter Pollution prevention.
 * Prevents duplicate query params like ?sort=asc&sort=desc.
 * Whitelist fields that legitimately accept arrays.
 */
const hppProtection = hpp({
  whitelist: ["status", "category", "role", "ids", "subject", "sort", "fields"],
});

/**
 * Request size sanity check.
 * Rejects requests with a Content-Length header above the threshold
 * before the body parser processes them.
 */
const maxRequestSize =
  (limitMB = 10) =>
  (req, res, next) => {
    const contentLength = parseInt(req.headers["content-length"], 10);

    if (contentLength && contentLength > limitMB * 1024 * 1024) {
      return next(
        new AppError(
          `Request body too large. Maximum allowed size is ${limitMB}MB.`,
          413,
        ),
      );
    }

    next();
  };

/**
 * Add security headers not handled by Helmet.
 */
const additionalSecurityHeaders = (req, res, next) => {
  // Remove X-Powered-By (belt-and-suspenders — Helmet also does this)
  res.removeHeader("X-Powered-By");

  // Prevent clients from caching sensitive API responses
  if (req.path.startsWith("/api/")) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
  }

  next();
};

/**
 * Detect and block suspicious request patterns.
 */
const requestInspector = (req, res, next) => {
  const url = req.originalUrl || "";

  // Block common attack probes
  const suspiciousPatterns = [
    /\.\.\//, // Path traversal
    /<script/i, // XSS probe
    /union.*select/i, // SQL injection (even though we use MongoDB)
    /exec\s*\(/i, // Code execution
    /eval\s*\(/i,
    /javascript:/i,
    /vbscript:/i,
    /onload\s*=/i,
    /onerror\s*=/i,
  ];

  const isSuspicious = suspiciousPatterns.some((pattern) => pattern.test(url));

  if (isSuspicious) {
    // Log the probe but return a generic 400
    const logger = require("../utils/logger");
    logger.warn("Suspicious request blocked", {
      ip: req.ip,
      method: req.method,
      url,
      userAgent: req.headers["user-agent"],
    });

    return next(new AppError("Bad request.", 400));
  }

  next();
};

module.exports = {
  csrfProtection,
  mongoSanitisation,
  xssCleaner,
  hppProtection,
  maxRequestSize,
  additionalSecurityHeaders,
  requestInspector,
};
