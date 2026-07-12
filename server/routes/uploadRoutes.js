const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

// All upload routes require authentication
router.use(protect);

// ─────────────────────────────────────────
// AVATAR — Any authenticated user
// ─────────────────────────────────────────

/**
 * POST /api/v1/upload/avatar
 * Content-Type: multipart/form-data
 * Field name:   avatar
 * Accepted:     JPEG, PNG, WebP — max 5MB, min 100×100px
 *
 * Response:
 * {
 *   "data": {
 *     "avatar": { "public_id": "...", "url": "https://res.cloudinary.com/..." },
 *     "user":   { "_id": "...", "firstName": "...", "email": "..." }
 *   }
 * }
 */
router
  .route("/avatar")
  .post(upload.single("avatar"), ctrl.handleMulterError, ctrl.uploadAvatar)
  .delete(ctrl.deleteAvatar);

// ─────────────────────────────────────────
// STUDENT ID — Student only
// ─────────────────────────────────────────

/**
 * POST /api/v1/upload/student-id
 * Content-Type: multipart/form-data
 * Field name:   studentId
 * Accepted:     JPEG, PNG, WebP, PDF — max 10MB
 *
 * Response:
 * {
 *   "data": {
 *     "document": {
 *       "public_id":  "...",
 *       "url":        "https://...",
 *       "format":     "jpg",
 *       "uploadedAt": "2026-07-08T...",
 *       "fileName":   "student_id.jpg",
 *       "fileSizeMB": 0.42
 *     }
 *   }
 * }
 *
 * DELETE /api/v1/upload/student-id
 * Removes the document from Cloudinary and clears the DB field.
 */
router
  .route("/student-id")
  .post(
    restrictTo("student"),
    upload.single("studentId"),
    ctrl.handleMulterError,
    ctrl.uploadStudentID,
  )
  .delete(restrictTo("student"), ctrl.deleteStudentID);

// ─────────────────────────────────────────
// TEACHER ID — Teacher + Admin
// ─────────────────────────────────────────

/**
 * POST /api/v1/upload/teacher-id
 * Content-Type: multipart/form-data
 * Field name:   teacherId
 * Accepted:     JPEG, PNG, WebP, PDF — max 10MB
 *
 * DELETE /api/v1/upload/teacher-id
 */
router
  .route("/teacher-id")
  .post(
    restrictTo("teacher", "admin"),
    upload.single("teacherId"),
    ctrl.handleMulterError,
    ctrl.uploadTeacherID,
  )
  .delete(restrictTo("teacher", "admin"), ctrl.deleteTeacherID);

// ─────────────────────────────────────────
// LIST FILES — Any authenticated user
// ─────────────────────────────────────────

/**
 * GET /api/v1/upload/my-files
 * Returns { avatar, idDocument } for the logged-in user.
 */
router.get("/my-files", ctrl.getMyFiles);

module.exports = router;
