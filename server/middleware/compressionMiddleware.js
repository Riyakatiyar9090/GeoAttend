const compression = require("compression");

/**
 * Compression middleware.
 *
 * Compresses responses using gzip/brotli.
 * Applied to all responses above the threshold.
 *
 * Skip compression for:
 *   - Already-compressed file types (images, PDFs, video)
 *   - Small responses below 1 KB
 *   - Server-Sent Events (SSE) streams
 */
const shouldCompress = (req, res) => {
  // Skip SSE
  if (req.headers.accept === "text/event-stream") return false;

  const contentType = res.getHeader("Content-Type") || "";

  // These are already compressed — compressing again wastes CPU
  const noCompressTypes = [
    "image/",
    "video/",
    "audio/",
    "application/pdf",
    "application/zip",
    "application/gzip",
    "application/x-tar",
  ];

  if (noCompressTypes.some((type) => contentType.includes(type))) return false;

  // Use compression's default filter for everything else
  return compression.filter(req, res);
};

const buildCompressionMiddleware = () =>
  compression({
    filter: shouldCompress,
    level: 6, // Compression level 1–9 (6 = good balance)
    threshold: 1024, // Only compress responses > 1 KB
    memLevel: 8, // Memory usage level (1–9)
    strategy: 0, // Default strategy (0 = Z_DEFAULT_STRATEGY)
    chunkSize: 16384, // 16 KB chunks
  });

module.exports = buildCompressionMiddleware;
