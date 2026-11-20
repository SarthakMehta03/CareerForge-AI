/**
 * Aptitude Browser Storage Helper
 * Provides user-scoped, isolated storage for aptitude assessments.
 *
 * Guarantees:
 * 1. Each signed-in user's test history and practice progress is strictly isolated by stable user ID.
 * 2. Guest test attempts never appear in signed-in user accounts.
 * 3. Switching accounts in the same browser completely separates test history.
 * 4. Ownership verification prevents cross-account result review.
 */

import { STORAGE_KEYS } from "../constants/aptitudeConstants";
import {
  getActiveUserScope,
  getScopedKey,
  safeGet,
  safeSet,
  safeRemove,
  migrateLegacyAssessments,
} from "./userStorageScope";

// Run safe legacy migration on load
migrateLegacyAssessments();

/* --- Active Test Session --- */
export const getActiveTestSession = () => {
  const key = getScopedKey(STORAGE_KEYS.CURRENT_TEST_SESSION);
  const session = safeGet(key, null);
  if (!session) return null;

  const { isGuest, userId } = getActiveUserScope();
  // Ensure session belongs to the current scope
  if (!isGuest && session.userId && session.userId !== userId) {
    return null;
  }
  if (isGuest && session.userId) {
    return null;
  }
  return session;
};

export const saveActiveTestSession = (session) => {
  if (!session) return false;
  const { isGuest, userId, accountId, userEmail } = getActiveUserScope();
  const stampedSession = {
    ...session,
    userId: isGuest ? null : userId,
    userAccountId: isGuest ? null : accountId,
    userEmail: isGuest ? null : userEmail,
  };
  const key = getScopedKey(STORAGE_KEYS.CURRENT_TEST_SESSION);
  return safeSet(key, stampedSession);
};

export const clearActiveTestSession = () => {
  const key = getScopedKey(STORAGE_KEYS.CURRENT_TEST_SESSION);
  return safeRemove(key);
};

/* --- History & Results --- */
export const getAptitudeHistory = () => {
  const { isGuest, userId, accountId } = getActiveUserScope();
  const key = getScopedKey(STORAGE_KEYS.TEST_HISTORY);
  const rawHistory = safeGet(key, []);

  if (!Array.isArray(rawHistory)) return [];

  // Defense-in-depth: enforce strict ownership matching on each record
  return rawHistory.filter((item) => {
    if (!item) return false;
    if (isGuest) {
      // Guest scope: only show records without a registered user ID
      return !item.userId || item.userId === "guest";
    }
    // Authenticated scope: must match user's ID or accountId
    return item.userId === userId || (accountId && item.userAccountId === accountId);
  });
};

export const saveAptitudeResult = (result) => {
  if (!result) return result;
  const { isGuest, userId, accountId, userEmail } = getActiveUserScope();

  const stampedResult = {
    ...result,
    userId: isGuest ? null : userId,
    userAccountId: isGuest ? null : accountId,
    userEmail: isGuest ? null : userEmail,
    savedAt: new Date().toISOString(),
  };

  const keyHistory = getScopedKey(STORAGE_KEYS.TEST_HISTORY);
  const keyLatest = getScopedKey(STORAGE_KEYS.LATEST_RESULT);

  const history = getAptitudeHistory();
  const updatedHistory = [
    stampedResult,
    ...history.filter((h) => h.id !== stampedResult.id),
  ];

  safeSet(keyHistory, updatedHistory);
  safeSet(keyLatest, stampedResult);

  return stampedResult;
};

