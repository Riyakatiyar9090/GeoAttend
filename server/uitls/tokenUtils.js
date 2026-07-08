const jwt = require("jsonwebtoken");

/**
 * Sign a JWT access token.
 * @param {object} payload - { id, role, email }
 */
const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

/**
 * Sign a short-lived refresh token.
 */
const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });

/**
 * Verify any JWT and return the decoded payload.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 * @param {string} token
 * @param {boolean} isRefresh - use refresh secret if true
 */
const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh
    ? process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    : process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

/**
 * Attach access + refresh tokens as HttpOnly cookies.
 * @param {object} res - Express response
 * @param {string} accessToken
 * @param {string} refreshToken
 */
const attachCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Access token cookie — expires with JWT
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  // Refresh token cookie — longer lived
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    path: "/api/v1/auth/refresh-token", // Only sent on this route
  });
};

/**
 * Clear auth cookies on logout.
 */
const clearCookies = (res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    path: "/api/v1/auth/refresh-token",
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  attachCookies,
  clearCookies,
};
