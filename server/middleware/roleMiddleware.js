const { AppError } = require("./errorMiddleware");

/**
 * Restrict access to specific roles.
 * Always used AFTER the protect middleware.
 *
 * Usage: router.get('/admin', protect, restrictTo('admin'), handler)
 *
 * @param {...string} roles - Allowed roles ('student', 'teacher', 'admin')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: [${roles.join(" | ")}]. Your role: ${req.user.role}.`,
          403,
        ),
      );
    }

    next();
  };
};

module.exports = { restrictTo };
