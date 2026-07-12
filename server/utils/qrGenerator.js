const crypto = require("crypto");
const QRCode = require("qrcode");

/**
 * Generate a cryptographically secure random token string.
 * @param {number} bytes - Byte length (default 32 → 64-char hex)
 */
const generateSecureToken = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

/**
 * SHA-256 hash a raw token.
 * Raw token is sent to the client — hash is stored in DB.
 * @param {string} rawToken
 */
const hashToken = (rawToken) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

/**
 * Build the JSON payload that gets encoded inside the QR image.
 * Keeping it minimal reduces QR complexity and improves scan speed.
 *
 * @param {object} opts
 * @param {string} opts.sessionId
 * @param {string} opts.rawToken   - Short-lived raw token
 * @param {Date}   opts.expiresAt
 * @param {string} opts.sessionCode
 * @param {string} opts.subject
 */
const buildQRPayload = ({
  sessionId,
  rawToken,
  expiresAt,
  sessionCode,
  subject,
}) =>
  JSON.stringify({
    sid: sessionId,
    tok: rawToken,
    exp: expiresAt.getTime(), // Unix ms — easy to check on client
    code: sessionCode,
    sub: subject,
    v: 1, // Payload version — bump when format changes
  });

/**
 * Render a QR code as a base-64 PNG data-URL.
 *
 * Error correction level H (30%) makes the QR scannable even
 * if part of the image is obscured (e.g. projector glare).
 *
 * @param {string} payload  - String to encode
 * @param {number} size     - Pixel width/height (default 400)
 */
const renderQRDataURL = async (payload, size = 400) =>
  QRCode.toDataURL(payload, {
    errorCorrectionLevel: "H",
    type: "image/png",
    width: size,
    margin: 2,
    color: {
      dark: "#0F172A", // Near-black foreground — high contrast
      light: "#FFFFFF",
    },
  });

/**
 * Render QR as a raw PNG Buffer (for sending as binary response
 * or uploading to Cloudinary).
 */
const renderQRBuffer = async (payload, size = 400) =>
  QRCode.toBuffer(payload, {
    errorCorrectionLevel: "H",
    type: "png",
    width: size,
    margin: 2,
  });

/**
 * Parse the QR payload JSON safely.
 * Returns null instead of throwing on malformed input.
 * @param {string} raw - Raw string scanned from QR
 */
const parseQRPayload = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    // Basic shape check
    if (!parsed.sid || !parsed.tok || !parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
};

module.exports = {
  generateSecureToken,
  hashToken,
  buildQRPayload,
  renderQRDataURL,
  renderQRBuffer,
  parseQRPayload,
};
