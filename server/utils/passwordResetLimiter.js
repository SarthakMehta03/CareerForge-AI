/**
 * In-memory sliding-window rate limiter & cooldown tracker for password resets.
 *
 * Enforces:
 * 1. Cooldown interval (default 60 seconds) between successful reset email dispatches
 *    per recipient email or client IP address.
 * 2. Window-based request limit (default 5 dispatches per 15-minute window)
 *    to prevent flooding mail providers or brute-forcing accounts.
 * 3. Non-blocking failures: If an email dispatch fails on provider/network level,
 *    no cooldown is enforced, enabling immediate user retry once credentials or network are fixed.
 */

class PasswordResetLimiter {
  constructor(options = {}) {
    this.cooldownSeconds = options.cooldownSeconds ?? 60;
    this.maxAttemptsPerWindow = options.maxAttemptsPerWindow ?? 5;
    this.windowMs = (options.windowMinutes ?? 15) * 60 * 1000;

    // Map: key (email or ip) -> { lastSuccessAt: number, history: number[] }
    this.records = new Map();
  }

  /**
   * Checks whether a request with the given identifier is allowed.
   *
   * @param {string} key - Normalized email or IP address
   * @returns {{ allowed: boolean, retryAfter?: number, reason?: string }}
   */
  checkLimit(key) {
    if (!key) return { allowed: true };

    const now = Date.now();
    const record = this.records.get(key);

    if (!record) {
      return { allowed: true };
    }

    // 1. Check Cooldown (minimum interval between successful dispatches)
    if (record.lastSuccessAt) {
      const elapsedSeconds = Math.floor((now - record.lastSuccessAt) / 1000);
      if (elapsedSeconds < this.cooldownSeconds) {
        const retryAfter = this.cooldownSeconds - elapsedSeconds;
        return {
          allowed: false,
          retryAfter,
          reason: `Please wait ${retryAfter}s before requesting another reset email.`,
        };
      }
    }

    // 2. Check Sliding Window Limit
    const recentAttempts = (record.history || []).filter(
      (ts) => now - ts < this.windowMs
    );
    record.history = recentAttempts;

    if (recentAttempts.length >= this.maxAttemptsPerWindow) {
      const oldestAttempt = recentAttempts[0];
      const retryAfter = Math.ceil((oldestAttempt + this.windowMs - now) / 1000);
      return {
        allowed: false,
        retryAfter: Math.max(retryAfter, 1),
        reason: `Too many password reset requests. Please wait ${Math.ceil(retryAfter / 60)} minutes before trying again.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Records a successful reset dispatch (or anti-enumeration generic response)
   *
   * @param {string} key - Normalized email or IP address
   */
  recordSuccess(key) {
    if (!key) return;

    const now = Date.now();
    const record = this.records.get(key) || { history: [] };

    record.lastSuccessAt = now;
    record.history = (record.history || []).filter(
      (ts) => now - ts < this.windowMs
    );
    record.history.push(now);

    this.records.set(key, record);
  }

  /**
   * Clears all tracking records (useful for test suites)
   */
  clear() {
    this.records.clear();
  }
}

const defaultLimiter = new PasswordResetLimiter({
  cooldownSeconds: parseInt(process.env.RESET_COOLDOWN_SECONDS, 10) || 60,
  maxAttemptsPerWindow: parseInt(process.env.RESET_MAX_ATTEMPTS, 10) || 5,
  windowMinutes: parseInt(process.env.RESET_WINDOW_MINUTES, 10) || 15,
});

module.exports = defaultLimiter;
module.exports.PasswordResetLimiter = PasswordResetLimiter;
