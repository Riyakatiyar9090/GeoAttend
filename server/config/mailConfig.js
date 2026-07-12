const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const { AppError } = require("../middleware/errorMiddleware");

// ─────────────────────────────────────────
// Build transporter (called once at startup)
// ─────────────────────────────────────────

/**
 * Create and verify a Nodemailer SMTP transporter.
 *
 * Supports:
 *   - Gmail SMTP (recommended for development)
 *   - Any SMTP provider (SendGrid, Mailgun, SES, Brevo)
 *     by changing the SMTP_* environment variables.
 *
 * @returns {nodemailer.Transporter}
 */
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_PORT === "465", // true only for port 465 (SSL)
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    // Connection pool settings — reuse connections for bulk sending
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    // Timeouts
    connectionTimeout: 10_000, // 10 seconds to establish connection
    greetingTimeout: 10_000, // 10 seconds for server greeting
    socketTimeout: 30_000, // 30 seconds for socket inactivity
    // Debug logging in development
    logger: process.env.NODE_ENV === "development",
    debug: process.env.NODE_ENV === "development",
    // TLS options
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });

  return transporter;
};

// ─────────────────────────────────────────
// Singleton transporter instance
// ─────────────────────────────────────────
let transporterInstance = null;

/**
 * Get (or lazily create) the singleton transporter.
 * Call this inside sendMail so the transporter is
 * only built after env vars are loaded.
 */
const getTransporter = () => {
  if (!transporterInstance) {
    transporterInstance = createTransporter();
  }
  return transporterInstance;
};

// ─────────────────────────────────────────
// Verify SMTP connection at startup
// ─────────────────────────────────────────

/**
 * Test the SMTP connection.
 * Called once from server.js after env vars are confirmed.
 * Non-fatal — a failed SMTP check should not crash the server.
 */
const verifyMailConnection = async () => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    logger.info("✅  SMTP connection verified", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_EMAIL,
    });
    return true;
  } catch (error) {
    logger.warn("⚠️  SMTP connection verification failed", {
      error: error.message,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      message: "Email sending may not work. Check SMTP credentials.",
    });
    return false;
  }
};

// ─────────────────────────────────────────
// Core send function
// ─────────────────────────────────────────

/**
 * Send an email using the shared transporter.
 *
 * @param {object} opts
 * @param {string}          opts.to       - Recipient email address
 * @param {string}          opts.subject  - Email subject line
 * @param {string}          opts.html     - HTML body
 * @param {string}          [opts.text]   - Plain-text fallback (auto-generated if omitted)
 * @param {string}          [opts.from]   - Sender address (defaults to FROM_EMAIL env)
 * @param {string|string[]} [opts.cc]     - CC addresses
 * @param {string|string[]} [opts.bcc]    - BCC addresses
 * @param {object[]}        [opts.attachments] - Nodemailer attachment objects
 * @param {string}          [opts.replyTo]     - Reply-to address
 *
 * @returns {Promise<{ messageId: string, accepted: string[] }>}
 * @throws  {AppError} if sending fails
 */
