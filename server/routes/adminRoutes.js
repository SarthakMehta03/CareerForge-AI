const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const {
  getAdminOverview,
  getUsers,
  getUserDetail,
  updateUserStatus,
  updateUserRole,
  getSharedContent,
  getSharedContentItem,
  createSharedContent,
  updateSharedContent,
  archiveSharedContent,
  deleteSharedContent,
  seedSharedContent,
  getActivityReports,
  getAuditLogs,
  getSystemSettings,
  updateSystemSettings,
} = require("../controllers/adminController");

// Enforce server-side authentication AND admin role verification on every endpoint
router.use(protect, requireAdmin);

// 1. Overview
router.get("/overview", getAdminOverview);

// 2. User Management
router.get("/users", getUsers);
router.get("/users/:id", getUserDetail);
router.put("/users/:id/status", updateUserStatus);
router.put("/users/:id/role", updateUserRole);

// 3. Shared Content Management (Question Bank & Curated Prep)
router.get("/content", getSharedContent);
router.post("/content", createSharedContent);
router.post("/content/seed", seedSharedContent);
router.get("/content/:id", getSharedContentItem);
router.put("/content/:id", updateSharedContent);
router.put("/content/:id/archive", archiveSharedContent);
router.delete("/content/:id", deleteSharedContent);

// 4. Activity & Aggregate Reports
router.get("/reports/activity", getActivityReports);

// 5. Audit Log
router.get("/audit-logs", getAuditLogs);

// 6. System Settings
router.get("/settings", getSystemSettings);
router.put("/settings", updateSystemSettings);

module.exports = router;
