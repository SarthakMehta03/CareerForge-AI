/**
 * User Storage Scoping & Isolation Utility
 *
 * Provides stable identity resolution and key scoping for browser storage (localStorage).
 * Guarantees that:
 * 1. Each signed-in user's test and interview history is scoped to their stable unique ID.
 * 2. Unauthenticated guest attempts are isolated in 'guest' scope and never leak into signed-in accounts.
 * 3. Switching accounts in the same browser isolates each user's history.
 * 4. Legacy unscoped records are safely migrated to 'guest' without assigning anonymous records to a signed-in user.
 */

import { getCurrentUser } from "../services/authService";

/**
 * Resolves the active user scope
 * Returns { isGuest: boolean, userId: string|null, accountId: string|null, scopeKey: string, user: object|null }
 */
export const getActiveUserScope = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return {
      isGuest: true,
      userId: null,
      accountId: null,
      scopeKey: "guest",
      user: null,
    };
  }

  const user = getCurrentUser();

  if (!user) {
    return {
      isGuest: true,
      userId: null,
      accountId: null,
      scopeKey: "guest",
      user: null,
    };
  }

  // Use immutable user ID (id or _id), fallback to accountId if neither exists
  const rawId = user.id || user._id || user.accountId;
  const stableId = rawId ? String(rawId).trim() : "unknown_user";

  return {
    isGuest: false,
    userId: stableId,
    accountId: user.accountId ? String(user.accountId).trim() : null,
    userEmail: user.email ? String(user.email).trim().toLowerCase() : null,
    scopeKey: `user_${stableId}`,
    user,
  };
};

/**
 * Returns a user-scoped storage key for a given base key
 * Example: 'careerforge_aptitude_history' -> 'careerforge_aptitude_history_user_6ad07cc3...'
 */
export const getScopedKey = (baseKey) => {
  const { scopeKey } = getActiveUserScope();
  return `${baseKey}_${scopeKey}`;
};

/**
 * Safe JSON retrieval from localStorage
 */
export const safeGet = (key, fallback = null) => {
  if (typeof window === "undefined" || !window.localStorage) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`[UserStorageScope] Error reading key "${key}":`, err);
    return fallback;
  }
};

/**
 * Safe JSON write to localStorage
 */
export const safeSet = (key, value) => {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[UserStorageScope] Error writing key "${key}":`, err);
    return false;
  }
};

/**
 * Safe removal from localStorage
 */
export const safeRemove = (key) => {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[UserStorageScope] Error removing key "${key}":`, err);
    return false;
  }
};

/**
 * Migrates legacy unscoped records safely.
 *
 * Rules:
 * - Records with an explicit, verifiable `userId` are routed to that user's scoped storage.
 * - Anonymous records (no `userId`) are preserved in 'guest' scope so no data is deleted.
 * - Anonymous records are NEVER assigned to a signed-in user because ownership cannot be verified.
 * - Legacy unscoped keys are cleared so they do not leak between users.
 */
export const migrateLegacyAssessments = () => {
  if (typeof window === "undefined" || !window.localStorage) return;

  const LEGACY_KEYS = [
    { base: "careerforge_aptitude_history", isArray: true },
    { base: "careerforge_interview_history", isArray: true },
    { base: "careerforge_aptitude_practice_progress", isArray: false },
    { base: "careerforge_aptitude_latest_result", isArray: false },
    { base: "careerforge_interview_latest_result", isArray: false },
    { base: "careerforge_aptitude_current_test", isArray: false, transient: true },
    { base: "careerforge_interview_active_session", isArray: false, transient: true },
  ];

  LEGACY_KEYS.forEach(({ base, isArray, transient }) => {
    try {
      const raw = localStorage.getItem(base);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!parsed) {
        localStorage.removeItem(base);
        return;
      }

      // Transient active test sessions from legacy unscoped storage are discarded
      // to avoid contaminating a newly signed-in account with unfinished test state
      if (transient) {
        localStorage.removeItem(base);
        return;
      }

      if (isArray && Array.isArray(parsed)) {
        // Group items by owner
        const userGroups = {};
        const guestItems = [];

        parsed.forEach((item) => {
          if (item && item.userId) {
            const uid = String(item.userId).trim();
            if (!userGroups[uid]) userGroups[uid] = [];
            userGroups[uid].push(item);
          } else {
            // Anonymous legacy item -> preserve in guest scope
            guestItems.push(item);
          }
        });

        // Save into respective user scoped keys
        Object.entries(userGroups).forEach(([uid, items]) => {
          const userKey = `${base}_user_${uid}`;
          const existing = safeGet(userKey, []);
          const merged = [...items, ...(Array.isArray(existing) ? existing : [])];
          // Deduplicate by ID
          const seen = new Set();
          const deduped = merged.filter((item) => {
            if (!item?.id) return true;
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
          safeSet(userKey, deduped);
        });

        // Save anonymous legacy items into guest scoped key
        if (guestItems.length > 0) {
          const guestKey = `${base}_guest`;
          const existingGuest = safeGet(guestKey, []);
          const mergedGuest = [...guestItems, ...(Array.isArray(existingGuest) ? existingGuest : [])];
          const seen = new Set();
          const dedupedGuest = mergedGuest.filter((item) => {
            if (!item?.id) return true;
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
          safeSet(guestKey, dedupedGuest);
        }
      } else if (!isArray && typeof parsed === "object") {
        // Single object (e.g. latest result or practice progress)
        if (parsed.userId) {
          const userKey = `${base}_user_${parsed.userId}`;
          if (!localStorage.getItem(userKey)) {
            safeSet(userKey, parsed);
          }
        } else {
          // Anonymous -> preserve in guest scope
          const guestKey = `${base}_guest`;
          if (!localStorage.getItem(guestKey)) {
            safeSet(guestKey, parsed);
          }
        }
      }

      // Safely remove the legacy unscoped key now that data is migrated
      localStorage.removeItem(base);
    } catch (e) {
      console.warn(`[UserStorageScope] Migration warning for key ${base}:`, e);
    }
  });
};

/**
 * Cleans up transient in-progress sessions on logout
 */
export const clearUserTransientSessions = () => {
  if (typeof window === "undefined" || !window.localStorage) return;
  const { scopeKey } = getActiveUserScope();
  safeRemove(`careerforge_aptitude_current_test_${scopeKey}`);
  safeRemove(`careerforge_interview_active_session_${scopeKey}`);
};

