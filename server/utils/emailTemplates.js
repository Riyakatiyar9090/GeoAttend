/**
 * Centralised HTML email templates for GeoAttend.
 * Returns complete HTML strings ready to pass to sendEmail().
 */

const baseWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>GeoAttend</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563EB,#4F46E5);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;letter-spacing:-0.5px;">
                Geo<span style="color:#06B6D4;">Attend</span>
              </h1>
              <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;">Smart Attendance System</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:20px 40px;text-align:center;border-top:1px solid #E2E8F0;">
              <p style="color:#94A3B8;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} GeoAttend. All rights reserved.<br/>
                This is an automated message — please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

/**
 * OTP verification email template.
 */
const otpTemplate = ({ name, otp, purpose = "verify your email" }) =>
  baseWrapper(`
    <h2 style="color:#0F172A;font-size:22px;font-weight:700;margin:0 0 8px;">Hello, ${name} 👋</h2>
    <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 28px;">
      Use the verification code below to ${purpose}. This code expires in <strong>10 minutes</strong>.
    </p>

    <!-- OTP box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td align="center">
          <div style="display:inline-block;background:#EFF6FF;border:2px dashed #2563EB;border-radius:12px;padding:20px 40px;">
            <span style="font-size:40px;font-weight:800;letter-spacing:8px;color:#2563EB;font-family:'Courier New',monospace;">
              ${otp}
            </span>
          </div>
        </td>
      </tr>
    </table>

    <p style="color:#94A3B8;font-size:13px;line-height:1.5;margin:0;">
      ⚠️ Never share this code with anyone. GeoAttend staff will never ask for your OTP.<br/>
      If you didn't request this, please ignore this email or contact support.
    </p>
  `);

/**
 * Welcome email template (post-registration).
 */
const welcomeTemplate = ({ name, role }) =>
  baseWrapper(`
    <h2 style="color:#0F172A;font-size:22px;font-weight:700;margin:0 0 8px;">Welcome to GeoAttend! 🎉</h2>
    <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 20px;">
      Hi <strong>${name}</strong>, your account has been created successfully as a <strong>${role}</strong>.
      You can now log in and start using GeoAttend.
    </p>
    <a href="${process.env.CLIENT_URL}/login?role=${role.toLowerCase()}"
       style="display:inline-block;background:linear-gradient(135deg,#2563EB,#4F46E5);color:#fff;font-weight:600;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
      Go to Login →
    </a>
  `);

/**
 * Password reset email template.
 */
const passwordResetTemplate = ({ name, otp }) =>
  otpTemplate({ name, otp, purpose: "reset your password" });

module.exports = { otpTemplate, welcomeTemplate, passwordResetTemplate };
