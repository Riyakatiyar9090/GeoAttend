/**
 * QR Expiry Job
 *
 * Runs every 30 seconds to auto-invalidate QR tokens whose
 * expiresAt timestamp has passed on ACTIVE sessions.
 *
 * This is a lightweight in-process scheduler using setInterval.
 * For production at scale, replace with a Redis-based job queue
 * (BullMQ / Agenda) so it survives process restarts and scales
 * across multiple server instances.
 */
const AttendanceSession = require("../models/AttendanceSession");

let jobInterval = null;

/**
 * Invalidate all expired QR tokens:
 * - Clears qrTokenHash (makes the old token unusable)
 * - Leaves session status unchanged — teacher can generate a new QR
 */
const expireQRTokens = async () => {
  try {
    const result = await AttendanceSession.updateMany(
      {
        status: "active",
        qrExpiresAt: { $lt: new Date() },
        qrTokenHash: { $ne: null },
      },
      {
        $set: {
          qrTokenHash: null,
          qrToken: null,
        },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(
        `🔄  QR Expiry Job — invalidated ${result.modifiedCount} expired QR token(s) at ${new Date().toISOString()}`,
      );
    }
  } catch (error) {
    console.error("❌  QR Expiry Job error:", error.message);
  }
};

/**
 * Start the expiry job.
 * Call once from server.js after DB is connected.
 * @param {number} intervalMs - How often to run (default 30s)
 */
const startQRExpiryJob = (intervalMs = 30_000) => {
  if (jobInterval) return; // Already running

  // Run once immediately, then on interval
  expireQRTokens();
  jobInterval = setInterval(expireQRTokens, intervalMs);

  console.log(
    `✅  QR Expiry Job started — running every ${intervalMs / 1000}s`,
  );
};

/**
 * Stop the job cleanly (e.g. during graceful shutdown).
 */
const stopQRExpiryJob = () => {
  if (jobInterval) {
    clearInterval(jobInterval);
    jobInterval = null;
    console.log("🛑  QR Expiry Job stopped.");
  }
};

module.exports = { startQRExpiryJob, stopQRExpiryJob };
