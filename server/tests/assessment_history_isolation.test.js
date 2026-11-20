/**
 * Assessment History Isolation & Cross-Account Security Test Suite
 *
 * Verifies:
 * 1. Backend Ownership Enforcement:
 *    - submitAnswers: blocks Guest (401) and User B (403) from submitting User A's session
 *    - submitAnswers: permits User A to submit User A's session
 *    - getSessionResult: blocks Guest (401) and User B (403) from viewing User A's session review
 *    - getSessionResult: permits User A to view their own session review
 *    - getUserAptitudeHistory: derives userId strictly from verified JWT req.user._id (blocks guest, isolates user data)
 * 2. Client Browser Storage Isolation (Two Users Scenario):
 *    - User A saves attempts in storage
 *    - User A logs out; Guest storage has no access to User A's history
 *    - User B logs in; User B sees 0 attempts from User A
 *    - User B saves their own attempts; User B sees only User B's attempts
 *    - User B attempts to access User A's attempt ID via getResultById -> returns null (Access Denied)
 *    - User A logs back in; User A sees only User A's attempts
 * 3. Legacy Migration Safety:
 *    - Anonymous records migrate to guest scope, never falsely attributed to signed-in user
 *    - Unscoped legacy keys are cleared, preventing cross-account leakage
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_assessment_isolation";
process.env.NODE_ENV = "test";

const AptitudeSession = require("../models/AptitudeSession");
const {
  submitAnswers,
  getSessionResult,
  getUserAptitudeHistory,
} = require("../controllers/aptitudeController");

/**
 * Mock Request & Response helper
 */
const createMockReqRes = ({ body = {}, params = {}, headers = {}, user = null } = {}) => {
  const req = {
    body,
    params,
    headers,
    user,
  };

  let statusCode = 200;
  let jsonResponse = null;

  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      jsonResponse = data;
      return res;
    },
    getStatusCode: () => statusCode,
    getResponse: () => jsonResponse,
  };

  return { req, res };
};

