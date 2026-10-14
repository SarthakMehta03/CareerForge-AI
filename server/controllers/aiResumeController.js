const aiResumeService = require("../services/aiResumeService");

// 1. Generate Summary
const generateSummary = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const summary = await aiResumeService.generateSummary(resumeData || {});
    res.status(200).json({ success: true, result: summary });
  } catch (error) {
    console.error("AI Generate Summary Error:", error);
    res.status(500).json({ success: false, message: "AI generation failed" });
  }
};

// 2. Improve Writing
const improveWriting = async (req, res) => {
  try {
    const { text, context } = req.body;
    const result = await aiResumeService.improveWriting(text, context);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("AI Improve Writing Error:", error);
    res.status(500).json({ success: false, message: "AI rephrase failed" });
  }
};

// 3. Improve Experience
const improveExperience = async (req, res) => {
  try {
    const { description } = req.body;
    const result = await aiResumeService.improveExperience(description);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("AI Improve Experience Error:", error);
    res.status(500).json({ success: false, message: "AI experience polish failed" });
  }
};

// 4. Improve Project
const improveProject = async (req, res) => {
  try {
    const { description } = req.body;
    const result = await aiResumeService.improveProject(description);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("AI Improve Project Error:", error);
    res.status(500).json({ success: false, message: "AI project polish failed" });
  }
};

// 5. Check Grammar
const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    const result = await aiResumeService.checkGrammar(text);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("AI Check Grammar Error:", error);
    res.status(500).json({ success: false, message: "Grammar check failed" });
  }
};

// 6. Skill Suggestions
const suggestSkills = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const suggestions = await aiResumeService.suggestSkills(resumeData || {});
    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    console.error("AI Suggest Skills Error:", error);
    res.status(500).json({ success: false, message: "Skill suggestion failed" });
  }
};

// 7. Analyze ATS
const analyzeATS = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const analysis = await aiResumeService.analyzeATS(resumeData || {});
    res.status(200).json({ success: true, ...analysis });
  } catch (error) {
    console.error("AI Analyze ATS Error:", error);
    res.status(500).json({ success: false, message: "ATS analysis failed" });
  }
};

// 8. Match Job Description
const matchJobDescription = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const result = await aiResumeService.matchJobDescription(resumeData || {}, jobDescription);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("AI Match Job Error:", error);
    res.status(500).json({ success: false, message: "Job description matching failed" });
  }
};

module.exports = {
  generateSummary,
  improveWriting,
  improveExperience,
  improveProject,
  checkGrammar,
  suggestSkills,
  analyzeATS,
  matchJobDescription,
};
