const sendEmail = require("../utils/sendEmail");
const {
  otpTemplate,
  welcomeTemplate,
  passwordResetTemplate,
} = require("../utils/emailTemplates");

/**
 * Send OTP for email verification.
 */
const sendVerificationOTP = async ({ name, email, otp }) => {
  await sendEmail({
    to: email,
    subject: "🔐 Verify Your GeoAttend Email — OTP Inside",
    html: otpTemplate({ name, otp, purpose: "verify your email address" }),
  });
};

/**
 * Send OTP for password reset.
 */
const sendPasswordResetOTP = async ({ name, email, otp }) => {
  await sendEmail({
    to: email,
    subject: "🔑 GeoAttend Password Reset OTP",
    html: passwordResetTemplate({ name, otp }),
  });
};

/**
 * Send welcome email after successful registration.
 */
const sendWelcomeEmail = async ({ name, email, role }) => {
  await sendEmail({
    to: email,
    subject: `🎉 Welcome to GeoAttend, ${name}!`,
    html: welcomeTemplate({ name, role }),
  });
};

module.exports = {
  sendVerificationOTP,
  sendPasswordResetOTP,
  sendWelcomeEmail,
};
