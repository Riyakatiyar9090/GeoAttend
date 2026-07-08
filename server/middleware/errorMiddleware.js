/**
 * Custom error class for operational errors.
 * Attach an HTTP status code alongside the message.
 *
 * Usage: throw new AppError('User not found', 404);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Marks errors WE deliberately created

    Error.captureStackTrace(this, this.constructor);
  }
}

// ─────────────────────────────────────────
// Specific error handlers
// ─────────────────────────────────────────

/** Handle Mongoose CastError (e.g. invalid ObjectId) */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/** Handle Mongoose duplicate key error (code 11000) */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value for field '${field}': '${value}'. Please use a different value.`;
  return new AppError(message, 409);
};

/** Handle Mongoose validation error */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Validation failed: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/** Handle expired JWT */
const handleJWTExpiredError = () =>
  new AppError("Your session has expired. Please log in again.", 401);

/** Handle invalid JWT */
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

// ─────────────────────────────────────────
// Response senders
// ─────────────────────────────────────────

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // Operational errors: safe to expose to the client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Programming / unknown errors: do NOT leak details
  console.error("💥 UNHANDLED ERROR:", err);
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong on the server. Please try again later.",
  });
};

// ─────────────────────────────────────────
// Global error handler middleware
// Must have FOUR parameters so Express
// recognises it as an error handler.
// ─────────────────────────────────────────

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    // Clone the error so we don't mutate the original
    let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
    error.message = err.message;

    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (error.name === "JsonWebTokenError") error = handleJWTError();

    sendErrorProd(error, res);
  }
};

/** Catch-all for unhandled routes */
const notFound = (req, res, next) => {
  const err = new AppError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
  );
  next(err);
};

module.exports = { AppError, globalErrorHandler, notFound };
