const User = require("../models/User");
const { AppError } = require("./errorMiddleware");
const { verifyToken } = require("../utils/tokenUtils");

/**
 * Protect routes — verify JWT from Authorization header or cookie.
 * Attaches full user document to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(
        new AppError("Access denied. Please log in to continue.", 401),
      );
    }

    // Verify and decode
    const decoded = verifyToken(token);

    // Fetch fresh user from DB — catches deleted / role-changed users
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("This account no longer exists.", 401));
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "Password was recently changed. Please log in again.",
          401,
        ),
      );
    }

    if (user.status === "blocked") {
      return next(new AppError("Your account has been blocked.", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth — attaches req.user if token is valid,
 * but does NOT block unauthenticated requests.
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select("-password");
      if (user) req.user = user;
    }
    next();
  } catch {
    next(); // Silently continue even if token is invalid
  }
};

module.exports = { protect, optionalAuth };
