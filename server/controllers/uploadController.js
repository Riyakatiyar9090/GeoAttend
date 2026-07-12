const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { AppError } = require("../middleware/errorMiddleware");
const uploadService = require("../services/uploadService");

// ═════════════════════════════════════════
// AVATAR CONTROLLERS
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   POST /api/v1/upload/avatar
// @desc    Upload or replace profile photo for any role.
//          Multer processes the multipart/form-data field named "avatar".
// @access  Private
// ─────────────────────────────────────────
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(
      'No file received. Please attach an image using the "avatar" field.',
      400,
    );
  }

  const role = req.user.role;
  let result;

  if (role === "student") {
    result = await uploadService.uploadStudentAvatar(req.user._id, req.file);
  } else if (role === "teacher") {
    result = await uploadService.uploadTeacherAvatar(req.user._id, req.file);
  } else if (role === "admin") {
    // Admin uses same logic as teacher avatar
    result = await uploadService.uploadTeacherAvatar(req.user._id, req.file);
  } else {
    throw new AppError("Unsupported role for avatar upload.", 400);
  }

  sendResponse(res, {
    statusCode: 200,
    message: "Profile photo uploaded successfully.",
    data: {
      avatar: result.avatar,
      user: result.user,
    },
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/upload/avatar
// @desc    Remove profile photo and clear avatar fields.
// @access  Private
// ─────────────────────────────────────────
const deleteAvatar = asyncHandler(async (req, res) => {
  await uploadService.deleteAvatar(req.user._id);

  sendResponse(res, {
    statusCode: 200,
    message: "Profile photo removed successfully.",
  });
});

// ═════════════════════════════════════════
// STUDENT ID CONTROLLERS
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   POST /api/v1/upload/student-id
// @desc    Upload student ID card / enrollment document.
//          Multer field name: "studentId"
// @access  Private — Student
// ─────────────────────────────────────────
const uploadStudentID = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(
      'No file received. Please attach a file using the "studentId" field.',
      400,
    );
  }

  const result = await uploadService.uploadStudentID(req.user._id, req.file);

  sendResponse(res, {
    statusCode: 201,
    message: "Student ID document uploaded successfully.",
    data: {
      document: result.document,
      studentId: result.studentId,
    },
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/upload/student-id
// @desc    Remove student ID document from Cloudinary and DB.
// @access  Private — Student
// ─────────────────────────────────────────
const deleteStudentID = asyncHandler(async (req, res) => {
  await uploadService.deleteStudentID(req.user._id);

  sendResponse(res, {
    statusCode: 200,
    message: "Student ID document deleted successfully.",
  });
});

// ═════════════════════════════════════════
// TEACHER ID CONTROLLERS
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   POST /api/v1/upload/teacher-id
// @desc    Upload teacher employee / faculty ID document.
//          Multer field name: "teacherId"
// @access  Private — Teacher
// ─────────────────────────────────────────
const uploadTeacherID = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(
      'No file received. Please attach a file using the "teacherId" field.',
      400,
    );
  }

  const result = await uploadService.uploadTeacherID(req.user._id, req.file);

  sendResponse(res, {
    statusCode: 201,
    message: "Teacher ID document uploaded successfully.",
    data: {
      document: result.document,
      teacherId: result.teacherId,
    },
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/upload/teacher-id
// @desc    Remove teacher ID document.
// @access  Private — Teacher
// ─────────────────────────────────────────
const deleteTeacherID = asyncHandler(async (req, res) => {
  await uploadService.deleteTeacherID(req.user._id);

  sendResponse(res, {
    statusCode: 200,
    message: "Teacher ID document deleted successfully.",
  });
});

// ═════════════════════════════════════════
// SHARED
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   GET /api/v1/upload/my-files
// @desc    List all uploaded files for the logged-in user.
// @access  Private
// ─────────────────────────────────────────
const getMyFiles = asyncHandler(async (req, res) => {
  const files = await uploadService.getUploadedFiles(
    req.user._id,
    req.user.role,
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Uploaded files fetched.",
    data: files,
  });
});

// ─────────────────────────────────────────
// Multer error handler — converts MulterError
// to a clean AppError before globalErrorHandler sees it
// ─────────────────────────────────────────
const handleMulterError = (err, req, res, next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return next(
      new AppError("File is too large. Maximum allowed size is 15MB.", 413),
    );
  }
  if (err?.code === "LIMIT_FILE_COUNT") {
    return next(
      new AppError("Only one file can be uploaded per request.", 400),
    );
  }
  if (err?.code === "LIMIT_UNEXPECTED_FILE") {
    return next(
      new AppError(
        `Unexpected field name "${err.field}". Please use the correct field name.`,
        400,
      ),
    );
  }
  next(err);
};

module.exports = {
  uploadAvatar,
  deleteAvatar,
  uploadStudentID,
  deleteStudentID,
  uploadTeacherID,
  deleteTeacherID,
  getMyFiles,
  handleMulterError,
};
