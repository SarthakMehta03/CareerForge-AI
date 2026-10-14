import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { updateResume } from "../services/resumeService";

const ResumeContext = createContext();

export const initialResumeState = {
  title: "My Resume",
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

export function ResumeProvider({ children, initialData = null, resumeId = null }) {
  const [resume, setResume] = useState(initialData || initialResumeState);
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved', 'saving', 'error'
  const isFirstRender = useRef(true);

  // Update context state when initialData changes
  useEffect(() => {
    if (initialData) {
      setResume((prev) => ({
        ...initialResumeState,
        ...initialData,
        personalInfo: {
          ...initialResumeState.personalInfo,
          ...(initialData.personalInfo || {}),
        },
      }));
    }
  }, [initialData]);

  // Debounced Autosave effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!resumeId) return;

    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        await updateResume(resumeId, resume);
        setSaveStatus("saved");
      } catch (err) {
        console.error("Autosave Error:", err);
        setSaveStatus("error");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [resume, resumeId]);

  // General state update helper
  const setResumeState = useCallback((updater) => {
    setResume((prev) => (typeof updater === "function" ? updater(prev) : { ...prev, ...updater }));
  }, []);

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    let score = 0;
    const { personalInfo, summary, education, experience, skills, projects, certifications, languages } = resume;

    if (personalInfo.fullName && personalInfo.email && personalInfo.phone) score += 15;
    if (summary && summary.length > 30) score += 15;
    if (experience && experience.length > 0) score += 20;
    if (education && education.length > 0) score += 15;
    if (skills && skills.length >= 4) score += 15;
    if (projects && projects.length > 0) score += 10;
    if (certifications && certifications.length > 0) score += 5;
    if (languages && languages.length > 0) score += 5;

    return Math.min(score, 100);
  }, [resume]);

  // Section visibility & reorder helpers
  const toggleSectionVisibility = (sectionId) => {
    setResumeState((prev) => {
      const hidden = prev.hiddenSections || [];
      const isHidden = hidden.includes(sectionId);
      return {
        ...prev,
        hiddenSections: isHidden
          ? hidden.filter((id) => id !== sectionId)
          : [...hidden, sectionId],
      };
    });
  };

  const reorderSections = (newOrder) => {
    setResumeState((prev) => ({ ...prev, sectionOrder: newOrder }));
  };

  const setTemplate = (templateName) => {
    setResumeState((prev) => ({ ...prev, template: templateName }));
  };

  const setTitle = (title) => {
    setResumeState((prev) => ({ ...prev, title }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resume,
        setResume: setResumeState,
        activeSection,
        setActiveSection,
        saveStatus,
        setSaveStatus,
        calculateCompletion,
        toggleSectionVisibility,
        reorderSections,
        setTemplate,
        setTitle,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
