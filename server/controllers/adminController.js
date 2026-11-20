const mongoose = require("mongoose");
const User = require("../models/User");
const Resume = require("../models/Resume");
const AptitudeSession = require("../models/AptitudeSession");
const CreditLedger = require("../models/CreditLedger");
const SharedContent = require("../models/SharedContent");
const AuditLog = require("../models/AuditLog");
const SystemSetting = require("../models/SystemSetting");
const { logAdminAction } = require("../services/auditService");
const { getUserCreditSummary } = require("../services/creditService");
const { verifyFreeTierEligibility } = require("../services/geminiService");

/**
 * Escapes regex special characters to prevent ReDoS / injection in queries.
 */
function escapeRegex(text) {
  if (!text || typeof text !== "string") return "";
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Helper to parse bounded pagination values.
 */
function parsePagination(query, defaultLimit = 10, maxLimit = 100) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const rawLimit = parseInt(query.limit, 10) || defaultLimit;
  const limit = Math.max(1, Math.min(rawLimit, maxLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// =========================================================================
// 1. ADMIN OVERVIEW & DASHBOARD METRICS
// =========================================================================

const getAdminOverview = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Parallel aggregate counts for dashboard totals
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      adminUsers,
      recentUsers7d,
      recentUsers30d,
      totalResumes,
      recentResumes7d,
      totalAptitudeSessions,
      submittedAptitudeSessions,
      totalInterviewSessions,
      recentInterviewSessions7d,
      totalSharedContent,
      recentAuditLogs,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ status: { $ne: "suspended" } }),
      User.countDocuments({ status: "suspended" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Resume.countDocuments({}),
      Resume.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      AptitudeSession.countDocuments({}),
      AptitudeSession.countDocuments({ isSubmitted: true }),
      CreditLedger.countDocuments({ "metadata.module": "interview", status: "COMMITTED" }),
      CreditLedger.countDocuments({
        "metadata.module": "interview",
        status: "COMMITTED",
        createdAt: { $gte: sevenDaysAgo },
      }),
      SharedContent.countDocuments({ isArchived: false }),
      AuditLog.find({}).sort({ createdAt: -1 }).limit(6).lean(),
    ]);

    // Average aptitude accuracy across submitted tests
    const aptitudeAccuracyAgg = await AptitudeSession.aggregate([
      { $match: { isSubmitted: true } },
      { $group: { _id: null, avgAccuracy: { $avg: "$accuracy" }, avgScore: { $avg: "$score" } } },
    ]);
    const avgAptitudeAccuracy =
      aptitudeAccuracyAgg.length > 0 ? Math.round(aptitudeAccuracyAgg[0].avgAccuracy || 0) : 0;

    // Average ATS score across resumes
    const resumeAtsAgg = await Resume.aggregate([
      { $match: { atsScore: { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: "$atsScore" } } },
    ]);
    const avgAtsScore =
      resumeAtsAgg.length > 0 ? Math.round(resumeAtsAgg[0].avgScore || 0) : 0;

    // System status
    const geminiStatus = verifyFreeTierEligibility();
    const systemStatus = {
      database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      aiService: geminiStatus.eligible ? "Operational" : "Unavailable",
      aiModel: geminiStatus.model || "None configured",
      nodeEnv: process.env.NODE_ENV || "development",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      metrics: {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          admins: adminUsers,
          newLast7Days: recentUsers7d,
          newLast30Days: recentUsers30d,
        },
        resumes: {
          total: totalResumes,
          newLast7Days: recentResumes7d,
          avgAtsScore,
        },
        interviews: {
          totalSessions: totalInterviewSessions,
          sessionsLast7Days: recentInterviewSessions7d,
        },
        aptitude: {
          totalSessions: totalAptitudeSessions,
          completedSessions: submittedAptitudeSessions,
          avgAccuracy: avgAptitudeAccuracy,
        },
        content: {
          activeQuestions: totalSharedContent,
        },
      },
      recentAuditLogs,
      systemStatus,
    });
  } catch (error) {
    console.error("[AdminController] getAdminOverview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load administrative overview metrics.",
    });
  }
};