const sendMail = async (opts) => {
  const { to, subject, html, text, from, cc, bcc, attachments, replyTo } = opts;

  // ── Validate required fields ──
  if (!to) throw new AppError("Email recipient (to) is required.", 400);
  if (!subject) throw new AppError("Email subject is required.", 400);
  if (!html) throw new AppError("Email HTML body is required.", 400);

  // ── Build mail options ──
  const mailOptions = {
    from:
      from ||
      `"${process.env.FROM_NAME || "GeoAttend"}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
    // Strip HTML tags for plain-text fallback if not provided
    text:
      text ||
      html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    ...(cc && { cc }),
    ...(bcc && { bcc }),
    ...(replyTo && { replyTo }),
    ...(attachments && { attachments }),
    // Custom headers for deliverability
    headers: {
      "X-Mailer": "GeoAttend Mailer v1.0",
      "X-Application": "GeoAttend",
      "X-Priority": "3",
    },
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);

    logger.info("Email sent successfully", {
      messageId: info.messageId,
      to,
      subject,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    return {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (error) {
    logger.error("Email send failed", {
      to,
      subject,
      error: error.message,
      code: error.code,
      command: error.command,
    });

    throw new AppError(
      `Failed to send email to ${to}. Please try again later.`,
      500,
    );
  }
};

// ─────────────────────────────────────────
// Pre-built senders — one function per email type
// ─────────────────────────────────────────

/**
 * Send OTP verification email.
 */
const sendOTPEmail = async ({
  name,
  email,
  otp,
  purpose = "verify your email",
}) => {
  const subject =
    purpose === "password_reset"
      ? "🔑 GeoAttend Password Reset OTP"
      : "🔐 Verify Your GeoAttend Account — OTP Inside";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/><title>GeoAttend OTP</title></head>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr><td align="center">
          <table width="580" cellpadding="0" cellspacing="0"
                 style="background:#fff;border-radius:16px;overflow:hidden;
                        box-shadow:0 4px 24px rgba(15,23,42,0.08);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#2563EB,#4F46E5);
                         padding:32px 40px;text-align:center;">
                <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0;">
                  Geo<span style="color:#06B6D4;">Attend</span>
                </h1>
                <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;">
                  Smart Attendance System
                </p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:40px 40px 32px;">
                <h2 style="color:#0F172A;font-size:22px;font-weight:700;margin:0 0 8px;">
                  Hello, ${name} 👋
                </h2>
                <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 28px;">
                  Use the code below to ${purpose}.
                  This code expires in <strong>10 minutes</strong>.
                </p>
                <!-- OTP Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                  <tr><td align="center">
                    <div style="display:inline-block;background:#EFF6FF;
                                border:2px dashed #2563EB;border-radius:12px;
                                padding:20px 40px;">
                      <span style="font-size:40px;font-weight:800;letter-spacing:10px;
                                   color:#2563EB;font-family:'Courier New',monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td></tr>
                </table>
                <p style="color:#94A3B8;font-size:13px;line-height:1.5;margin:0;">
                  ⚠️ Never share this code with anyone.<br/>
                  GeoAttend staff will never ask for your OTP.<br/>
                  If you did not request this, please ignore this email.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#F8FAFC;padding:20px 40px;text-align:center;
                         border-top:1px solid #E2E8F0;">
                <p style="color:#94A3B8;font-size:12px;margin:0;">
                  © ${new Date().getFullYear()} GeoAttend. All rights reserved.<br/>
                  This is an automated message — please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  return sendMail({ to: email, subject, html });
};

/**
 * Send welcome email after successful registration.
 */
const sendWelcomeEmail = async ({ name, email, role }) => {
  const dashboardUrl =
    role === "teacher"
      ? `${process.env.CLIENT_URL}/teacher`
      : `${process.env.CLIENT_URL}/student`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/><title>Welcome to GeoAttend</title></head>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr><td align="center">
          <table width="580" cellpadding="0" cellspacing="0"
                 style="background:#fff;border-radius:16px;overflow:hidden;
                        box-shadow:0 4px 24px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#2563EB,#4F46E5);
                         padding:32px 40px;text-align:center;">
                <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0;">
                  Geo<span style="color:#06B6D4;">Attend</span>
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 32px;text-align:center;">
                <div style="font-size:48px;margin-bottom:16px;">🎉</div>
                <h2 style="color:#0F172A;font-size:22px;font-weight:700;margin:0 0 12px;">
                  Welcome to GeoAttend, ${name}!
                </h2>
                <p style="color:#64748B;font-size:15px;line-height:1.6;
                           margin:0 0 28px;max-width:400px;display:inline-block;">
                  Your account has been verified and activated as a
                  <strong style="color:#2563EB;">${role.charAt(0).toUpperCase() + role.slice(1)}</strong>.
                  You can now log in and start using GeoAttend.
                </p>
                <br/>
                <a href="${dashboardUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#2563EB,#4F46E5);
                          color:#fff;font-weight:600;font-size:15px;padding:14px 32px;
                          border-radius:10px;text-decoration:none;">
                  Go to Dashboard →
                </a>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:20px 40px;text-align:center;
                         border-top:1px solid #E2E8F0;">
                <p style="color:#94A3B8;font-size:12px;margin:0;">
                  © ${new Date().getFullYear()} GeoAttend. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  return sendMail({
    to: email,
    subject: `🎉 Welcome to GeoAttend, ${name}!`,
    html,
  });
};

/**
 * Send password-reset OTP email.
 */
const sendPasswordResetEmail = async ({ name, email, otp }) =>
  sendOTPEmail({ name, email, otp, purpose: "reset your password" });

/**
 * Send password-changed confirmation email.
 */
const sendPasswordChangedEmail = async ({ name, email }) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/><title>Password Changed</title></head>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr><td align="center">
          <table width="580" cellpadding="0" cellspacing="0"
                 style="background:#fff;border-radius:16px;overflow:hidden;
                        box-shadow:0 4px 24px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#EF4444,#F59E0B);
                         padding:32px 40px;text-align:center;">
                <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0;">
                  GeoAttend — Security Alert
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 32px;">
                <h2 style="color:#0F172A;font-size:22px;font-weight:700;margin:0 0 12px;">
                  🔒 Password Changed, ${name}
                </h2>
                <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 20px;">
                  Your GeoAttend password was successfully changed on
                  <strong>${new Date().toLocaleString("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}</strong>.
                </p>
                <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 28px;">
                  If you did not make this change, please contact support immediately
                  and reset your password.
                </p>
                <a href="${process.env.CLIENT_URL}/forgot-password"
                   style="display:inline-block;background:#EF4444;color:#fff;
                          font-weight:600;font-size:14px;padding:12px 24px;
                          border-radius:10px;text-decoration:none;">
                  Reset Password Now
                </a>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:20px 40px;text-align:center;
                         border-top:1px solid #E2E8F0;">
                <p style="color:#94A3B8;font-size:12px;margin:0;">
                  © ${new Date().getFullYear()} GeoAttend. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  return sendMail({
    to: email,
    subject: "🔒 GeoAttend — Your Password Was Changed",
    html,
  });
};

/**
 * Send low attendance warning email to a student.
 */
const sendLowAttendanceEmail = async ({
  name,
  email,
  subject: courseName,
  percentage,
  classesNeeded,
}) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/><title>Low Attendance Warning</title></head>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr><td align="center">
          <table width="580" cellpadding="0" cellspacing="0"
                 style="background:#fff;border-radius:16px;overflow:hidden;
                        box-shadow:0 4px 24px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#F59E0B,#EF4444);
                         padding:32px 40px;text-align:center;">
                <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0;">
                  ⚠️ Attendance Warning
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 32px;">
                <h2 style="color:#0F172A;font-size:22px;font-weight:700;margin:0 0 8px;">
                  Hi ${name},
                </h2>
                <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 20px;">
                  Your attendance in <strong style="color:#0F172A;">${courseName}</strong>
                  has dropped to
                  <strong style="color:#EF4444;font-size:20px;"> ${percentage}%</strong>.
                </p>
                <div style="background:#FEF2F2;border-left:4px solid #EF4444;
                            padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:20px;">
                  <p style="color:#991B1B;font-size:14px;font-weight:600;margin:0;">
                    You need to attend
                    <strong>${classesNeeded}</strong> more class(es)
                    to reach the required 75% threshold.
                  </p>
                </div>
                <p style="color:#64748B;font-size:14px;line-height:1.6;margin:0 0 28px;">
                  Please ensure you attend upcoming classes to avoid academic consequences.
                  Log in to GeoAttend to view your detailed attendance report.
                </p>
                <a href="${process.env.CLIENT_URL}/student/analytics"
                   style="display:inline-block;background:linear-gradient(135deg,#2563EB,#4F46E5);
                          color:#fff;font-weight:600;font-size:14px;padding:12px 24px;
                          border-radius:10px;text-decoration:none;">
                  View Attendance Report
                </a>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:20px 40px;text-align:center;
                         border-top:1px solid #E2E8F0;">
                <p style="color:#94A3B8;font-size:12px;margin:0;">
                  © ${new Date().getFullYear()} GeoAttend. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  return sendMail({
    to: email,
    subject: `⚠️ Low Attendance Alert — ${courseName} (${percentage}%)`,
    html,
  });
};

// ─────────────────────────────────────────
// Exports
// ─────────────────────────────────────────
module.exports = {
  // Core
  sendMail,
  verifyMailConnection,
  getTransporter,
  // Pre-built senders
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendLowAttendanceEmail,
};
