const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Check if SMTP configuration exists
  const hasSmtpConfig =
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ||
    (process.env.EMAIL_USER && process.env.EMAIL_PASS);

  if (!hasSmtpConfig) {
    console.warn(
      "\n⚠️ [EMAIL WARNING] SMTP credentials not configured in server/.env.\n" +
      "To send real emails to recipient inboxes, add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS to server/.env.\n"
    );
    return { sent: false, reason: "SMTP credentials missing in .env" };
  }

  try {
    let transporter;

    if (process.env.SMTP_SERVICE === "gmail" || process.env.EMAIL_SERVICE === "gmail") {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER || process.env.EMAIL_USER,
          pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER || process.env.EMAIL_USER,
          pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
        },
      });
    }

    const mailOptions = {
      from:
        process.env.FROM_EMAIL ||
        `"CareerForge-AI" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${options.email}. Message ID: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${options.email}:`, error.message);
    return { sent: false, error: error.message };
  }
};

module.exports = sendEmail;