// =========================================================================
// 2. USER MANAGEMENT
// =========================================================================

const getUsers = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 10, 100);
    const { search, role, status } = req.query;

    const filter = {};

    if (search && typeof search === "string" && search.trim()) {
      const escaped = escapeRegex(search.trim());
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ];
    }

    if (role && ["user", "admin"].includes(role)) {
      filter.role = role;
    }

    if (status && ["active", "suspended"].includes(status)) {
      if (status === "active") {
        filter.status = { $ne: "suspended" };
      } else {
        filter.status = "suspended";
      }
    }

    const sortMap = {
      "-createdAt": { createdAt: -1 },
      "createdAt": { createdAt: 1 },
      "name": { name: 1 },
      "-name": { name: -1 },
      "email": { email: 1 },
      "-email": { email: -1 },
    };
    const sortObj = sortMap[req.query.sort] || { createdAt: -1 };

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select("-password -resetPasswordToken -resetPasswordExpire")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    // Format output with normalized status
    const formattedUsers = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role || "user",
      status: u.status || "active",
      avatar: u.avatar || "",
      googleId: Boolean(u.googleId),
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      users: formattedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("[AdminController] getUsers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user list.",
    });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    const user = await User.findById(id)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Retrieve activity summary without exposing private content
    const [resumeCount, aptitudeCount, interviewCount, credits] = await Promise.all([
      Resume.countDocuments({ userId: id }),
      AptitudeSession.countDocuments({ userId: id }),
      CreditLedger.countDocuments({
        userId: id,
        "metadata.module": "interview",
        status: "COMMITTED",
      }),
      getUserCreditSummary(id).catch(() => null),
    ]);

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        status: user.status || "active",
        avatar: user.avatar || "",
        phone: user.phone || "",
        location: user.location || {},
        bio: user.bio || "",
        isGoogleUser: Boolean(user.googleId),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        activity: {
          resumesCount: resumeCount,
          aptitudeAttemptsCount: aptitudeCount,
          interviewSessionsCount: interviewCount,
          creditBalance: credits?.balance ?? 0,
          dailyAllowance: credits?.dailyAllowance ?? 100,
        },
      },
    });
  } catch (error) {
    console.error("[AdminController] getUserDetail Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user details.",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    if (!status || !["active", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active' or 'suspended'.",
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found.",
      });
    }

    // CRITICAL SECURITY ENFORCEMENT:
    // Prevent accidental suspension of the last active administrator
    if (
      targetUser.role === "admin" &&
      targetUser.status !== "suspended" &&
      status === "suspended"
    ) {
      const activeAdminCount = await User.countDocuments({
        role: "admin",
        status: { $ne: "suspended" },
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "Operation rejected: Cannot suspend the last remaining active administrator.",
        });
      }
    }

    const previousStatus = targetUser.status || "active";
    targetUser.status = status;
    await targetUser.save();

    // Log administrative action
    await logAdminAction({
      admin: req.user,
      action: status === "suspended" ? "USER_SUSPEND" : "USER_REACTIVATE",
      targetId: String(targetUser._id),
      targetType: "User",
      metadata: {
        targetEmail: targetUser.email,
        targetName: targetUser.name,
        previousStatus,
        newStatus: status,
      },
      outcome: "SUCCESS",
      req,
    });

    return res.status(200).json({
      success: true,
      message: `User ${targetUser.email} has been ${
        status === "suspended" ? "suspended" : "reactivated"
      }.`,
      user: {
        _id: targetUser._id,
        email: targetUser.email,
        name: targetUser.name,
        role: targetUser.role,
        status: targetUser.status,
      },
    });
  } catch (error) {
    console.error("[AdminController] updateUserStatus Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user account status.",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'user' or 'admin'.",
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found.",
      });
    }

    // CRITICAL SECURITY ENFORCEMENT:
    // Prevent accidental demotion of the last active administrator
    if (
      targetUser.role === "admin" &&
      role === "user" &&
      targetUser.status !== "suspended"
    ) {
      const activeAdminCount = await User.countDocuments({
        role: "admin",
        status: { $ne: "suspended" },
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "Operation rejected: Cannot demote the last remaining active administrator.",
        });
      }
    }

    const previousRole = targetUser.role || "user";
    targetUser.role = role;
    await targetUser.save();

    // Log administrative action
    await logAdminAction({
      admin: req.user,
      action: "USER_ROLE_CHANGE",
      targetId: String(targetUser._id),
      targetType: "User",
      metadata: {
        targetEmail: targetUser.email,
        targetName: targetUser.name,
        previousRole,
        newRole: role,
      },
      outcome: "SUCCESS",
      req,
    });

    return res.status(200).json({
      success: true,
      message: `User ${targetUser.email} role updated to '${role}'.`,
      user: {
        _id: targetUser._id,
        email: targetUser.email,
        name: targetUser.name,
        role: targetUser.role,
        status: targetUser.status || "active",
      },
    });
  } catch (error) {
    console.error("[AdminController] updateUserRole Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role.",
    });
  }
};

