const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { AppError } = require("../middleware/errorMiddleware");
const studentService = require("../services/studentService");
const studentAnalyticsService = require("../services/studentAnalyticsService");

// ─────────────────────────────────────────
// @route   GET /api/v1/student/dashboard
// @access  Private — Student
// ─────────────────────────────────────────
const getDashboard = asyncHandler(async (req, res) => {
  const data = await studentAnalyticsService.getStudentDashboard(req.user._id);
  sendResponse(res, {
    message: "Student dashboard fetched.",
    data,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/student/analytics
// @access  Private — Student
// ─────────────────────────────────────────
const getAnalytics = asyncHandler(async (req, res) => {
  const data = await studentAnalyticsService.getStudentAnalytics(req.user._id);
  sendResponse(res, {
    message: "Student analytics fetched.",
    data,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/student/profile
// @access  Private — Student
// ─────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const { user, profile } = await studentService.getProfile(req.user._id);
  sendResponse(res, {
    message: "Profile fetched.",
    data: { user, profile },
  });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/student/profile
// @access  Private — Student
// ─────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    course,
    branch,
    semester,
    section,
    college,
    department,
    admissionYear,
    graduationYear,
    gender,
    dateOfBirth,
    address,
    emergencyContact,
  } = req.body;

  const userData = { firstName, lastName, phone };
  const studentData = {
    course,
    branch,
    semester,
    section,
    college,
    department,
    admissionYear,
    graduationYear,
    gender,
    dateOfBirth,
    address,
    emergencyContact,
  };

  const { user, profile } = await studentService.updateProfile(
    req.user._id,
    userData,
    studentData,
  );

  sendResponse(res, {
    message: "Profile updated successfully.",
    data: { user, profile },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/student/profile/avatar
// @access  Private — Student
// ─────────────────────────────────────────
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("Please upload an image file.", 400);

  const avatar = await studentService.uploadAvatar(
    req.user._id,
    req.file.buffer,
  );
  sendResponse(res, {
    message: "Profile photo updated successfully.",
    data: { avatar },
  });
});

// ─────────────────────────────────────────
// Notification controllers
// ─────────────────────────────────────────

const getNotifications = asyncHandler(async (req, res) => {
  const result = await studentService.getNotifications(req.user._id, req.query);
  sendResponse(res, {
    message: "Notifications fetched.",
    data: result.notifications,
    meta: { unreadCount: result.unreadCount, pagination: result.pagination },
  });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notif = await studentService.markNotificationRead(
    req.params.notifId,
    req.user._id,
  );
  sendResponse(res, {
    message: "Notification marked as read.",
    data: { notif },
  });
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const count = await studentService.markAllNotificationsRead(req.user._id);
  sendResponse(res, { message: `${count} notification(s) marked as read.` });
});

const deleteNotification = asyncHandler(async (req, res) => {
  await studentService.deleteNotification(req.params.notifId, req.user._id);
  sendResponse(res, { message: "Notification deleted." });
});

// ─────────────────────────────────────────
// Settings
// ─────────────────────────────────────────

const getSettings = asyncHandler(async (req, res) => {
  const settings = await studentService.getSettings(req.user._id);
  sendResponse(res, { message: "Settings fetched.", data: { settings } });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await studentService.updateSettings(req.user._id, req.body);
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