export const getResultById = (id) => {
  if (!id) return null;
  const { isGuest, userId, accountId } = getActiveUserScope();

  // Check latest result first
  const latestKey = getScopedKey(STORAGE_KEYS.LATEST_RESULT);
  const latest = safeGet(latestKey, null);
  if (latest && latest.id === id) {
    if (isGuest && (!latest.userId || latest.userId === "guest")) return latest;
    if (!isGuest && (latest.userId === userId || (accountId && latest.userAccountId === accountId))) {
      return latest;
    }
  }

  // Check user-scoped history
  const history = getAptitudeHistory();
  const found = history.find((h) => h.id === id);
  if (!found) return null;

  // Strict ownership verification
  if (isGuest) {
    return !found.userId || found.userId === "guest" ? found : null;
  }

  const isOwner = found.userId === userId || (accountId && found.userAccountId === accountId);
  return isOwner ? found : null;
};

export const clearAptitudeHistory = () => {
  const keyHistory = getScopedKey(STORAGE_KEYS.TEST_HISTORY);
  const keyLatest = getScopedKey(STORAGE_KEYS.LATEST_RESULT);
  safeRemove(keyHistory);
  safeRemove(keyLatest);
  return true;
};

/* --- Practice Mode Progress --- */
export const getPracticeProgress = () => {
  const key = getScopedKey(STORAGE_KEYS.PRACTICE_PROGRESS);
  return safeGet(key, {});
};

export const updatePracticeTopicProgress = (topicId, { attempted = 0, correct = 0 }) => {
  const progress = getPracticeProgress();
  const current = progress[topicId] || { attempted: 0, correct: 0 };
  const updated = {
    ...progress,
    [topicId]: {
      attempted: current.attempted + attempted,
      correct: current.correct + correct,
      lastPracticed: new Date().toISOString(),
    },
  };
  const key = getScopedKey(STORAGE_KEYS.PRACTICE_PROGRESS);
  safeSet(key, updated);
  return updated;
};

/* --- Aggregate User Statistics (Scoped to Active User) --- */
export const getAptitudeAggregateStats = () => {
  const history = getAptitudeHistory();
  const practiceProgress = getPracticeProgress();

  let practiceAttempted = 0;
  let practiceCorrect = 0;
  Object.values(practiceProgress).forEach((p) => {
    practiceAttempted += p.attempted || 0;
    practiceCorrect += p.correct || 0;
  });

  let testAttempted = 0;
  let testCorrect = 0;
  let testsCompleted = 0;

  // Breakdown by category
  const categoryStats = {
    quantitative: { attempted: 0, correct: 0 },
    logical: { attempted: 0, correct: 0 },
    verbal: { attempted: 0, correct: 0 },
  };

  history.forEach((attempt) => {
    testsCompleted += 1;
    testAttempted += attempt.attempted || 0;
    testCorrect += attempt.correct || 0;

    (attempt.topicPerformance || []).forEach((tp) => {
      const cat = tp.category || "quantitative";
      if (categoryStats[cat]) {
        categoryStats[cat].attempted += tp.attempted || 0;
        categoryStats[cat].correct += tp.correct || 0;
      }
    });
  });

  const totalAttempted = practiceAttempted + testAttempted;
  const totalCorrect = practiceCorrect + testCorrect;
  const overallAccuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const quantAcc =
    categoryStats.quantitative.attempted > 0
      ? Math.round(
          (categoryStats.quantitative.correct /
            categoryStats.quantitative.attempted) *
            100
        )
      : 0;

  const logicalAcc =
    categoryStats.logical.attempted > 0
      ? Math.round(
          (categoryStats.logical.correct /
            categoryStats.logical.attempted) *
            100
        )
      : 0;

  const verbalAcc =
    categoryStats.verbal.attempted > 0
      ? Math.round(
          (categoryStats.verbal.correct /
            categoryStats.verbal.attempted) *
            100
        )
      : 0;

  return {
    totalAttempted,
    totalCorrect,
    overallAccuracy,
    testsCompleted,
    categoryAccuracy: {
      quantitative: quantAcc,
      logical: logicalAcc,
      verbal: verbalAcc,
    },
    recentAttempts: history.slice(0, 5),
    hasHistory: totalAttempted > 0 || testsCompleted > 0,
  };
};
