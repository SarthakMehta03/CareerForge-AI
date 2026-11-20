const nodemailer = require("nodemailer");

/**
 * Extracts and validates SMTP configuration from environment variables.
 *
 * Supported configurations:
 * 1. Gmail service:
 *    SMTP_SERVICE=gmail (or EMAIL_SERVICE=gmail)
 *    SMTP_USER=your_email@gmail.com
 *    SMTP_PASS=your_16_digit_google_app_password
 *
 * 2. Custom SMTP Host (Mailtrap, SendGrid, Amazon SES, Brevo):
 *    SMTP_HOST=smtp.mailtrap.io
 *    SMTP_PORT=587
 *    SMTP_USER=your_smtp_user
 *    SMTP_PASS=your_smtp_pass
 *    SMTP_SECURE=false (or true for port 465)
 *
 * 3. Direct Gmail detection:
 *    If SMTP_USER or EMAIL_USER ends in @gmail.com and SMTP_HOST is omitted,
 *    defaults automatically to Gmail service.
 */
const getSmtpConfig = () => {
  const service = (process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE || "").toLowerCase().trim();
  let user = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
  let pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || "").trim();
  const host = (process.env.SMTP_HOST || "").trim();
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const isGmail =
    service === "gmail" ||
    host.includes("gmail.com") ||
    (!host && user.toLowerCase().endsWith("@gmail.com"));

  // Strip whitespace if user pasted Google App Password formatted with spaces ('xxxx xxxx xxxx xxxx')
  if (isGmail && pass && typeof pass === "string") {
    pass = pass.replace(/\s+/g, "");
  }

  const hasConfig = Boolean(user && pass && (service || host || isGmail));

  return {
    hasConfig,
    isGmail,
    service: isGmail ? "gmail" : service,
    user,
    pass,
    host: host || (isGmail ? "smtp.gmail.com" : ""),
    port,
    secure,
  };
};

/**
 * Dispatches an email using nodemailer.
 *
 * @param {Object} options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.text - Plain text content (crucial for anti-spam scoring)
 * @param {string} options.html - Rich HTML content
 */
const sendEmail = async (options) => {
  // Automated test suite exception: return mock success unless testing SMTP specifically
  if (process.env.NODE_ENV === "test" && !process.env.FORCE_SMTP_TEST) {
    return { sent: true, messageId: "test-runner-mock-id" };
  }

  const config = getSmtpConfig();

  // Handle missing SMTP credentials
  if (!config.hasConfig) {
    console.warn(
      `\n⚠️ [EMAIL WARNING] Cannot send verification email to "${options.email}".\n` +
      `SMTP credentials are missing or incomplete in server/.env.\n` +
      `Required for Gmail: SMTP_USER and SMTP_PASS (Google 16-character App Password).\n`
    );

    return {
      sent: false,
      reason: "SMTP credentials not configured in server/.env",
      missingConfig: true,
    };
  }

  try {
    let transporter;

    if (config.isGmail) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });
    }

    // Always use authenticated user email as sender for Gmail to prevent SPF/DMARC spam drops
    const fromAddress =
      process.env.FROM_EMAIL ||
      (config.user
        ? `"CareerForge-AI" <${config.user}>`
        : '"CareerForge-AI" <no-reply@careerforge.ai>');

    const mailOptions = {
      from: fromAddress,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `✅ [EMAIL SUCCESS] Verification email sent to ${options.email} (MessageId: ${info.messageId})`
    );

    return {
      sent: true,
      messageId: info.messageId,
    };
  } catch (error) {
    // Log failure without exposing passwords or sensitive secrets
    console.error(
      `❌ [EMAIL DELIVERY ERROR] Provider rejected email to ${options.email}: [${error.code || "UNKNOWN"}] ${error.message}`
    );

    return {
      sent: false,
      error: error.message,
      code: error.code,
    };
  }
};

module.exports = sendEmail;
module.exports.getSmtpConfig = getSmtpConfig;
