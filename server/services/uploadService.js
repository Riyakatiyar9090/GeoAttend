const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { AppError } = require("../middleware/errorMiddleware");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  replaceOnCloudinary,
  FOLDERS,
} = require("../middleware/uploadMiddleware");
const {
  validateFile,
  assertNonEmpty,
  sanitiseFilename,
  validateImageDimensions,
} = require("../utils/fileValidator");

// ─────────────────────────────────────────
// Avatar — Student
// ─────────────────────────────────────────

/**
 * Upload or replace a student's profile avatar.
 *
 * Process:
 *   1. Validate file type, extension, size, dimensions.
 *   2. Upload to Cloudinary (auto-replaces via public_id).
 *   3. Delete old image from Cloudinary if it existed.
 *   4. Persist new avatar { public_id, url } on User document.
 *
 * @param {string} userId
 * @param {object} file   - Multer file object (buffer in memory)
 * @returns {{ avatar: { public_id, url }, user }}
 */
const uploadStudentAvatar = async (userId, file) => {
  assertNonEmpty(file);
  validateFile(file, "avatar");

  // Dimension check — avatars must be at least 100×100
  validateImageDimensions(file.buffer, {
    minWidth: 100,
    minHeight: 100,
    maxWidth: 4000,
    maxHeight: 4000,
  });

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  const baseName = sanitiseFilename(file.originalname);
  const publicId = `student_avatar_${userId}_${baseName}`;

  // Upload new → Cloudinary auto-overwrites if same public_id
  const result = await replaceOnCloudinary(
    file.buffer,
    FOLDERS.avatar_student,
    user.avatar?.public_id, // Delete old one after uploading new
    {
      publicId,
      resourceType: "image",
      overwrite: true,
      // Apply a standard transformation: crop to square, strip EXIF
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto:good", fetch_format: "auto" },
      ],
      tags: ["student", "avatar"],
    },
  );

  // Persist to DB
  user.avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };
  await user.save({ validateBeforeSave: false });

  return {
    avatar: user.avatar,
    user: { _id: user._id, firstName: user.firstName, email: user.email },
  };
};

// ─────────────────────────────────────────
// Avatar — Teacher
// ─────────────────────────────────────────

const uploadTeacherAvatar = async (userId, file) => {
  assertNonEmpty(file);
  validateFile(file, "avatar");

  validateImageDimensions(file.buffer, {
    minWidth: 100,
    minHeight: 100,
    maxWidth: 4000,
    maxHeight: 4000,
  });

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  const baseName = sanitiseFilename(file.originalname);
  const publicId = `teacher_avatar_${userId}_${baseName}`;

  const result = await replaceOnCloudinary(
    file.buffer,
    FOLDERS.avatar_teacher,
    user.avatar?.public_id,
    {
      publicId,
      resourceType: "image",
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto:good", fetch_format: "auto" },
      ],
      tags: ["teacher", "avatar"],
    },
  );

  user.avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };
  await user.save({ validateBeforeSave: false });

  return {
    avatar: user.avatar,
    user: { _id: user._id, firstName: user.firstName, email: user.email },
  };
};

// ─────────────────────────────────────────
// Delete avatar
// ─────────────────────────────────────────

const deleteAvatar = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  if (!user.avatar?.public_id) {
    throw new AppError("No profile photo to delete.", 400);
  }

  await deleteFromCloudinary(user.avatar.public_id, "image");

  user.avatar = { public_id: null, url: null };
  await user.save({ validateBeforeSave: false });

  return true;
};

// ─────────────────────────────────────────
// Student ID document
// ─────────────────────────────────────────

/**
 * Upload a student ID card/document.
 * Stored on the Student profile document.
 */