// =========================================================================
// 3. SHARED CONTENT MANAGEMENT (QUESTION BANK)
// =========================================================================

const getSharedContent = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 12, 100);
    const { type, category, difficulty, archived, search } = req.query;

    const filter = {};

    if (type && ["interview", "aptitude"].includes(type)) {
      filter.type = type;
    }

    if (category && typeof category === "string" && category.trim()) {
      filter.category = category.trim();
    }

    if (difficulty && ["Easy", "Medium", "Hard"].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    if (archived === "true") {
      filter.isArchived = true;
    } else if (archived === "all") {
      // Return both active and archived
    } else {
      filter.isArchived = false;
    }

    if (search && typeof search === "string" && search.trim()) {
      const escaped = escapeRegex(search.trim());
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { questionText: { $regex: escaped, $options: "i" } },
        { topic: { $regex: escaped, $options: "i" } },
        { category: { $regex: escaped, $options: "i" } },
      ];
    }

    const [total, items] = await Promise.all([
      SharedContent.countDocuments(filter),
      SharedContent.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      content: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("[AdminController] getSharedContent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load shared question content.",
    });
  }
};

const getSharedContentItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID format.",
      });
    }

    const item = await SharedContent.findById(id).lean();
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Content item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("[AdminController] getSharedContentItem Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch content item.",
    });
  }
};

const createSharedContent = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      topic,
      difficulty = "Medium",
      experienceLevel = "All",
      questionText,
      options = [],
      correctOptionId = "",
      explanation = "",
      suggestedPoints = [],
      keywords = [],
      tags = [],
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required." });
    }
    if (!type || !["interview", "aptitude"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'interview' or 'aptitude'.",
      });
    }
    if (!category || typeof category !== "string" || !category.trim()) {
      return res.status(400).json({ success: false, message: "Category is required." });
    }
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ success: false, message: "Topic is required." });
    }
    if (!questionText || typeof questionText !== "string" || !questionText.trim()) {
      return res.status(400).json({ success: false, message: "Question text is required." });
    }

    // Aptitude validation
    if (type === "aptitude") {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Aptitude questions must have at least 2 options.",
        });
      }
      if (!correctOptionId || typeof correctOptionId !== "string") {
        return res.status(400).json({
          success: false,
          message: "A valid correctOptionId is required for aptitude questions.",
        });
      }
    }

    const content = new SharedContent({
      title: title.trim(),
      type,
      category: category.trim(),
      topic: topic.trim(),
      difficulty: ["Easy", "Medium", "Hard"].includes(difficulty) ? difficulty : "Medium",
      experienceLevel,
      questionText: questionText.trim(),
      options: type === "aptitude" ? options : [],
      correctOptionId: type === "aptitude" ? correctOptionId : "",
      explanation: typeof explanation === "string" ? explanation.trim() : "",
      suggestedPoints: Array.isArray(suggestedPoints) ? suggestedPoints : [],
      keywords: Array.isArray(keywords) ? keywords : [],
      tags: Array.isArray(tags) ? tags : [],
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await content.save();

    await logAdminAction({
      admin: req.user,
      action: "CONTENT_CREATE",
      targetId: String(content._id),
      targetType: "SharedContent",
      metadata: {
        title: content.title,
        type: content.type,
        category: content.category,
      },
      outcome: "SUCCESS",
      req,
    });

    return res.status(201).json({
      success: true,
      message: "Shared question created successfully.",
      content,
    });
  } catch (error) {
    console.error("[AdminController] createSharedContent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create shared content.",
    });
  }
};

const updateSharedContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID format.",
      });
    }

    const content = await SharedContent.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found.",
      });
    }

    const {
      title,
      category,
      topic,
      difficulty,
      experienceLevel,
      questionText,
      options,
      correctOptionId,
      explanation,
      suggestedPoints,
      keywords,
      tags,
    } = req.body;

    if (title && typeof title === "string" && title.trim()) content.title = title.trim();
    if (category && typeof category === "string" && category.trim()) content.category = category.trim();
    if (topic && typeof topic === "string" && topic.trim()) content.topic = topic.trim();
    if (difficulty && ["Easy", "Medium", "Hard"].includes(difficulty)) content.difficulty = difficulty;
    if (experienceLevel) content.experienceLevel = experienceLevel;
    if (questionText && typeof questionText === "string" && questionText.trim()) {
      content.questionText = questionText.trim();
    }
    if (options && Array.isArray(options)) content.options = options;
    if (correctOptionId !== undefined) content.correctOptionId = correctOptionId;
    if (explanation !== undefined) content.explanation = String(explanation).trim();
    if (suggestedPoints && Array.isArray(suggestedPoints)) content.suggestedPoints = suggestedPoints;
    if (keywords && Array.isArray(keywords)) content.keywords = keywords;
    if (tags && Array.isArray(tags)) content.tags = tags;

    content.updatedBy = req.user._id;
    await content.save();

    await logAdminAction({
      admin: req.user,
      action: "CONTENT_UPDATE",
      targetId: String(content._id),
      targetType: "SharedContent",
      metadata: {
        title: content.title,
        type: content.type,
      },
      outcome: "SUCCESS",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Shared content updated successfully.",
      content,
    });
  } catch (error) {
    console.error("[AdminController] updateSharedContent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update content item.",
    });
  }
};

const archiveSharedContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID format.",
      });
    }

    const content = await SharedContent.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found.",
      });
    }

    content.isArchived = !content.isArchived;
    content.updatedBy = req.user._id;
    await content.save();

    await logAdminAction({
      admin: req.user,
      action: content.isArchived ? "CONTENT_ARCHIVE" : "CONTENT_RESTORE",
      targetId: String(content._id),
      targetType: "SharedContent",
      metadata: {
        title: content.title,
        isArchived: content.isArchived,
      },
      outcome: "SUCCESS",
      req,
    });

    return res.status(200).json({
      success: true,
      message: `Content item '${content.title}' ${
        content.isArchived ? "archived" : "restored"
      }.`,
      content,
    });
  } catch (error) {
    console.error("[AdminController] archiveSharedContent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update content archive status.",
    });
  }
};

const deleteSharedContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID format.",
      });
    }

    const content = await SharedContent.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found.",
      });
    }

    const title = content.title;
    const type = content.type;
    await SharedContent.findByIdAndDelete(id);

    await logAdminAction({
      admin: req.user,
      action: "CONTENT_DELETE",
      targetId: String(id),
      targetType: "SharedContent",
      metadata: { title, type },
      outcome: "SUCCESS",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Content item deleted permanently.",
    });
  } catch (error) {
    console.error("[AdminController] deleteSharedContent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete content item.",
    });
  }
};

/**
 * Seeds initial curated shared content if collection is empty
 */
const seedSharedContent = async (req, res) => {
  try {
    const count = await SharedContent.countDocuments();
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Shared content already contains ${count} items. Seeding skipped to preserve existing data.`,
      });
    }

    // Default curated seeds covering interview and aptitude questions
    const seeds = [
      {
        title: "CSS Display Properties Differences",
        type: "interview",
        category: "Technical",
        topic: "HTML & CSS Core",
        difficulty: "Easy",
        experienceLevel: "Fresher",
        questionText:
          "Explain the difference between 'display: block', 'display: inline', and 'display: inline-block' in CSS. Provide common use cases for each.",
        suggestedPoints: [
          "Block takes full width and breaks line",
          "Inline respects text flow but ignores top/bottom dimensions",
          "Inline-block permits custom dimensions while staying inline",
        ],
        keywords: ["width", "height", "margin", "padding", "box model"],
        tags: ["frontend", "css", "web-fundamentals"],
      },
      {
        title: "JavaScript Equality Operators (== vs ===)",
        type: "interview",
        category: "Technical",
        topic: "JavaScript Fundamentals",
        difficulty: "Easy",
        experienceLevel: "Entry-level",
        questionText:
          "What is the difference between '==' and '===' in JavaScript, and why is strict equality generally preferred?",
        suggestedPoints: [
          "Type coercion occurs in loose equality",
          "Strict equality checks value and type",
          "Prevents bugs from falsy values",
        ],
        keywords: ["coercion", "type", "strict equality", "falsy"],
        tags: ["javascript", "core", "frontend"],
      },
      {
        title: "React Virtual DOM and Reconciliation",
        type: "interview",
        category: "Technical",
        topic: "React State Management",
        difficulty: "Medium",
        experienceLevel: "Entry-level",
        questionText:
          "Explain how React's Virtual DOM works and how reconciliation determines when a component needs to re-render.",
        suggestedPoints: [
          "In-memory representation of real DOM",
          "Diffing algorithm compares previous and next states",
          "Keys optimize list re-rendering",
        ],
        keywords: ["virtual dom", "diffing", "reconciliation", "keys"],
        tags: ["react", "frontend", "architecture"],
      },
      {
        title: "Handling Project Deadlines and Priorities",
        type: "interview",
        category: "Behavioral",
        topic: "Project Management",
        difficulty: "Medium",
        experienceLevel: "All",
        questionText:
          "Describe a situation where you had multiple competing priorities with tight deadlines. How did you prioritize your tasks?",
        suggestedPoints: [
          "Assessed business impact and dependencies",
          "Communicated early with stakeholders",
          "Applied structured time blocking",
        ],
        keywords: ["prioritization", "communication", "time management", "deadlines"],
        tags: ["behavioral", "soft-skills"],
      },
      {
        title: "Percentage Marks Calculation",
        type: "aptitude",
        category: "Quantitative Aptitude",
        topic: "Percentages",
        difficulty: "Easy",
        experienceLevel: "All",
        questionText:
          "A student scored 450 marks out of 600 in an examination. What is the percentage of marks obtained?",
        options: [
          { id: "a", text: "70%" },
          { id: "b", text: "75%" },
          { id: "c", text: "78%" },
          { id: "d", text: "80%" },
        ],
        correctOptionId: "b",
        explanation:
          "Percentage = (Marks Scored / Total Marks) × 100 = (450 / 600) × 100 = 75%.",
        tags: ["quantitative", "percentages", "math"],
      },
      {
        title: "Price Increase and Consumption Reduction",
        type: "aptitude",
        category: "Quantitative Aptitude",
        topic: "Percentages",
        difficulty: "Medium",
        experienceLevel: "All",
        questionText:
          "If the price of a commodity increases by 25%, by what percentage must a household reduce its consumption so that the total expenditure remains the same?",
        options: [
          { id: "a", text: "18%" },
          { id: "b", text: "20%" },
          { id: "c", text: "22.5%" },
          { id: "d", text: "25%" },
        ],
        correctOptionId: "b",
        explanation:
          "Reduction = [r / (100 + r)] × 100%. For r = 25%: [25 / 125] × 100 = 20%.",
        tags: ["quantitative", "percentages", "consumption"],
      },
      {
        title: "Syllogism: Books and Pens",
        type: "aptitude",
        category: "Logical Reasoning",
        topic: "Syllogism",
        difficulty: "Medium",
        experienceLevel: "All",
        questionText:
          "Statements: All books are pens. All pens are papers. Conclusions: I. Some papers are books. II. All books are papers.",
        options: [
          { id: "a", text: "Only conclusion I follows" },
          { id: "b", text: "Only conclusion II follows" },
          { id: "c", text: "Both I and II follow" },
          { id: "d", text: "Neither I nor II follows" },
        ],
        correctOptionId: "c",
        explanation:
          "Since Books ⊆ Pens ⊆ Papers, all books are papers, and some papers are definitely books. Both follow.",
        tags: ["logical-reasoning", "syllogisms"],
      },
    ];

    const inserted = await SharedContent.insertMany(
      seeds.map((s) => ({
        ...s,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      }))
    );

    await logAdminAction({
      admin: req.user,
      action: "CONTENT_SEED",
      targetId: null,
      targetType: "SharedContent",
      metadata: { count: inserted.length },
      outcome: "SUCCESS",
      req,
    });

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} curated questions.`,
      count: inserted.length,
    });
  } catch (error) {
    console.error("[AdminController] seedSharedContent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to seed default content.",
    });
  }
};

