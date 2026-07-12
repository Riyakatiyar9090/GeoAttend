/**
 * Centralised notification template factory.
 *
 * Every template returns the exact shape expected by
 * Notification.send() — so controllers never construct
 * raw notification objects by hand.
 *
 * Shape returned:
 * {
 *   recipient, recipientRole, sender?,
 *   title, message, type, category,
 *   priority, actionUrl, relatedDocument?
 * }
 */

// ─────────────────────────────────────────
// ATTENDANCE TEMPLATES
// ─────────────────────────────────────────

const attendanceMarked = ({
  recipientId,
  senderId,
  subject,
  sessionCode,
  status,
}) => ({
  recipient: recipientId,
  recipientRole: "student",
  sender: senderId || null,
  title: `✅ Attendance Confirmed — ${subject}`,
  message: `Your attendance for ${subject} (Session: ${sessionCode}) has been recorded as ${status === "late" ? "Late" : "Present"}.`,
  type: "attendance_marked",
  category: "attendance",
  priority: "normal",
  actionUrl: "/student/history",
});

const attendanceMissed = ({ recipientId, senderId, subject, sessionCode }) => ({
  recipient: recipientId,
  recipientRole: "student",
  sender: senderId || null,
  title: `🔴 Attendance Missed — ${subject}`,
  message: `You missed the attendance session for ${subject} (${sessionCode}). This will be recorded as Absent.`,
  type: "attendance_missed",
  category: "attendance",
  priority: "high",
  actionUrl: "/student/history",
});

const lowAttendanceWarning = ({
  recipientId,
  recipientRole = "student",
  senderId,
  subject,
  percentage,
  classesNeeded,
  sessionCode,
}) => ({
  recipient: recipientId,
  recipientRole,
  sender: senderId || null,
  title: `⚠️ Low Attendance Alert — ${subject}`,
  message:
    recipientRole === "student"
      ? `Your attendance in ${subject} has dropped to ${percentage}%. You need ${classesNeeded} more class(es) to reach 75%.`
      : `Session ${sessionCode} — only ${percentage}% of students have marked attendance so far.`,
  type: "low_attendance_warning",
  category: "attendance",
  priority: "high",
  actionUrl:
    recipientRole === "student"
      ? "/student/analytics"
      : `/teacher/sessions/${sessionCode}/live`,
});

const qrScanFailed = ({ recipientId, subject, reason }) => ({
  recipient: recipientId,
  recipientRole: "student",
  title: `📵 QR Scan Failed — ${subject}`,
  message: `Your QR scan for ${subject} failed. Reason: ${reason || "Invalid or expired QR code"}. Please ask your teacher to refresh the QR.`,
  type: "qr_scan_failed",
  category: "attendance",
  priority: "normal",
  actionUrl: "/student/sessions",
});

const locationVerificationFailed = ({
  recipientId,
  subject,
  distance,
  radius,
}) => ({
  recipient: recipientId,
  recipientRole: "student",
  title: `📍 Location Verification Failed — ${subject}`,
  message: `You were ${distance}m from the classroom (allowed: ${radius}m) during the ${subject} session. Attendance was not recorded.`,
  type: "location_failed",
  category: "attendance",
  priority: "normal",
  actionUrl: "/student/sessions",
});

// ─────────────────────────────────────────
// SESSION TEMPLATES
// ─────────────────────────────────────────

const sessionStarted = ({
  recipientId,
  recipientRole = "student",
  senderId,
  subject,
  sessionCode,
  roomNumber,
}) => ({
  recipient: recipientId,
  recipientRole,
  sender: senderId,
  title: `🚀 Session Started — ${subject}`,
  message: `An attendance session for ${subject} (${sessionCode}) has started${roomNumber ? ` in ${roomNumber}` : ""}. Scan the QR code to mark your attendance.`,
  type: "session_started",
  category: "sessions",
  priority: "high",
  actionUrl:
    recipientRole === "student"
      ? "/student/sessions"
      : `/teacher/sessions/${sessionCode}/live`,
});

const sessionClosed = ({
  recipientId,
  recipientRole = "student",
  senderId,
  subject,
  sessionCode,
  presentCount,
  totalCount,
}) => ({
  recipient: recipientId,
  recipientRole,
  sender: senderId || null,
  title: `🏁 Session Ended — ${subject}`,
  message:
    recipientRole === "student"
      ? `The attendance session for ${subject} (${sessionCode}) has been closed by your teacher.`
      : `Session ${sessionCode} for ${subject} has been closed. ${presentCount}/${totalCount} students present.`,
  type: "session_closed",
  category: "sessions",
  priority: "normal",
  actionUrl:
    recipientRole === "student" ? "/student/history" : "/teacher/attendance",
});

const sessionExpiringSoon = ({
  recipientId,
  subject,
  sessionCode,
  minutesLeft,
}) => ({
  recipient: recipientId,
  recipientRole: "student",
  title: `⏰ Session Expiring — ${subject}`,
  message: `The attendance session for ${subject} (${sessionCode}) expires in ${minutesLeft} minute(s). Mark your attendance now.`,
  type: "session_expiring",
  category: "sessions",
  priority: "urgent",
  actionUrl: "/student/sessions",
});

const qrRefreshed = ({ recipientId, subject, sessionCode }) => ({
  recipient: recipientId,
  recipientRole: "teacher",
  title: `🔳 QR Code Refreshed — ${subject}`,
  message: `The QR code for ${subject} session (${sessionCode}) has been automatically refreshed.`,
  type: "qr_refreshed",
  category: "sessions",
  priority: "low",
  actionUrl: `/teacher/sessions`,
});

