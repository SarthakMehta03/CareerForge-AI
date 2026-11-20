const AuditLog = require("../models/AuditLog");

/**
 * Strips any sensitive properties from metadata before saving to audit log.
 * Prevents inadvertent exposure of passwords, secrets, tokens, or private content.
 */
function sanitizeMetadata(metadata = {}) {
  if (!metadata || typeof metadata !== "object") {
    return {};
  }

  const SENSITIVE_KEYS = [
    "password",
    "token",
    "resettoken",
    "jwt",
    "secret",
    "apikey",
    "authorization",
    "cookie",
    "resumetext",
    "answer",
  ];

  const sanitized = {};
  for (const [key, value] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEYS.some((s) => lowerKey.includes(s));
    if (!isSensitive) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeMetadata(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

/**
 * Creates an audit log record for an administrative action.
 *
 * @param {Object} params
 * @param {Object} params.admin - The authenticated admin user (req.user)
 * @param {string} params.action - The action identifier (e.g., 'USER_SUSPEND')
 * @param {string|null} [params.targetId] - ID of the target record or user
 * @param {string} params.targetType - Target type ('User' | 'SharedContent' | 'SystemSetting' | 'System')
 * @param {Object} [params.metadata] - Safe metadata describing the change
 * @param {string} [params.outcome='SUCCESS'] - 'SUCCESS' | 'FAILURE'
 * @param {Object} [params.req] - Express request object for extracting IP and user agent
 * @returns {Promise<Object>} The created AuditLog document
 */
async function logAdminAction({
  admin,
  action,
  targetId = null,
  targetType = "System",
  metadata = {},
  outcome = "SUCCESS",
  req = null,
}) {
  try {
    const ipAddress = req
      ? req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip || ""
      : "";
    const userAgent = req ? req.headers["user-agent"] || "" : "";

    const entry = new AuditLog({
      adminId: admin._id || admin.id,
      adminName: admin.name || "Administrator",
      adminEmail: admin.email || "admin@careerforge.ai",
      action: String(action).toUpperCase(),
      targetId: targetId ? String(targetId) : null,
      targetType,
      metadata: sanitizeMetadata(metadata),
      outcome,
      ipAddress: String(ipAddress).slice(0, 100),
      userAgent: String(userAgent).slice(0, 300),
    });

    return await entry.save();
  } catch (error) {
    console.error("[AuditService] Failed to create audit log:", error.message);
    throw error;
  }
}

module.exports = {
  logAdminAction,
  sanitizeMetadata,
};