// =========================================================================
// 4. ACTIVITY & AGGREGATE REPORTS
// =========================================================================

const getActivityReports = async (req, res) => {
  try {
    const { range = "30d" } = req.query;

    const daysMap = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      all: 365,
    };
    const days = daysMap[range] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // 1. Daily User Registrations Trend
    const userSignupsTrend = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Daily Resumes Created Trend
    const resumeCreationTrend = await Resume.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Aptitude Tests by Category
    const aptitudeByCategory = await AptitudeSession.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$category",
          totalSessions: { $sum: 1 },
          submittedSessions: { $sum: { $cond: ["$isSubmitted", 1, 0] } },
          avgScore: { $avg: "$score" },
          avgAccuracy: { $avg: "$accuracy" },
        },
      },
      { $sort: { totalSessions: -1 } },
    ]);

    // 4. Resume Template Usage Distribution
    const resumeTemplates = await Resume.aggregate([
      { $group: { _id: "$template", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 5. Daily Interview Activity from CreditLedger
    const interviewDailyTrend = await CreditLedger.aggregate([
      {
        $match: {
          "metadata.module": "interview",
          status: "COMMITTED",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sessions: { $sum: 1 },
          creditsCharged: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format aggregate summary without private personal data
    return res.status(200).json({
      success: true,
      range,
      days,
      data: {
        userSignupsTrend,
        resumeCreationTrend,
        aptitudeByCategory,
        resumeTemplates,
        interviewDailyTrend,
      },
    });
  } catch (error) {
    console.error("[AdminController] getActivityReports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate activity report.",
    });
  }
};

// =========================================================================
// 5. AUDIT LOGS
// =========================================================================

const getAuditLogs = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 15, 100);
    const { action, targetType, search } = req.query;

    const filter = {};

    if (action && typeof action === "string" && action.trim()) {
      filter.action = action.trim().toUpperCase();
    }

    if (targetType && typeof targetType === "string" && targetType.trim()) {
      filter.targetType = targetType.trim();
    }

    if (search && typeof search === "string" && search.trim()) {
      const escaped = escapeRegex(search.trim());
      filter.$or = [
        { adminName: { $regex: escaped, $options: "i" } },
        { adminEmail: { $regex: escaped, $options: "i" } },
        { action: { $regex: escaped, $options: "i" } },
        { targetId: { $regex: escaped, $options: "i" } },
      ];
    }

    const [total, logs] = await Promise.all([
      AuditLog.countDocuments(filter),
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("[AdminController] getAuditLogs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load audit logs.",
    });
  }
};

// =========================================================================
// 6. SYSTEM SETTINGS
// =========================================================================

const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.find({}).lean();

    // Map stored database settings with code fallbacks
    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    // Provide safe, non-secret configurable values
    const responseSettings = {
      dailyCreditAllowance:
        settingsMap.daily_credit_allowance !== undefined
          ? settingsMap.daily_credit_allowance
          : parseInt(process.env.DAILY_CREDIT_ALLOWANCE || 100, 10),
      creditCostPerQuestion:
        settingsMap.credit_cost_per_question !== undefined
          ? settingsMap.credit_cost_per_question
          : parseInt(process.env.CREDIT_COST_PER_QUESTION || 2, 10),
      allowRegistration:
        settingsMap.allow_user_registration !== undefined
          ? settingsMap.allow_user_registration
          : true,
      maintenanceMode:
        settingsMap.maintenance_mode !== undefined
          ? settingsMap.maintenance_mode
          : false,
      defaultRoleOnSignup: "user",
    };

    return res.status(200).json({
      success: true,
      settings: responseSettings,
    });
  } catch (error) {
    console.error("[AdminController] getSystemSettings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load system settings.",
    });
  }
};

