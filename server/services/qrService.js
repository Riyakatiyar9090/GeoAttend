const crypto = require("crypto");
const QRCode = require("qrcode");
const AttendanceSession = require("../models/AttendanceSession");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * Generate a QR code PNG data-URL for a session.
 * The QR encodes a signed token so the client can submit it for validation.
 *
 * QR payload structure:
 *   { sessionId, token, expiresAt, subject }
 *
 * @param {string} sessionId
 * @returns {{ dataURL: string, token: string, expiresAt: Date }}
 */
const generateSessionQR = async (sessionId) => {
  const session = await AttendanceSession.findById(sessionId);
  if (!session) throw new AppError("Session not found.", 404);
  if (session.status === "closed")
    throw new AppError("Cannot generate QR for a closed session.", 400);

  // Generate and persist new raw token + hash
  const rawToken = session.generateQRToken();
  await session.save({ validateBeforeSave: false });

  // Payload encoded inside the QR
  const payload = JSON.stringify({
    sessionId: session._id,
    token: rawToken,
    expiresAt: session.qrExpiresAt,
    subject: session.subject,
  });

  // Generate QR as a data-URL PNG (base64)
  const dataURL = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "H",
    type: "image/png",
    width: 400,
    margin: 2,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });

  return {
    dataURL,
    token: rawToken,
    expiresAt: session.qrExpiresAt,
    sessionCode: session.sessionCode,
  };
};

/**
 * Refresh the QR code — invalidates the previous token.
 */
const refreshSessionQR = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) throw new AppError("Session not found or access denied.", 404);
  if (session.status !== "active")
    throw new AppError("QR can only be refreshed for active sessions.", 400);

  return generateSessionQR(sessionId);
};

module.exports = { generateSessionQR, refreshSessionQR };
