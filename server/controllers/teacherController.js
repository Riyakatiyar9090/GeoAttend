const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { AppError } = require("../middleware/errorMiddleware");
const teacherService = require("../services/teacherService");
const analyticsService = require("../services/analyticsService");

// ─────────────────────────────────────────
// @route   GET /api/v1/teacher/dashboard
// @access  Private — Teacher
// ─────────────────────────────────────────
const getDashboard = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTeacherDashboard(req.user._id);
  sendResponse(res, {
    message: "Dashboard data fetched.",
    data,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/teacher/analytics
// @access  Private — Teacher
// ─────────────────────────────────────────
const getAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTeacherAnalytics(req.user._id);
  sendResponse(res, {
    message: "Analytics fetched.",
    data,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/teacher/profile
// @access  Private — Teacher
// ─────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const { user, profile } = await teacherService.getProfile(req.user._id);
  sendResponse(res, {
    message: "Profile fetched.",
    data: { user, profile },
  });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/teacher/profile
// @access  Private — Teacher
// ─────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    designation,
    department,
    subjects,
    qualification,
    experience,
    officeRoom,
    officeHours,
    college,
    gender,
    dateOfBirth,
    address,
  } = req.body;

  const userData = { firstName, lastName, phone };
  const teacherData = {
    designation,
    department,
    subjects,
    qualification,
    experience,
    officeRoom,
    officeHours,
    college,
    gender,
    dateOfBirth,
    address,
  };

  const { user, profile } = await teacherService.updateProfile(
    req.user._id,
    userData,
    teacherData,
  );

  sendResponse(res, {
    message: "Profile updated successfully.",
    data: { user, profile },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/teacher/profile/avatar
// @access  Private — Teacher
// ─────────────────────────────────────────
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("Please upload an image file.", 400);

  const avatar = await teacherService.uploadAvatar(
    req.user._id,
    req.file.buffer,
  );
  sendResponse(res, {
    message: "Profile photo updated successfully.",
    data: { avatar },
  });
});

// ─────────────────────────────────────────
// Notification handlers
// ─────────────────────────────────────────

const getNotifications = asyncHandler(async (req, res) => {
  const result = await teacherService.getNotifications(req.user._id, req.query);
  sendResponse(res, {
    message: "Notifications fetched.",
    data: result.notifications,
    meta: { unreadCount: result.unreadCount, pagination: result.pagination },
  });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notif = await teacherService.markNotificationRead(
    req.params.notifId,
    req.user._id,
  );
  sendResponse(res, {
    message: "Notification marked as read.",
    data: { notif },
  });
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const count = await teacherService.markAllNotificationsRead(req.user._id);
  sendResponse(res, { message: `${count} notification(s) marked as read.` });
});

const deleteNotification = asyncHandler(async (req, res) => {
  await teacherService.deleteNotification(req.params.notifId, req.user._id);
  sendResponse(res, { message: "Notification deleted." });
});

// ─────────────────────────────────────────
// Settings
// ─────────────────────────────────────────

const getSettings = asyncHandler(async (req, res) => {
  const settings = await teacherService.getSettings(req.user._id);
  sendResponse(res, { message: "Settings fetched.", data: { settings } });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await teacherService.updateSettings(req.user._id, req.body);
  sendResponse(res, { message: "Settings updated.", data: { settings } });
});

module.exports = {
  getDashboard,
  getAnalytics,
  getProfile,
  updateProfile,
  uploadAvatar,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getSettings,
  updateSettings,
};