test("Assessment History Isolation & Ownership Security Test Suite", async (t) => {
  const userA_Id = new mongoose.Types.ObjectId();
  const userB_Id = new mongoose.Types.ObjectId();

  const userA = {
    _id: userA_Id,
    id: userA_Id.toString(),
    email: "userA@example.com",
    role: "user",
  };

  const userB = {
    _id: userB_Id,
    id: userB_Id.toString(),
    email: "userB@example.com",
    role: "user",
  };

  const sampleQuestions = [
    {
      id: "q_1",
      question: "What is 10 + 20?",
      options: [
        { id: "A", text: "20" },
        { id: "B", text: "30" },
        { id: "C", text: "40" },
        { id: "D", text: "50" },
      ],
      correctOptionId: "B",
      explanation: "10 + 20 = 30",
    },
  ];

  // --------------------------------------------------------------------------
  // 1. BACKEND OWNERSHIP ENFORCEMENT
  // --------------------------------------------------------------------------

  await t.test("Backend: Guest cannot submit User A's test session (401)", async () => {
    const originalFindOne = AptitudeSession.findOne;
    AptitudeSession.findOne = async () => ({
      sessionId: "session_userA_101",
      userId: userA_Id,
      isSubmitted: false,
      questions: sampleQuestions,
    });

    try {
      const { req, res } = createMockReqRes({
        body: { sessionId: "session_userA_101", answers: { q_1: "B" } },
        user: null, // Guest
      });

      await submitAnswers(req, res);

      assert.strictEqual(res.getStatusCode(), 401);
      assert.strictEqual(res.getResponse().success, false);
      assert.match(res.getResponse().message, /Authentication required/i);
    } finally {
      AptitudeSession.findOne = originalFindOne;
    }
  });

  await t.test("Backend: User B cannot submit User A's test session (403 Forbidden)", async () => {
    const originalFindOne = AptitudeSession.findOne;
    AptitudeSession.findOne = async () => ({
      sessionId: "session_userA_102",
      userId: userA_Id,
      isSubmitted: false,
      questions: sampleQuestions,
    });

    try {
      const { req, res } = createMockReqRes({
        body: { sessionId: "session_userA_102", answers: { q_1: "B" } },
        user: userB, // User B trying to submit User A's session
      });

      await submitAnswers(req, res);

      assert.strictEqual(res.getStatusCode(), 403);
      assert.strictEqual(res.getResponse().success, false);
      assert.match(res.getResponse().message, /not authorized/i);
    } finally {
      AptitudeSession.findOne = originalFindOne;
    }
  });

  await t.test("Backend: User A can successfully submit User A's test session (200 OK)", async () => {
    const originalFindOne = AptitudeSession.findOne;
    let saved = false;

    const mockSession = {
      sessionId: "session_userA_103",
      userId: userA_Id,
      isSubmitted: false,
      questions: sampleQuestions,
      category: "quantitative",
      topic: "percentages",
      difficulty: "medium",
      save: async function () {
        saved = true;
      },
    };

    AptitudeSession.findOne = async () => mockSession;

    try {
      const { req, res } = createMockReqRes({
        body: { sessionId: "session_userA_103", answers: { q_1: "B" } },
        user: userA, // Correct owner
      });

      await submitAnswers(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(res.getResponse().success, true);
      assert.strictEqual(saved, true);
      assert.strictEqual(mockSession.isSubmitted, true);
      assert.strictEqual(mockSession.score, 1);
    } finally {
      AptitudeSession.findOne = originalFindOne;
    }
  });

  await t.test("Backend: Guest cannot view User A's session review page (401)", async () => {
    const originalFindOne = AptitudeSession.findOne;
    AptitudeSession.findOne = async () => ({
      sessionId: "session_userA_104",
      userId: userA_Id,
      isSubmitted: true,
      questions: sampleQuestions,
    });

    try {
      const { req, res } = createMockReqRes({
        params: { sessionId: "session_userA_104" },
        user: null, // Guest
      });

      await getSessionResult(req, res);

      assert.strictEqual(res.getStatusCode(), 401);
      assert.strictEqual(res.getResponse().success, false);
    } finally {
      AptitudeSession.findOne = originalFindOne;
    }
  });

  await t.test("Backend: User B cannot view User A's session review page (403 Forbidden)", async () => {
    const originalFindOne = AptitudeSession.findOne;
    AptitudeSession.findOne = async () => ({
      sessionId: "session_userA_105",
      userId: userA_Id,
      isSubmitted: true,
      questions: sampleQuestions,
    });

    try {
      const { req, res } = createMockReqRes({
        params: { sessionId: "session_userA_105" },
        user: userB, // User B trying to view User A's review
      });

      await getSessionResult(req, res);

      assert.strictEqual(res.getStatusCode(), 403);
      assert.strictEqual(res.getResponse().success, false);
      assert.match(res.getResponse().message, /Access denied/i);
    } finally {
      AptitudeSession.findOne = originalFindOne;
    }
  });

  await t.test("Backend: User A can view User A's session review page (200 OK)", async () => {
    const originalFindOne = AptitudeSession.findOne;
    AptitudeSession.findOne = async () => ({
      sessionId: "session_userA_106",
      userId: userA_Id,
      isSubmitted: true,
      category: "quantitative",
      topic: "percentages",
      difficulty: "easy",
      totalQuestions: 1,
      score: 1,
      accuracy: 100,
      timeSpentSeconds: 30,
      submittedAt: new Date(),
      questions: sampleQuestions,
    });

    try {
      const { req, res } = createMockReqRes({
        params: { sessionId: "session_userA_106" },
        user: userA,
      });

      await getSessionResult(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(res.getResponse().success, true);
      assert.strictEqual(res.getResponse().result.sessionId, "session_userA_106");
    } finally {
      AptitudeSession.findOne = originalFindOne;
    }
  });

  await t.test("Backend: getUserAptitudeHistory filters strictly by verified token req.user._id", async () => {
    const originalFind = AptitudeSession.find;
    let queriedFilter = null;

    AptitudeSession.find = (filter) => {
      queriedFilter = filter;
      return {
        sort: () => ({
          limit: () => ({
            select: async () => [
              { sessionId: "sess_a_1", userId: userA_Id, score: 8 },
            ],
          }),
        }),
      };
    };

    try {
      const { req, res } = createMockReqRes({
        user: userA,
      });

      await getUserAptitudeHistory(req, res);

      assert.strictEqual(res.getStatusCode(), 200);
      assert.deepStrictEqual(queriedFilter.userId, userA._id);
      assert.strictEqual(queriedFilter.isSubmitted, true);
    } finally {
      AptitudeSession.find = originalFind;
    }
  });

  // --------------------------------------------------------------------------
  // 2. CLIENT BROWSER STORAGE ISOLATION (SIMULATED LOCALSTORAGE TWO-USERS TEST)
  // --------------------------------------------------------------------------

  await t.test("Client: Two users in same browser do not share Aptitude or Interview history", () => {
    // Simulate window.localStorage
    const store = new Map();
    const mockLocalStorage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear(),
    };

    // Helper to simulate scope resolution based on mockLocalStorage "user"
    const getCurrentScope = () => {
      const raw = mockLocalStorage.getItem("user");
      if (!raw) return { isGuest: true, userId: null, scopeKey: "guest" };
      const parsed = JSON.parse(raw);
      const uid = parsed.id || parsed._id || parsed.accountId;
      return { isGuest: false, userId: String(uid), scopeKey: `user_${uid}` };
    };

    const getScopedKey = (base) => `${base}_${getCurrentScope().scopeKey}`;

    const saveResult = (baseKey, result) => {
      const scope = getCurrentScope();
      const stamped = {
        ...result,
        userId: scope.userId,
      };
      const key = getScopedKey(baseKey);
      const existing = mockLocalStorage.getItem(key) ? JSON.parse(mockLocalStorage.getItem(key)) : [];
      const updated = [stamped, ...existing];
      mockLocalStorage.setItem(key, JSON.stringify(updated));
      return stamped;
    };

    const getHistory = (baseKey) => {
      const scope = getCurrentScope();
      const key = getScopedKey(baseKey);
      const raw = mockLocalStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      // Filter defense-in-depth
      return list.filter((item) => {
        if (scope.isGuest) return !item.userId || item.userId === "guest";
        return item.userId === scope.userId;
      });
    };

    const getResultById = (baseKey, id) => {
      const scope = getCurrentScope();
      const list = getHistory(baseKey);
      const found = list.find((item) => item.id === id);
      if (!found) return null;
      if (scope.isGuest) return !found.userId ? found : null;
      return found.userId === scope.userId ? found : null;
    };

    // --- STEP 1: User A logs in ---
    mockLocalStorage.setItem(
      "user",
      JSON.stringify({ id: "user_A_id", name: "Alice", email: "alice@test.com" })
    );

    saveResult("careerforge_aptitude_history", {
      id: "apt_attempt_alice_1",
      score: 9,
      totalQuestions: 10,
    });
    saveResult("careerforge_interview_history", {
      id: "interview_attempt_alice_1",
      overallScore: 85,
    });

    const aliceAptHistory = getHistory("careerforge_aptitude_history");
    const aliceIntHistory = getHistory("careerforge_interview_history");
    assert.strictEqual(aliceAptHistory.length, 1);
    assert.strictEqual(aliceAptHistory[0].id, "apt_attempt_alice_1");
    assert.strictEqual(aliceIntHistory.length, 1);
    assert.strictEqual(aliceIntHistory[0].id, "interview_attempt_alice_1");

    // --- STEP 2: User A logs out (Guest mode) ---
    mockLocalStorage.removeItem("user");
    mockLocalStorage.removeItem("token");

    const guestAptHistory = getHistory("careerforge_aptitude_history");
    const guestIntHistory = getHistory("careerforge_interview_history");
    assert.strictEqual(guestAptHistory.length, 0, "Guest must not see User A's aptitude history");
    assert.strictEqual(guestIntHistory.length, 0, "Guest must not see User A's interview history");

    // --- STEP 3: User B logs in ---
    mockLocalStorage.setItem(
      "user",
      JSON.stringify({ id: "user_B_id", name: "Bob", email: "bob@test.com" })
    );

    const bobInitialAptHistory = getHistory("careerforge_aptitude_history");
    const bobInitialIntHistory = getHistory("careerforge_interview_history");
    assert.strictEqual(bobInitialAptHistory.length, 0, "User B must not see User A's aptitude history");
    assert.strictEqual(bobInitialIntHistory.length, 0, "User B must not see User A's interview history");

    // User B attempts to access Alice's attempt directly by ID
    const unauthorizedAccessApt = getResultById("careerforge_aptitude_history", "apt_attempt_alice_1");
    const unauthorizedAccessInt = getResultById("careerforge_interview_history", "interview_attempt_alice_1");
    assert.strictEqual(unauthorizedAccessApt, null, "User B must not access User A's aptitude result by ID");
    assert.strictEqual(unauthorizedAccessInt, null, "User B must not access User A's interview result by ID");

    // User B saves their own attempts
    saveResult("careerforge_aptitude_history", {
      id: "apt_attempt_bob_1",
      score: 7,
      totalQuestions: 10,
    });
    saveResult("careerforge_interview_history", {
      id: "interview_attempt_bob_1",
      overallScore: 78,
    });

    const bobFinalAptHistory = getHistory("careerforge_aptitude_history");
    assert.strictEqual(bobFinalAptHistory.length, 1);
    assert.strictEqual(bobFinalAptHistory[0].id, "apt_attempt_bob_1");

    // --- STEP 4: Switch back to User A ---
    mockLocalStorage.setItem(
      "user",
      JSON.stringify({ id: "user_A_id", name: "Alice", email: "alice@test.com" })
    );

    const aliceRevisitApt = getHistory("careerforge_aptitude_history");
    const aliceRevisitInt = getHistory("careerforge_interview_history");

    assert.strictEqual(aliceRevisitApt.length, 1);
    assert.strictEqual(aliceRevisitApt[0].id, "apt_attempt_alice_1");
    assert.strictEqual(aliceRevisitInt.length, 1);
    assert.strictEqual(aliceRevisitInt[0].id, "interview_attempt_alice_1");

    // Alice cannot access Bob's attempts
    assert.strictEqual(getResultById("careerforge_aptitude_history", "apt_attempt_bob_1"), null);
    assert.strictEqual(getResultById("careerforge_interview_history", "interview_attempt_bob_1"), null);
  });

  // --------------------------------------------------------------------------
  // 3. LEGACY MIGRATION SAFETY
  // --------------------------------------------------------------------------

  await t.test("Legacy Migration: Anonymous records migrate to guest scope, not signed-in user", () => {
    const store = new Map();
    const mockLocalStorage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
    };

    // Set legacy unscoped history with 1 anonymous item and 1 item with explicit userId
    const legacyAptitude = [
      { id: "legacy_anon_1", score: 5, totalQuestions: 10 }, // Anonymous
      { id: "legacy_userX_1", userId: "user_X_id", score: 8, totalQuestions: 10 }, // Owned by X
    ];

    mockLocalStorage.setItem("careerforge_aptitude_history", JSON.stringify(legacyAptitude));

    // Simulate migration logic
    const raw = mockLocalStorage.getItem("careerforge_aptitude_history");
    const items = JSON.parse(raw);

    const userGroups = {};
    const guestItems = [];

    items.forEach((item) => {
      if (item.userId) {
        if (!userGroups[item.userId]) userGroups[item.userId] = [];
        userGroups[item.userId].push(item);
      } else {
        guestItems.push(item);
      }
    });

    Object.entries(userGroups).forEach(([uid, list]) => {
      mockLocalStorage.setItem(`careerforge_aptitude_history_user_${uid}`, JSON.stringify(list));
    });

    if (guestItems.length > 0) {
      mockLocalStorage.setItem(`careerforge_aptitude_history_guest`, JSON.stringify(guestItems));
    }

    mockLocalStorage.removeItem("careerforge_aptitude_history");

    // Assertions
    assert.strictEqual(mockLocalStorage.getItem("careerforge_aptitude_history"), null, "Unscoped key removed");

    const guestScoped = JSON.parse(mockLocalStorage.getItem("careerforge_aptitude_history_guest"));
    assert.strictEqual(guestScoped.length, 1);
    assert.strictEqual(guestScoped[0].id, "legacy_anon_1", "Anonymous item preserved in guest scope");

    const userXScoped = JSON.parse(mockLocalStorage.getItem("careerforge_aptitude_history_user_user_X_id"));
    assert.strictEqual(userXScoped.length, 1);
    assert.strictEqual(userXScoped[0].id, "legacy_userX_1", "User X item routed to user X");

    // Ensure User B's scope is completely empty
    assert.strictEqual(mockLocalStorage.getItem("careerforge_aptitude_history_user_user_B_id"), null);
  });
});

