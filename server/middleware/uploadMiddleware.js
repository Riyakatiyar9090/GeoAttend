const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { AppError } = require("./errorMiddleware");

// ─────────────────────────────────────────
// Multer — use memory storage so we can
// stream the buffer directly to Cloudinary
// ─────────────────────────────────────────
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowed.test(ext) && allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(
      new AppError("Only image files (JPEG, PNG, WebP, GIF) are allowed.", 400),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ─────────────────────────────────────────
// Upload a buffer to Cloudinary
// ─────────────────────────────────────────
const uploadToCloudinary = (buffer, folder, publicId = null) =>
  new Promise((resolve, reject) => {
    const options = { folder, resource_type: "image" };
    if (publicId) options.public_id = publicId;

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error)
          return reject(new AppError("Cloudinary upload failed.", 500));
        resolve(result);
      },
    );

    stream.end(buffer);
  });

/**
 * Delete an image from Cloudinary by its public_id.
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