const uploadStudentID = async (userId, file) => {
  assertNonEmpty(file);
  validateFile(file, "student_id");

  const student = await Student.findOne({ user: userId });
  if (!student) throw new AppError("Student profile not found.", 404);

  const baseName = sanitiseFilename(file.originalname);
  const isPDF = file.mimetype === "application/pdf";
  const publicId = `student_id_${userId}_${baseName}`;

  // If student already has an ID document — delete old one first
  const oldPublicId = student.idDocument?.public_id;

  const result = await replaceOnCloudinary(
    file.buffer,
    FOLDERS.student_id,
    oldPublicId,
    {
      publicId,
      resourceType: isPDF ? "raw" : "image",
      overwrite: true,
      // For images, apply light optimisation
      ...(!isPDF && {
        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
      }),
      tags: ["student", "id-document"],
    },
  );

  // Persist to Student document
  student.idDocument = {
    public_id: result.public_id,
    url: result.secure_url,
    format: result.format,
    uploadedAt: new Date(),
    fileName: file.originalname,
    fileSizeMB: parseFloat((file.size / 1024 / 1024).toFixed(2)),
  };
  await student.save({ validateBeforeSave: false });

  return {
    document: student.idDocument,
    studentId: student._id,
  };
};

// ─────────────────────────────────────────
// Teacher ID document
// ─────────────────────────────────────────

const uploadTeacherID = async (userId, file) => {
  assertNonEmpty(file);
  validateFile(file, "teacher_id");

  const teacher = await Teacher.findOne({ user: userId });
  if (!teacher) throw new AppError("Teacher profile not found.", 404);

  const baseName = sanitiseFilename(file.originalname);
  const isPDF = file.mimetype === "application/pdf";
  const publicId = `teacher_id_${userId}_${baseName}`;

  const oldPublicId = teacher.idDocument?.public_id;

  const result = await replaceOnCloudinary(
    file.buffer,
    FOLDERS.teacher_id,
    oldPublicId,
    {
      publicId,
      resourceType: isPDF ? "raw" : "image",
      overwrite: true,
      ...(!isPDF && {
        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
      }),
      tags: ["teacher", "id-document"],
    },
  );

  teacher.idDocument = {
    public_id: result.public_id,
    url: result.secure_url,
    format: result.format,
    uploadedAt: new Date(),
    fileName: file.originalname,
    fileSizeMB: parseFloat((file.size / 1024 / 1024).toFixed(2)),
  };
  await teacher.save({ validateBeforeSave: false });

  return {
    document: teacher.idDocument,
    teacherId: teacher._id,
  };
};

// ─────────────────────────────────────────
// Delete ID document
// ─────────────────────────────────────────

const deleteStudentID = async (userId) => {
  const student = await Student.findOne({ user: userId });
  if (!student) throw new AppError("Student profile not found.", 404);

  if (!student.idDocument?.public_id) {
    throw new AppError("No ID document to delete.", 400);
  }

  const isPDF = student.idDocument.format === "pdf";
  await deleteFromCloudinary(
    student.idDocument.public_id,
    isPDF ? "raw" : "image",
  );

  student.idDocument = null;
  await student.save({ validateBeforeSave: false });
  return true;
};

const deleteTeacherID = async (userId) => {
  const teacher = await Teacher.findOne({ user: userId });
  if (!teacher) throw new AppError("Teacher profile not found.", 404);

  if (!teacher.idDocument?.public_id) {
    throw new AppError("No ID document to delete.", 400);
  }

  const isPDF = teacher.idDocument.format === "pdf";
  await deleteFromCloudinary(
    teacher.idDocument.public_id,
    isPDF ? "raw" : "image",
  );

  teacher.idDocument = null;
  await teacher.save({ validateBeforeSave: false });
  return true;
};

// ─────────────────────────────────────────
// Get file metadata without loading the full document
// ─────────────────────────────────────────

const getUploadedFiles = async (userId, role) => {
  const user = await User.findById(userId).select("avatar");
  if (!user) throw new AppError("User not found.", 404);

  const result = {
    avatar: user.avatar?.url
      ? {
          url: user.avatar.url,
          public_id: user.avatar.public_id,
        }
      : null,
    idDocument: null,
  };

  if (role === "student") {
    const student = await Student.findOne({ user: userId }).select(
      "idDocument",
    );
    result.idDocument = student?.idDocument || null;
  } else if (role === "teacher") {
    const teacher = await Teacher.findOne({ user: userId }).select(
      "idDocument",
    );
    result.idDocument = teacher?.idDocument || null;
  }

  return result;
};

module.exports = {
  uploadStudentAvatar,
  uploadTeacherAvatar,
  deleteAvatar,
  uploadStudentID,
  uploadTeacherID,
  deleteStudentID,
  deleteTeacherID,
  getUploadedFiles,
};
