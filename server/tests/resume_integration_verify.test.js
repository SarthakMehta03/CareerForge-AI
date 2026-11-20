const test = require("node:test");
const assert = require("node:assert");

const Resume = require("../models/Resume");
const resumeController = require("../controllers/resumeController");
const aiResumeController = require("../controllers/aiResumeController");
const aiResumeService = require("../services/aiResumeService");
const { getDemoDataForTemplate } = require("../utils/templateDemoData");

test("Resume Integration - All 10 Templates Supported with Demo Data", () => {
  const templates = [
    "modern",
    "classic",
    "minimal",
    "professional",
    "sidebar",
    "atlantic",
    "cobalt",
    "mercury",
    "saffron",
    "editorial",
  ];

  for (const t of templates) {
    const demo = getDemoDataForTemplate(t);
    assert.ok(demo, `Demo data exists for template: ${t}`);
    assert.ok(demo.personalInfo?.fullName, `Demo data has fullName for ${t}`);
    assert.ok(demo.skills?.length > 0, `Demo data has skills for ${t}`);
    assert.ok(demo.experience?.length > 0, `Demo data has experience for ${t}`);
    assert.ok(demo.education?.length > 0, `Demo data has education for ${t}`);
  }
});

test("Resume Integration - aiResumeService ATS subscores and metrics", async () => {
  const demoResume = getDemoDataForTemplate("modern");
  const result = await aiResumeService.analyzeATS(demoResume);

  assert.ok(result.atsScore >= 0 && result.atsScore <= 100, "ATS score must be between 0 and 100");
  assert.ok(Array.isArray(result.strengths), "strengths must be an array");
  assert.ok(Array.isArray(result.weaknesses), "weaknesses must be an array");
  assert.ok(Array.isArray(result.recommendations), "recommendations must be an array");
  assert.ok(result.subScores, "subScores object must be present");
  assert.ok(result.subScores.structure, "subScores must have structure");
  assert.ok(result.subScores.impact, "subScores must have impact");
  assert.ok(result.subScores.actionVerbs, "subScores must have actionVerbs");
  assert.ok(result.subScores.skills, "subScores must have skills");
});

test("Resume Integration - aiResumeService Fallbacks for Writing, Experience & Projects", async () => {
  const summary = await aiResumeService.generateSummary({
    personalInfo: { fullName: "Jane Smith", jobTitle: "Fullstack Engineer" },
    skills: [{ name: "React" }, { name: "Node.js" }],
    experience: [{ jobTitle: "Engineer" }],
  });
  assert.ok(typeof summary === "string" && summary.length > 30, "Generated summary must be valid string");

  const bullet = await aiResumeService.improveExperience("built an api and improved performance");
  assert.ok(typeof bullet === "string" && bullet.includes("•"), "Improved experience must format as bullet point");

  const project = await aiResumeService.improveProject("created a dashboard with charts");
  assert.ok(typeof project === "string" && project.includes("•"), "Improved project must format as bullet point");
});

test("Resume Integration - Cover Letter & Tailoring Fallbacks", async () => {
  const coverLetterResult = await aiResumeService.generateCoverLetter({
    resumeData: {
      personalInfo: { fullName: "Alex Doe", email: "alex@example.com" },
      experience: [{ jobTitle: "Software Engineer", company: "Tech Inc" }],
      skills: [{ name: "JavaScript" }, { name: "React" }],
    },
    companyName: "Google",
    jobDescription: "Software Engineer position focusing on distributed systems",
    tone: "confident",
  });

  assert.strictEqual(coverLetterResult.success, true);
  assert.ok(coverLetterResult.coverLetter.includes("Alex Doe"));
  assert.ok(coverLetterResult.coverLetter.includes("Google"));
});