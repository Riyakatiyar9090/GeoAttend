const crypto = require("crypto");

/**
 * Generate a cryptographically secure N-digit numeric OTP.
 *
 * @param {number} [digits=6] - OTP length
 * @returns {{ otp: string, hashedOTP: string, expiresAt: Date }}
 */
const generateOTP = (digits = 6) => {
  // Generate random bytes, convert to a numeric string of the desired length
  const otp = crypto
    .randomInt(0, Math.pow(10, digits))
    .toString()
    .padStart(digits, "0");

  // Hash before storing in DB (never store raw OTPs)
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  // OTP valid for 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return { otp, hashedOTP, expiresAt };
};

module.exports = generateOTP;
