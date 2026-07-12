const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { AppError } = require("./errorMiddleware");
const { validateFile, assertNonEmpty } = require("../utils/fileValidator");

// ─────────────────────────────────────────
// Cloudinary folders map
// ─────────────────────────────────────────
const FOLDERS = {
  avatar_student: "geoattend/avatars/students",
  avatar_teacher: "geoattend/avatars/teachers",
  avatar_admin: "geoattend/avatars/admins",
  student_id: "geoattend/documents/student-ids",
  teacher_id: "geoattend/documents/teacher-ids",
  documents: "geoattend/documents/general",
};

// ─────────────────────────────────────────
// Multer — memory storage
// File is NOT saved to disk; buffer is streamed to Cloudinary
// ─────────────────────────────────────────
const storage = multer.memoryStorage();

/**
 * Generic file filter — blocks obviously non-image uploads early.
 * Purpose-specific validation is done in uploadToCloudinary().
 */
const fileFilter = (req, file, cb) => {
  const blockedMimes = [
    "application/x-msdownload", // .exe
    "application/x-sh", // shell scripts
    "application/x-php", // php
    "text/javascript", // js
    "text/html", // html
    "application/javascript",
  ];

  if (blockedMimes.includes(file.mimetype)) {
    return cb(
      new AppError(`File type "${file.mimetype}" is not allowed.`, 400),
      false,
    );
  }

  cb(null, true);
};

/**
 * Configured multer instance.
 * Single field: field name is specified per-route.
 * Max file size: 15MB (enforced again per-purpose in the service).
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB global ceiling
    files: 1, // One file per request
  },
});

// ─────────────────────────────────────────
// Cloudinary helpers
// ─────────────────────────────────────────

/**
 * Upload a buffer to Cloudinary.
 *
 * @param {Buffer} buffer        - File buffer from Multer
 * @param {string} folder        - Cloudinary folder path
 * @param {object} [options]     - Optional Cloudinary upload options
 * @param {string} [options.publicId]      - Custom public_id (skips auto-naming)
 * @param {string} [options.resourceType]  - 'image' | 'raw' | 'auto'
 * @param {object} [options.transformation] - Cloudinary transformation object
 * @returns {Promise<CloudinaryUploadResult>}
 */
const uploadToCloudinary = (buffer, folder, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: options.resourceType || "auto",
      ...(options.publicId && { public_id: options.publicId }),
      ...(options.overwrite && { overwrite: options.overwrite }),
      ...(options.transformation && { transformation: options.transformation }),
      // Add metadata tags for easier management in Cloudinary dashboard
      tags: ["geoattend", ...(options.tags || [])],
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(
            new AppError(
              `File upload failed: ${error.message || "Unknown Cloudinary error"}`,
              500,
            ),
          );
        }
        resolve(result);
      },
    );

    stream.end(buffer);
  });

/**
 * Delete a file from Cloudinary by its public_id.
 * Silently succeeds if public_id is null/undefined.
 *
 * @param {string}  publicId
 * @param {string}  [resourceType='image']
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      console.warn(
        `⚠️  Cloudinary delete unexpected result for ${publicId}:`,
        result.result,
      );
    }
  } catch (error) {
    // Non-fatal — log and continue
    console.error(
      `⚠️  Cloudinary delete failed for ${publicId}:`,
      error.message,
    );
  }
};

/**
 * Replace a Cloudinary image:
 *   1. Upload new file.
 *   2. Delete old file (if public_id provided).
 *
 * @param {Buffer} buffer
 * @param {string} folder
 * @param {string} [oldPublicId]
 * @param {object} [options]
 */
const replaceOnCloudinary = async (
  buffer,
  folder,
  oldPublicId,
  options = {},
) => {
  const result = await uploadToCloudinary(buffer, folder, options);
  await deleteFromCloudinary(oldPublicId);
  return result;
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  replaceOnCloudinary,
  FOLDERS,
};