// ─────────────────────────────────────────
// STUDENT TEMPLATES
// ─────────────────────────────────────────

const newStudentJoined = ({
  recipientId,
  senderId,
  studentName,
  enrollmentNo,
  department,
}) => ({
  recipient: recipientId,
  recipientRole: "teacher",
  sender: senderId || null,
  title: `👤 New Student Joined`,
  message: `${studentName} (${enrollmentNo}) from ${department} has registered and joined your class.`,
  type: "new_student_joined",
  category: "students",
  priority: "normal",
  actionUrl: "/teacher/students",
});

const studentRequest = ({
  recipientId,
  senderId,
  studentName,
  requestType,
  subject,
}) => ({
  recipient: recipientId,
  recipientRole: "teacher",
  sender: senderId,
  title: `📋 Student Request — ${requestType}`,
  message: `${studentName} has submitted a ${requestType} request for ${subject}.`,
  type: "student_request",
  category: "students",
  priority: "normal",
  actionUrl: "/teacher/students",
});

// ─────────────────────────────────────────
// ANNOUNCEMENT TEMPLATES
// ─────────────────────────────────────────

const announcement = ({
  recipientId,
  recipientRole,
  senderId,
  announcementTitle,
  body,
  actionUrl,
}) => ({
  recipient: recipientId,
  recipientRole,
  sender: senderId || null,
  title: `📢 ${announcementTitle}`,
  message: body,
  type: "faculty_announcement",
  category: "announcements",
  priority: "normal",
  actionUrl:
    actionUrl ||
    (recipientRole === "student"
      ? "/student/notifications"
      : "/teacher/notifications"),
});

const examSchedule = ({ recipientId, examTitle, date, venue }) => ({
  recipient: recipientId,
  recipientRole: "student",
  title: `🎓 Exam Schedule — ${examTitle}`,
  message: `${examTitle} is scheduled on ${date}${venue ? ` at ${venue}` : ""}.`,
  type: "exam_schedule",
  category: "announcements",
  priority: "high",
  actionUrl: "/student/notifications",
});

const holidayNotice = ({ recipientId, recipientRole, holidayName, date }) => ({
  recipient: recipientId,
  recipientRole,
  title: `🌐 Holiday Notice — ${holidayName}`,
  message: `${holidayName} on ${date}. No classes scheduled.`,
  type: "holiday_notice",
  category: "announcements",
  priority: "low",
  actionUrl:
    recipientRole === "student"
      ? "/student/notifications"
      : "/teacher/notifications",
});

// ─────────────────────────────────────────
// SYSTEM TEMPLATES
// ─────────────────────────────────────────

const systemUpdate = ({
  recipientId,
  recipientRole,
  version,
  description,
}) => ({
  recipient: recipientId,
  recipientRole,
  title: `🔧 GeoAttend Updated — v${version}`,
  message:
    description ||
    `GeoAttend has been updated to v${version}. Enjoy the latest features and improvements.`,
  type: "system_update",
  category: "system",
  priority: "low",
  actionUrl: null,
});

const securityAlert = ({ recipientId, recipientRole, description }) => ({
  recipient: recipientId,
  recipientRole,
  title: `🛡️ Security Alert`,
  message:
    description ||
    "Unusual activity was detected on your account. Please review your recent sessions.",
  type: "security_alert",
  category: "security",
  priority: "urgent",
  actionUrl:
    recipientRole === "student" ? "/student/settings" : "/teacher/settings",
});

const accountVerified = ({ recipientId, recipientRole }) => ({
  recipient: recipientId,
  recipientRole,
  title: `✅ Account Verified`,
  message: `Your GeoAttend account has been successfully verified. You can now access all features.`,
  type: "account_verified",
  category: "system",
  priority: "normal",
  actionUrl: null,
});

const passwordChanged = ({ recipientId, recipientRole }) => ({
  recipient: recipientId,
  recipientRole,
  title: `🔒 Password Changed`,
  message: `Your GeoAttend password was changed. If you did not do this, contact support immediately.`,
  type: "password_changed",
  category: "security",
  priority: "high",
  actionUrl: null,
});

const achievementUnlocked = ({
  recipientId,
  achievementTitle,
  description,
}) => ({
  recipient: recipientId,
  recipientRole: "student",
  title: `🏆 Achievement Unlocked — ${achievementTitle}`,
  message:
    description ||
    `Congratulations! You've earned the "${achievementTitle}" badge.`,
  type: "achievement_unlocked",
  category: "announcements",
  priority: "normal",
  actionUrl: "/student/analytics",
});

const reportReady = ({ recipientId, recipientRole, reportName }) => ({
  recipient: recipientId,
  recipientRole,
  title: `📊 Report Ready — ${reportName}`,
  message: `Your ${reportName} is ready for download.`,
  type: "report_ready",
  category: "system",
  priority: "normal",
  actionUrl:
    recipientRole === "student" ? "/student/history" : "/teacher/attendance",
});

module.exports = {
  // Attendance
  attendanceMarked,
  attendanceMissed,
  lowAttendanceWarning,
  qrScanFailed,
  locationVerificationFailed,
  // Sessions
  sessionStarted,
  sessionClosed,
  sessionExpiringSoon,
  qrRefreshed,
  // Students
  newStudentJoined,
  studentRequest,
  // Announcements
  announcement,
  examSchedule,
  holidayNotice,
  // System
  systemUpdate,
  securityAlert,
  accountVerified,
  passwordChanged,
  achievementUnlocked,
  reportReady,
};
