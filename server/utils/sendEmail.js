const nodemailer = require("nodemailer");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * Reusable email sender using Nodemailer + Gmail SMTP.
 *
 * @param {object} options
 * @param {string} options.to      - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html    - HTML email body
 * @param {string} [options.text]  - Plain-text fallback
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""), // strip HTML tags for plain-text fallback
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧  Email sent to ${to} — MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌  Email failed to ${to}: ${error.message}`);
    throw new AppError("Email could not be sent. Please try again later.", 500);
  }
};

module.exports = sendEmail;
