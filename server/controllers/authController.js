const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { AppError } = require("../middleware/errorMiddleware");
const authService = require("../services/authService");
const emailService = require("../services/emailService");
const User = require("../models/User");
const {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  attachCookies,
  clearCookies,
} = require("../utils/tokenUtils");

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/register/student
// @access  Public
// ─────────────────────────────────────────
const registerStudent = asyncHandler(async (req, res) => {
  const user = await authService.registerStudent(req.body);

  sendResponse(res, {
    statusCode: 201,
    message:
      "Registration successful. Please verify your email address — an OTP has been sent.",
    data: {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/register/teacher
// @access  Public
// ─────────────────────────────────────────
const registerTeacher = asyncHandler(async (req, res) => {
  const user = await authService.registerTeacher(req.body);

  sendResponse(res, {
    statusCode: 201,
    message:
      "Registration successful. Please verify your email address — an OTP has been sent.",
    data: {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp, purpose } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    throw new AppError("No account found with this email address.", 404);

  // Validate OTP via service (handles expiry + attempts)
  await authService.validateOTP({ userId: user._id, rawOTP: otp, purpose });

  // If email verification — activate account
  if (purpose === "email_verification") {
    user.isEmailVerified = true;
    user.status = "active";
    await user.save({ validateBeforeSave: false });

    // Send welcome email asynchronously (don't await — keep response fast)
    emailService
      .sendWelcomeEmail({
        name: user.firstName,
        email: user.email,
        role: user.role,
      })
      .catch((err) => console.error("Welcome email failed:", err.message));
  }

  sendResponse(res, {
    message:
      purpose === "email_verification"
        ? "Email verified successfully. You can now log in."
        : "OTP verified successfully.",
    data: { email, purpose, verified: true },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/resend-otp
// @access  Public
// ─────────────────────────────────────────
const resendOTP = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    throw new AppError("No account found with this email address.", 404);

  // Prevent re-sending if already verified
  if (purpose === "email_verification" && user.isEmailVerified) {
    throw new AppError("This email address is already verified.", 400);
  }

  await authService.createAndSendOTP({
    userId: user._id,
    name: user.firstName,
    email: user.email,
    purpose,
  });

  sendResponse(res, {
    message: `A new OTP has been sent to ${email}. It will expire in 10 minutes.`,
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/login
// @access  Public
// ─────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await authService.loginUser({ email, password, role });

  // Generate tokens
  const tokenPayload = { id: user._id, role: user.role, email: user.email };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  // Attach as HttpOnly cookies
  attachCookies(res, accessToken, refreshToken);

  // Build profile data (exclude sensitive fields)
  const userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    lastLogin: user.lastLogin,
    profileRef: user.profileRef,
    profileModel: user.profileModel,
  };

  sendResponse(res, {
    message: `Welcome back, ${user.firstName}!`,
    data: {
      user: userData,
      accessToken, // Also return in body for clients that can't use cookies
      role: user.role,
    },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/logout
// @access  Private
// ─────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  clearCookies(res);
  sendResponse(res, { message: "Logged out successfully." });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/refresh-token
// @access  Public (uses refresh cookie)
// ─────────────────────────────────────────
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token)
    throw new AppError("No refresh token provided. Please log in again.", 401);

  // Verify refresh token
  const decoded = verifyToken(token, true);

  // Confirm user still exists and is active
  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("User no longer exists.", 401);
  if (user.status === "blocked")
    throw new AppError("Account has been blocked.", 403);

  // Issue fresh access token
  const payload = { id: user._id, role: user.role, email: user.email };
  const newAccess = signAccessToken(payload);
  const newRefresh = signRefreshToken(payload);

  attachCookies(res, newAccess, newRefresh);

  sendResponse(res, {
    message: "Token refreshed successfully.",
    data: { accessToken: newAccess },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Service sends OTP — does NOT throw if email not found (security)
  await authService.forgotPassword({ email });

  sendResponse(res, {
    // Same message whether email exists or not — prevents user enumeration
    message:
      "If an account exists for this email, a password reset OTP has been sent.",
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/reset-password
// @access  Public
// ─────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  await authService.resetPassword({ email, otp, newPassword });

  // Clear auth cookies in case user was logged in on another tab
  clearCookies(res);

  sendResponse(res, {
    message:
      "Password reset successfully. Please log in with your new password.",
  });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/auth/change-password
// @access  Private
// ─────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Fetch user with password (select:false by default)
  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError("Current password is incorrect.", 400);

  if (currentPassword === newPassword) {
    throw new AppError(
      "New password must be different from the current password.",
      400,
    );
  }

  user.password = newPassword; // Pre-save hook hashes it
  await user.save();

  // Invalidate existing sessions by rotating cookies
  const payload = { id: user._id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  attachCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    message: "Password changed successfully.",
    data: { accessToken },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/auth/me
// @access  Private
// ─────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware with full user doc
  const user = await User.findById(req.user._id).populate("profileRef");

  sendResponse(res, {
    message: "Profile fetched successfully.",
    data: { user },
  });
});

module.exports = {
  registerStudent,
  registerTeacher,
  verifyOTP,
  resendOTP,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};