const updateSystemSettings = async (req, res) => {
  try {
    const {
      dailyCreditAllowance,
      creditCostPerQuestion,
      allowRegistration,
      maintenanceMode,
    } = req.body;

    const updates = {};
    const changesAudit = {};

    if (dailyCreditAllowance !== undefined) {
      const val = parseInt(dailyCreditAllowance, 10);
      if (isNaN(val) || val < 1 || val > 1000) {
        return res.status(400).json({
          success: false,
          message: "Daily credit allowance must be an integer between 1 and 1000.",
        });
      }
      updates.daily_credit_allowance = val;
      changesAudit.dailyCreditAllowance = val;
    }

    if (creditCostPerQuestion !== undefined) {
      const val = parseInt(creditCostPerQuestion, 10);
      if (isNaN(val) || val < 0 || val > 100) {
        return res.status(400).json({
          success: false,
          message: "Credit cost per question must be between 0 and 100.",
        });
      }
      updates.credit_cost_per_question = val;
      changesAudit.creditCostPerQuestion = val;
    }

    if (allowRegistration !== undefined) {
      const val = Boolean(allowRegistration);
      updates.allow_user_registration = val;
      changesAudit.allowRegistration = val;
    }

    if (maintenanceMode !== undefined) {
      const val = Boolean(maintenanceMode);
      updates.maintenance_mode = val;
      changesAudit.maintenanceMode = val;
    }

    // Upsert into SystemSetting collection
    for (const [key, value] of Object.entries(updates)) {
      await SystemSetting.findOneAndUpdate(
        { key },
        {
          key,
          value,
          updatedBy: req.user._id,
        },
        { upsert: true, new: true }
      );
    }

    await logAdminAction({
      admin: req.user,
      action: "SETTING_UPDATE",
      targetId: null,
      targetType: "SystemSetting",
      metadata: changesAudit,
      outcome: "SUCCESS",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "System settings updated successfully.",
      updates,
    });
  } catch (error) {
    console.error("[AdminController] updateSystemSettings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update system settings.",
    });
  }
};

module.exports = {
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
};
