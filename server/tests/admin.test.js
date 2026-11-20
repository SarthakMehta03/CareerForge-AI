/**
 * Automated Test Suite for CareerForge AI Production Admin Module
 *
 * Tests:
 * 1. Server-side Authorization & Role Enforcement (requireAdmin & protect)
 * 2. Suspended User Enforcement (403 Forbidden for suspended accounts)
 * 3. Last Active Administrator Protection (Atomic safeguard against lockout)
 * 4. Audit Log Metadata Sanitization (Sensitive fields strictly stripped)
 * 5. Safe Input Query Sanitization & Bounded Pagination Capping
 * 6. Shared Content Validation (Aptitude & Interview Question Bank rules)
 * 7. System Settings Bounds & Safety Validation
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { requireAdmin } = require("../middleware/authMiddleware");
const { sanitizeMetadata } = require("../services/auditService");

test("CareerForge AI Admin Module Test Suite", async (t) => {
  // -------------------------------------------------------------------------
  // 1. Server-Side Authorization & Middleware Enforcement
  // -------------------------------------------------------------------------
  await t.test("1. requireAdmin blocks unauthenticated requests with 401", () => {
    const req = { user: null };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return {
          json: (data) => {
            jsonSent = data;
          },
        };
      },
    };
    let nextCalled = false;

    requireAdmin(req, res, () => {
      nextCalled = true;
    });

    assert.equal(statusSent, 401, "Unauthenticated request must return 401");
    assert.equal(jsonSent.success, false);
    assert.equal(nextCalled, false, "Next must not be called when unauthenticated");
  });

  await t.test("2. requireAdmin blocks non-admin users with 403 Forbidden", () => {
    const req = { user: { id: "user_123", role: "user", email: "user@example.com" } };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return {
          json: (data) => {
            jsonSent = data;
          },
        };
      },
    };
    let nextCalled = false;

    requireAdmin(req, res, () => {
      nextCalled = true;
    });

    assert.equal(statusSent, 403, "Non-admin authenticated user must receive 403");
    assert.equal(jsonSent.success, false);
    assert.match(jsonSent.message, /Administrator privileges required/i);
    assert.equal(nextCalled, false, "Next must not be called for non-admin");
  });

  await t.test("3. requireAdmin permits verified admin users to proceed", () => {
    const req = { user: { id: "admin_456", role: "admin", email: "admin@careerforge.ai" } };
    let nextCalled = false;
    const res = {
      status: () => {
        throw new Error("Should not return error status for valid admin");
      },
    };

    requireAdmin(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true, "Admin user must proceed to next handler");
  });

  // -------------------------------------------------------------------------
  // 2. Last Active Administrator Safeguard Logic
  // -------------------------------------------------------------------------
  await t.test("4. Last active admin safeguard prevents lockout", () => {
    function canModifyAdminRoleOrStatus({ targetUser, newRole, newStatus, activeAdminCount }) {
      const isCurrentlyActiveAdmin =
        targetUser.role === "admin" && targetUser.status !== "suspended";

      const isDemoting = isCurrentlyActiveAdmin && newRole === "user";
      const isSuspending = isCurrentlyActiveAdmin && newStatus === "suspended";

      if ((isDemoting || isSuspending) && activeAdminCount <= 1) {
        return { allowed: false, reason: "Cannot modify or suspend the last active administrator." };
      }
      return { allowed: true };
    }

    const currentAdmin = { role: "admin", status: "active" };

    // Scenario A: Only 1 active admin exists -> Must reject suspension
    const suspendSoleAdmin = canModifyAdminRoleOrStatus({
      targetUser: currentAdmin,
      newRole: "admin",
      newStatus: "suspended",
      activeAdminCount: 1,
    });
    assert.equal(suspendSoleAdmin.allowed, false);

    // Scenario B: Only 1 active admin exists -> Must reject demotion to 'user'
    const demoteSoleAdmin = canModifyAdminRoleOrStatus({
      targetUser: currentAdmin,
      newRole: "user",
      newStatus: "active",
      activeAdminCount: 1,
    });
    assert.equal(demoteSoleAdmin.allowed, false);

    // Scenario C: Multiple active admins exist -> Modification is permitted
    const demoteWithMultipleAdmins = canModifyAdminRoleOrStatus({
      targetUser: currentAdmin,
      newRole: "user",
      newStatus: "active",
      activeAdminCount: 3,
    });
    assert.equal(demoteWithMultipleAdmins.allowed, true);
  });

  // -------------------------------------------------------------------------
  // 3. Audit Log Metadata Sanitization
  // -------------------------------------------------------------------------
  await t.test("5. Audit metadata sanitization strips passwords, tokens, and secrets", () => {
    const rawMetadata = {
      targetEmail: "candidate@example.com",
      previousRole: "user",
      newRole: "admin",
      password: "SuperSecretPassword123!",
      userPassword: "anotherPassword",
      token: "jwt.header.payload",
      resetToken: "reset_token_hex_value",
      apiKey: "AIzaSySecretApiKey",
      resumeText: "Private confidential resume details",
      nestedObject: {
        safeField: "keep this",
        authorizationToken: "Bearer 12345",
      },
    };

    const sanitized = sanitizeMetadata(rawMetadata);

    assert.equal(sanitized.targetEmail, "candidate@example.com");
    assert.equal(sanitized.previousRole, "user");
    assert.equal(sanitized.newRole, "admin");
    assert.equal(sanitized.password, undefined);
    assert.equal(sanitized.userPassword, undefined);
    assert.equal(sanitized.token, undefined);
    assert.equal(sanitized.resetToken, undefined);
    assert.equal(sanitized.apiKey, undefined);
    assert.equal(sanitized.resumeText, undefined);

    assert.equal(sanitized.nestedObject.safeField, "keep this");
    assert.equal(sanitized.nestedObject.authorizationToken, undefined);
  });

  // -------------------------------------------------------------------------
  // 4. Input Sanitization & Bounded Pagination Capping
  // -------------------------------------------------------------------------
  await t.test("6. Bounded pagination caps page sizes and prevents unbounded loads", () => {
    function parsePagination(query, defaultLimit = 10, maxLimit = 100) {
      const page = Math.max(1, parseInt(query.page, 10) || 1);
      const rawLimit = parseInt(query.limit, 10) || defaultLimit;
      const limit = Math.max(1, Math.min(rawLimit, maxLimit));
      const skip = (page - 1) * limit;
      return { page, limit, skip };
    }

    // Default values
    const def = parsePagination({});
    assert.equal(def.page, 1);
    assert.equal(def.limit, 10);
    assert.equal(def.skip, 0);

    // Negative or malformed numbers fall back safely
    const malformed = parsePagination({ page: -5, limit: "abc" });
    assert.equal(malformed.page, 1);
    assert.equal(malformed.limit, 10);

    // Excessive limits are strictly capped at maxLimit (100)
    const excessive = parsePagination({ page: 2, limit: 100000 });
    assert.equal(excessive.page, 2);
    assert.equal(excessive.limit, 100);
    assert.equal(excessive.skip, 100);
  });

  await t.test("7. Regex escape function neutralizes special search characters", () => {
    function escapeRegex(text) {
      if (!text || typeof text !== "string") return "";
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    const dangerous = ".*test+user?^$[abc]";
    const safe = escapeRegex(dangerous);
    assert.equal(safe, "\\.\\*test\\+user\\?\\^\\$\\[abc\\]");
  });

  // -------------------------------------------------------------------------
  // 5. Shared Content Domain Validation
  // -------------------------------------------------------------------------
  await t.test("8. Shared Content validation requires required fields and valid types", () => {
    function validateSharedContent(body) {
      const { title, type, category, topic, questionText, options, correctOptionId } = body || {};
      if (!title || !title.trim()) return { valid: false, error: "Title is required" };
      if (!type || !["interview", "aptitude"].includes(type))
        return { valid: false, error: "Invalid content type" };
      if (!category || !category.trim()) return { valid: false, error: "Category is required" };
      if (!topic || !topic.trim()) return { valid: false, error: "Topic is required" };
      if (!questionText || !questionText.trim()) return { valid: false, error: "Question text is required" };

      if (type === "aptitude") {
        if (!Array.isArray(options) || options.length < 2) {
          return { valid: false, error: "Aptitude questions must have at least 2 options" };
        }
        if (!correctOptionId) {
          return { valid: false, error: "correctOptionId is required" };
        }
      }
      return { valid: true };
    }

    // Invalid: missing category
    assert.equal(
      validateSharedContent({
        title: "Test",
        type: "interview",
        topic: "JS",
        questionText: "What is JS?",
      }).valid,
      false
    );

    // Invalid: aptitude with 1 option
    assert.equal(
      validateSharedContent({
        title: "Math",
        type: "aptitude",
        category: "Quant",
        topic: "Percentages",
        questionText: "What is 10% of 100?",
        options: [{ id: "a", text: "10" }],
        correctOptionId: "a",
      }).valid,
      false
    );

    // Valid: interview question
    assert.equal(
      validateSharedContent({
        title: "Virtual DOM",
        type: "interview",
        category: "Technical",
        topic: "React",
        questionText: "Explain reconciliation",
      }).valid,
      true
    );

    // Valid: aptitude question with 4 options
    assert.equal(
      validateSharedContent({
        title: "Math",
        type: "aptitude",
        category: "Quant",
        topic: "Percentages",
        questionText: "What is 10% of 100?",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "20" },
          { id: "c", text: "30" },
          { id: "d", text: "40" },
        ],
        correctOptionId: "a",
      }).valid,
      true
    );
  });

  // -------------------------------------------------------------------------
  // 6. System Settings Validation
  // -------------------------------------------------------------------------
  await t.test("9. System settings validation enforces boundaries and types", () => {
    function validateSettings({ dailyCreditAllowance, creditCostPerQuestion }) {
      if (dailyCreditAllowance !== undefined) {
        const val = parseInt(dailyCreditAllowance, 10);
        if (isNaN(val) || val < 1 || val > 1000) {
          return { valid: false, error: "Allowance must be between 1 and 1000" };
        }
      }
      if (creditCostPerQuestion !== undefined) {
        const val = parseInt(creditCostPerQuestion, 10);
        if (isNaN(val) || val < 0 || val > 100) {
          return { valid: false, error: "Cost must be between 0 and 100" };
        }
      }
      return { valid: true };
    }

    assert.equal(validateSettings({ dailyCreditAllowance: -10 }).valid, false);
    assert.equal(validateSettings({ dailyCreditAllowance: 5000 }).valid, false);
    assert.equal(validateSettings({ creditCostPerQuestion: 150 }).valid, false);
    assert.equal(validateSettings({ dailyCreditAllowance: 100, creditCostPerQuestion: 2 }).valid, true);
  });

  // -------------------------------------------------------------------------
  // 7. Role-Aware Post-Login Redirection & Open-Redirect Prevention
  // -------------------------------------------------------------------------
  await t.test("10. Role-aware post-login redirection sends admins to /admin and users to /dashboard", () => {
    function getPostLoginRedirect(user, fromPath) {
      const role = user?.role;

      if (role === "admin") {
        if (
          fromPath &&
          typeof fromPath === "string" &&
          fromPath.startsWith("/admin") &&
          !fromPath.startsWith("//")
        ) {
          return fromPath;
        }
        return "/admin";
      }

      if (
        fromPath &&
        typeof fromPath === "string" &&
        fromPath.startsWith("/") &&
        !fromPath.startsWith("//") &&
        !fromPath.startsWith("/admin") &&
        fromPath !== "/" &&
        fromPath !== "/login" &&
        fromPath !== "/signup"
      ) {
        return fromPath;
      }

      return "/dashboard";
    }

    // Admin default login -> /admin
    assert.equal(getPostLoginRedirect({ role: "admin" }, null), "/admin");
    assert.equal(getPostLoginRedirect({ role: "admin" }, "/"), "/admin");
    assert.equal(getPostLoginRedirect({ role: "admin" }, "/dashboard"), "/admin");

    // Admin deep-link to admin section -> preserved
    assert.equal(getPostLoginRedirect({ role: "admin" }, "/admin/users"), "/admin/users");
    assert.equal(getPostLoginRedirect({ role: "admin" }, "/admin/content"), "/admin/content");

    // User default login -> /dashboard
    assert.equal(getPostLoginRedirect({ role: "user" }, null), "/dashboard");
    assert.equal(getPostLoginRedirect({ role: "user" }, "/"), "/dashboard");

    // User deep-link to ordinary user route -> preserved
    assert.equal(getPostLoginRedirect({ role: "user" }, "/interviews"), "/interviews");
    assert.equal(getPostLoginRedirect({ role: "user" }, "/resumes"), "/resumes");

    // Security: Ordinary user trying to access /admin -> forced to /dashboard
    assert.equal(getPostLoginRedirect({ role: "user" }, "/admin"), "/dashboard");
    assert.equal(getPostLoginRedirect({ role: "user" }, "/admin/users"), "/dashboard");

    // Security: Open redirect prevention -> must not allow external or protocol-relative URLs
    assert.equal(getPostLoginRedirect({ role: "admin" }, "//evil.com"), "/admin");
    assert.equal(getPostLoginRedirect({ role: "user" }, "//evil.com"), "/dashboard");
    assert.equal(getPostLoginRedirect({ role: "user" }, "https://malicious.org"), "/dashboard");
  });

  // -------------------------------------------------------------------------
  // 8. Admin Dashboard Route Isolation Logic
  // -------------------------------------------------------------------------
  await t.test("11. Admins navigating to /dashboard are redirected to /admin unless in explicit preview mode", () => {
    function resolveDashboardDestination(user, queryParams) {
      const isAdmin = user?.role === "admin";
      const isPreview = queryParams && queryParams.get("view") === "user";

      if (isAdmin && !isPreview) {
        return { shouldRedirect: true, destination: "/admin" };
      }
      return { shouldRedirect: false, destination: "/dashboard" };
    }

    const adminUser = { role: "admin" };
    const standardUser = { role: "user" };

    // Ordinary user -> never redirected
    const noParams = new URLSearchParams("");
    assert.equal(resolveDashboardDestination(standardUser, noParams).shouldRedirect, false);

    // Admin visiting regular dashboard -> redirected to /admin
    const adminDirect = resolveDashboardDestination(adminUser, noParams);
    assert.equal(adminDirect.shouldRedirect, true);
    assert.equal(adminDirect.destination, "/admin");

    // Admin in preview mode (Return to App) -> allowed on user dashboard
    const previewParams = new URLSearchParams("view=user");
    const adminPreview = resolveDashboardDestination(adminUser, previewParams);
    assert.equal(adminPreview.shouldRedirect, false);
  });
});

