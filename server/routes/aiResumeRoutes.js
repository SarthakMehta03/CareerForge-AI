const express = require("express");
const router = express.Router();
const {
  generateSummary,
  improveWriting,
  improveExperience,
  improveProject,
  checkGrammar,
  suggestSkills,
  analyzeATS,
  matchJobDescription,
} = require("../controllers/aiResumeController");
const { protect } = require("../middleware/authMiddleware");

// All AI routes protected by JWT middleware
router.use(protect);

router.post("/summary", generateSummary);
router.post("/improve", improveWriting);
router.post("/improve-experience", improveExperience);
router.post("/improve-project", improveProject);
router.post("/grammar", checkGrammar);
router.post("/skills", suggestSkills);
router.post("/ats", analyzeATS);
router.post("/job-match", matchJobDescription);

module.exports = router;
