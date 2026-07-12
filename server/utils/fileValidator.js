const path = require("path");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * Allowed MIME types and their extensions.
 * Keyed by upload purpose so each field can have
 * its own whitelist independently.
 */
const ALLOWED_TYPES = {
  avatar: {
    mimes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
    maxSizeMB: 5,
    label: "Profile photo",
  },
  student_id: {
    mimes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ],
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".pdf"],
    maxSizeMB: 10,
    label: "Student ID document",
  },
  teacher_id: {
    mimes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ],
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".pdf"],
    maxSizeMB: 10,
    label: "Teacher ID document",
  },
  document: {
    mimes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".doc", ".docx"],
    maxSizeMB: 15,
    label: "Document",
  },
};

/**
 * Validate a multer file object against a purpose-specific ruleset.
 *
 * @param {object} file    - Multer file (has mimetype, originalname, size)
 * @param {string} purpose - Key from ALLOWED_TYPES
 * @throws {AppError}       on any validation failure
 */
const validateFile = (file, purpose = "avatar") => {
  const rules = ALLOWED_TYPES[purpose];

  if (!rules) {
    throw new AppError(`Unknown upload purpose: "${purpose}".`, 400);
  }

  if (!file) {
    throw new AppError(`${rules.label} file is required.`, 400);
  }

  // ── MIME type check ──
  if (!rules.mimes.includes(file.mimetype)) {
    throw new AppError(
      `${rules.label} must be one of: ${rules.extensions.join(", ")}. ` +
        `Received: ${file.mimetype}.`,
      400,
    );
  }

  // ── Extension check (double-verification against file name spoofing) ──
  const ext = path.extname(file.originalname).toLowerCase();
  if (!rules.extensions.includes(ext)) {
    throw new AppError(
      `${rules.label} has an invalid file extension (${ext}). ` +
        `Allowed: ${rules.extensions.join(", ")}.`,
      400,
    );
  }

  // ── Size check ──
  const maxBytes = rules.maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new AppError(
      `${rules.label} must not exceed ${rules.maxSizeMB}MB. ` +
        `Received: ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
      413,
    );
  }

  return true;
};

/**
 * Build a sanitised filename for Cloudinary public_id.
 * Removes special characters, lowercases, replaces spaces with hyphens.
 */
const sanitiseFilename = (originalName) => {
  const name = path.basename(originalName, path.extname(originalName));
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60); // Cloudinary public_id max
};

/**
 * Check file is not empty (zero-byte uploads).
 */
const assertNonEmpty = (file) => {
  if (!file || file.size === 0) {
    throw new AppError(
      "Uploaded file is empty. Please upload a valid file.",
      400,
    );
  }
};

/**
 * Validate image dimensions by inspecting the buffer.
 * Lightweight check without heavy libraries.
 * Only works for JPEG and PNG.
 *
 * @param {Buffer} buffer
 * @param {object} limits - { minWidth, minHeight, maxWidth, maxHeight }
 */
const validateImageDimensions = (buffer, limits = {}) => {
  const {
    minWidth = 100,
    minHeight = 100,
    maxWidth = 5000,
    maxHeight = 5000,
  } = limits;

  let width, height;

  // PNG: width at offset 16, height at offset 20
  if (buffer[0] === 0x89 && buffer[1] === 0x50) {
    width = buffer.readUInt32BE(16);
    height = buffer.readUInt32BE(20);
  }
  // JPEG: scan for SOF0 marker (0xFFC0)
  else if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    for (let i = 2; i < buffer.length - 8; i++) {
      if (buffer[i] === 0xff && buffer[i + 1] === 0xc0) {
        height = buffer.readUInt16BE(i + 5);
        width = buffer.readUInt16BE(i + 7);
        break;
      }
    }
  }

  // If we could not parse dimensions — skip dimension check
  if (!width || !height) return true;

  if (width < minWidth || height < minHeight) {
    throw new AppError(
      `Image too small. Minimum size is ${minWidth}×${minHeight}px. ` +
        `Received: ${width}×${height}px.`,
      400,
    );
  }

  if (width > maxWidth || height > maxHeight) {
    throw new AppError(
      `Image too large. Maximum size is ${maxWidth}×${maxHeight}px. ` +
        `Received: ${width}×${height}px.`,
      400,
    );
  }

  return true;
};

module.exports = {
  ALLOWED_TYPES,
  validateFile,
  sanitiseFilename,
  assertNonEmpty,
  validateImageDimensions,
};
