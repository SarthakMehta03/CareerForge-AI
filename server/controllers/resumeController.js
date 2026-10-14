const Resume = require("../models/Resume");
const { analyzeATS } = require("../services/aiResumeService");

// Default initial resume structure
const defaultResumeData = {
  title: "Untitled Resume",
  template: "modern",
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    photo: "",
  },
  summary: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
  customSections: [],
  sectionOrder: [
    "personalInfo",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "interests",
  ],
  hiddenSections: [],
  atsScore: 0,
};

// 1. Create Resume
const createResume = async (req, res) => {
  try {
    const { title, template } = req.body;

    const newResume = new Resume({
      ...defaultResumeData,
      userId: req.user.id,
      title: title || "My Resume",
      template: template || "modern",
      personalInfo: {
        ...defaultResumeData.personalInfo,
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
        photo: "",
      },
    });

    const atsResult = await analyzeATS(newResume);
    newResume.atsScore = atsResult.atsScore;

    await newResume.save();

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    console.error("Create Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create resume",
    });
  }
};

// 2. Get All Resumes for Logged-In User
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get Resumes Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

// 3. Get Single Resume by ID
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get Resume By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume details",
    });
  }
};

// 4. Update Resume
const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized access",
      });
    }

    const updateFields = req.body;

    // Recalculate ATS score on update
    const tempResumeObj = { ...resume.toObject(), ...updateFields };
    const atsResult = await analyzeATS(tempResumeObj);
    updateFields.atsScore = atsResult.atsScore;

    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Update Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

// 5. Delete Resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};

// 6. Duplicate Resume
const duplicateResume = async (req, res) => {
  try {
    const original = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!original) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized access",
      });
    }

    const obj = original.toObject();
    delete obj._id;
    delete obj.createdAt;
    delete obj.updatedAt;

    obj.title = `${original.title} (Copy)`;

    const copyResume = new Resume(obj);
    await copyResume.save();

    res.status(201).json({
      success: true,
      message: "Resume duplicated successfully",
      resume: copyResume,
    });
  } catch (error) {
    console.error("Duplicate Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to duplicate resume",
    });
  }
};

module.exports = {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
};
