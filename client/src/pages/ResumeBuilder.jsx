import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LayoutGrid,
  FileText,
  Sliders,
  Sparkles,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Languages,
  Heart,
  FileCode,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  CheckCircle,
  RefreshCw,
  Copy,
  Trash2,
  Target,
  Mail,
  Phone,
  MapPin,
  Camera,
  UserCheck,
  FileCheck2,
  BookOpen,
  Building2,
  Trophy,
  GripVertical,
  Settings,
  X,
  Check,
  Lightbulb,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/auth/Navbar";
import { ResumeProvider, useResume, initialResumeState } from "../context/ResumeContext";
import { getResumeById, createResume, deleteResume, duplicateResume } from "../services/resumeService";
import { downloadResumePDF } from "../utils/pdfExport";

import ResumePreview from "../components/resume/templates/ResumePreview";
import CustomizePanel from "../components/resume/panels/CustomizePanel";
import AIToolsPanel from "../components/resume/panels/AIToolsPanel";

import PersonalInfoEditor from "../components/resume/editors/PersonalInfoEditor";
import SummaryEditor from "../components/resume/editors/SummaryEditor";
import ExperienceEditor from "../components/resume/editors/ExperienceEditor";
import EducationEditor from "../components/resume/editors/EducationEditor";
import SkillsEditor from "../components/resume/editors/SkillsEditor";
import ProjectsEditor from "../components/resume/editors/ProjectsEditor";
import CertificationsEditor from "../components/resume/editors/CertificationsEditor";
import LanguagesEditor from "../components/resume/editors/LanguagesEditor";
import InterestsEditor from "../components/resume/editors/InterestsEditor";
import CustomSectionEditor from "../components/resume/editors/CustomSectionEditor";
import ReferencesEditor from "../components/resume/editors/ReferencesEditor";
import DeclarationEditor from "../components/resume/editors/DeclarationEditor";
import PublicationsEditor from "../components/resume/editors/PublicationsEditor";
import OrganizationsEditor from "../components/resume/editors/OrganizationsEditor";
import AwardsEditor from "../components/resume/editors/AwardsEditor";

import AddContentModal from "../components/resume/modals/AddContentModal";
import ATSAnalysisModal from "../components/resume/modals/ATSAnalysisModal";
import JobMatchModal from "../components/resume/modals/JobMatchModal";
import TemplateSelector from "../components/resume/modals/TemplateSelector";

const sectionMeta = {
  summary: { label: "Summary", icon: FileText },
  experience: { label: "Professional Experience", icon: Briefcase },
  education: { label: "Education", icon: GraduationCap },
  skills: { label: "Skills", icon: Wrench },
  languages: { label: "Languages", icon: Languages },
  certifications: { label: "Certifications & Licenses", icon: Award },
  awards: { label: "Awards & Honors", icon: Trophy },
  projects: { label: "Projects", icon: FolderGit2 },
  interests: { label: "Interests", icon: Heart },
  references: { label: "References", icon: UserCheck },
  declaration: { label: "Declaration", icon: FileCheck2 },
  publications: { label: "Publications & Research", icon: BookOpen },
  organizations: { label: "Organizations & Volunteering", icon: Building2 },
  custom: { label: "Custom Section", icon: FileCode },
};

const SECTION_TIPS = {
  summary: [
    "Keep your summary between 3-4 impactful sentences.",
    "Highlight total experience, core tech stack, and key career achievements.",
    "Use strong keywords matching target job descriptions for ATS screeners.",
  ],
  experience: [
    "Start each bullet point with a strong action verb (e.g. Spearheaded, Built, Optimized).",
    "Quantify your accomplishments with measurable metrics (e.g., 'reduced latency by 35%').",
    "Focus on high-impact outcomes rather than daily duties.",
  ],
  education: [
    "Include degree title, field of study, school name, and graduation dates.",
    "Add notable honors, relevant capstones, or high GPA (if > 3.5).",
  ],
  skills: [
    "Categorize skills logically (Languages, Frameworks, Cloud, Databases).",
    "List target position key competencies first.",
  ],
  projects: [
    "Describe what you built, tech stack used, and the problem it solved.",
    "Add live project links or GitHub repository URLs.",
  ],
  languages: [
    "Specify your speaking and writing proficiency level clearly.",
  ],
  certifications: [
    "Include recognized industry certifications (AWS, GCP, PMP, Scrum).",
  ],
};

function ResumeBuilderContent({ resumeId }) {
  const navigate = useNavigate();
  const { resume, setResume, activeSection, setActiveSection, saveStatus, setTitle, toggleSectionVisibility } = useResume();

  // track which specific entry is being edited
  const [editingEntry, setEditingEntry] = useState(null);
  const [showModalTips, setShowModalTips] = useState(false);

  // Section heading editing state
  const [editingHeading, setEditingHeading] = useState(null); // secKey or null
  const [sectionHeadings, setSectionHeadings] = useState({});

  // Active navigation tab: 'content' | 'customize' | 'ai'
  const [activeTab, setActiveTab] = useState("content");

  // Modals state
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isATSModalOpen, setIsATSModalOpen] = useState(false);
  const [isJobMatchModalOpen, setIsJobMatchModalOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);

  // Expanded sections state in content editor (accordion: opening one closes others)
  // Starts collapsed by default for clean FlowCV layout
  const [expandedSections, setExpandedSections] = useState({});

  // Top bar dropdown menu open state
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const optionsMenuRef = useRef(null);

  // Mobile active tab ('content', 'preview')
  const [mobileTab, setMobileTab] = useState("content");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSectionExpand = (secKey) => {
    // Single-section accordion: opening one closes all other sections
    setExpandedSections((prev) => (prev[secKey] ? {} : { [secKey]: true }));
    setActiveSection(secKey);
  };

  const handleDuplicate = async () => {
    try {
      const res = await duplicateResume(resumeId);
      if (res.data.success && res.data.resume) {
        toast.success("Resume duplicated!");
        navigate(`/resume/${res.data.resume._id}/edit`);
      }
    } catch (err) {
      toast.error("Failed to duplicate resume");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await deleteResume(resumeId);
      toast.success("Resume deleted");
      navigate("/resumes");
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    await downloadResumePDF("resume-preview-content", resume);
    setIsDownloading(false);
  };

  const renderSectionEditor = (secKey) => {
    switch (secKey) {
      case "personalInfo":
        return <PersonalInfoEditor />;
      case "summary":
        return <SummaryEditor />;
      case "experience":
        return <ExperienceEditor />;
      case "education":
        return <EducationEditor />;
      case "skills":
        return <SkillsEditor />;
      case "projects":
        return <ProjectsEditor />;
      case "certifications":
        return <CertificationsEditor />;
      case "awards":
        return <AwardsEditor />;
      case "languages":
        return <LanguagesEditor />;
      case "interests":
        return <InterestsEditor />;
      case "references":
        return <ReferencesEditor />;
      case "declaration":
        return <DeclarationEditor />;
      case "publications":
        return <PublicationsEditor />;
      case "organizations":
        return <OrganizationsEditor />;
      case "custom":
        return <CustomSectionEditor />;
      default:
        return null;
    }
  };

  const getEntries = (secKey) => {
    if (secKey === "summary") {
      return resume.summary ? [{ id: "summary_0", content: resume.summary }] : [];
    }
    if (secKey === "declaration") {
      return resume.declaration?.statement || resume.declaration?.place || resume.declaration?.signatureName
        ? [{ id: "declaration_0", ...resume.declaration }]
        : [];
    }
    return resume[secKey] || [];
  };

  const getEntryLabel = (secKey, entry, index) => {
    if (secKey === "summary") {
      const text = typeof entry === "string" ? entry : entry.content || resume.summary || "";
      if (!text) return "New Entry";
      return text.length > 60 ? text.substring(0, 60) + "..." : text;
    }
    if (secKey === "declaration") {
      return entry.signatureName ? `Declaration (${entry.signatureName})` : "Declaration Statement";
    }
    if (secKey === "experience")
      return entry.company && entry.jobTitle
        ? `${entry.company}, ${entry.jobTitle}`
        : entry.company || entry.jobTitle || "New Entry";
    if (secKey === "education")
      return entry.institution && entry.degree
        ? `${entry.institution}, ${entry.degree}`
        : entry.institution || entry.degree || "New Entry";
    if (secKey === "skills") return entry.name || "New Skill";
    if (secKey === "languages") return entry.language || "New Language";
    if (secKey === "projects") return entry.title || "New Project";
    if (secKey === "certifications") return entry.name || "New Certification";
    if (secKey === "awards") return entry.title || "New Award";
    if (secKey === "interests") return entry.name || "New Interest";
    if (secKey === "references") return entry.name ? `${entry.name} (${entry.company || "Reference"})` : "New Reference";
    if (secKey === "publications") return entry.title || "New Publication";
    if (secKey === "organizations") return entry.name ? `${entry.name}, ${entry.role || "Volunteer"}` : "New Organization";
    if (secKey === "custom") return entry.title || "New Entry";
    return "New Entry";
  };

  const handleAddEntry = (secKey) => {
    if (secKey === "summary") {
      setEditingEntry({ section: "summary", entryId: "summary_0" });
      return;
    }
    if (secKey === "declaration") {
      setEditingEntry({ section: "declaration", entryId: "declaration_0" });
      return;
    }
    const timestamp = Date.now();
    const newEntries = {
      experience: { id: `exp_${timestamp}`, jobTitle: "", company: "", location: "", startDate: "", endDate: "", currentlyWorking: false, description: "" },
      education: { id: `edu_${timestamp}`, institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", grade: "", description: "" },
      skills: { id: `skill_${timestamp}`, name: "", category: "Technical", level: "Intermediate" },
      languages: { id: `lang_${timestamp}`, language: "", proficiency: "Fluent" },
      projects: { id: `proj_${timestamp}`, title: "", description: "", technologies: "", link: "" },
      certifications: { id: `cert_${timestamp}`, name: "", issuer: "", date: "", link: "" },
      awards: { id: `award_${timestamp}`, title: "", issuer: "", date: "", description: "" },
      interests: { id: `int_${timestamp}`, name: "" },
      references: { id: `ref_${timestamp}`, name: "", relationship: "", company: "", email: "", phone: "" },
      publications: { id: `pub_${timestamp}`, title: "", publisher: "", date: "", link: "", description: "" },
      organizations: { id: `org_${timestamp}`, name: "", role: "", startDate: "", endDate: "", description: "" },
      custom: { id: `custom_${timestamp}`, title: "", content: "" },
    };
    const newEntry = newEntries[secKey];
    if (!newEntry) return;

    setResume((prev) => ({
      ...prev,
      [secKey]: [...(prev[secKey] || []), newEntry],
    }));
    setEditingEntry({ section: secKey, entryId: newEntry.id });
  };

  const handleDeleteEntry = (secKey, entryId) => {
    setResume((prev) => ({
      ...prev,
      [secKey]: (prev[secKey] || []).filter((e) => e.id !== entryId),
    }));
    if (editingEntry?.entryId === entryId) setEditingEntry(null);
  };

  const toggleEntryVisibility = (secKey, entryId) => {
    if (secKey === "summary") {
      toggleSectionVisibility("summary");
      return;
    }
    setResume((prev) => {
      const list = prev[secKey] || [];
      return {
        ...prev,
        [secKey]: list.map((item) =>
          item.id === entryId ? { ...item, hidden: !item.hidden } : item
        ),
      };
    });
  };

  const handleDeleteSection = (secKey) => {
    if (!window.confirm(`Are you sure you want to clear entries from the ${sectionMeta[secKey]?.label || secKey} section?`)) return;
    if (secKey === "summary") {
      setResume((prev) => ({ ...prev, summary: "" }));
      toast.success("Summary cleared");
      return;
    }
    setResume((prev) => ({ ...prev, [secKey]: [] }));
    toast.success(`${sectionMeta[secKey]?.label || secKey} cleared`);
  };

  const order = (resume.sectionOrder || Object.keys(sectionMeta)).filter((key) => key !== "personalInfo");
  const hidden = resume.hiddenSections || [];
  const personalInfo = resume.personalInfo || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <Navbar />

      {/* ── FlowCV Top Navigation Bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-2.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/resumes")}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition cursor-pointer"
              title="Overview / My Resumes"
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Overview</span>
            </button>

            <div className="h-4 w-px bg-gray-200 mx-1" />

            {/* Content Tab */}
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === "content"
                  ? "bg-black text-white shadow-xs"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <FileText size={15} />
              <span>Content</span>
            </button>

            {/* Customize Tab */}
            <button
              onClick={() => setActiveTab("customize")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === "customize"
                  ? "bg-black text-white shadow-xs"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <Sliders size={15} />
              <span>Customize</span>
            </button>

            {/* AI Tools Tab */}
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === "ai"
                  ? "bg-black text-white shadow-xs"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <Sparkles size={15} className={activeTab === "ai" ? "text-amber-400" : "text-amber-500"} />
              <span>AI Tools</span>
            </button>
          </div>

          {/* Right Top Controls */}
          <div className="flex items-center gap-3">
            {/* Save Status Indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 font-medium mr-1">
              {saveStatus === "saving" && (
                <span className="flex items-center gap-1 text-gray-600">
                  <RefreshCw size={13} className="animate-spin" /> Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircle size={13} /> Saved
                </span>
              )}
            </div>

            {/* Resume Title Selector Dropdown / Inline Editor */}
            <div className="relative flex items-center">
              {isTitleEditing ? (
                <input
                  type="text"
                  autoFocus
                  value={resume.title || "My Resume"}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsTitleEditing(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsTitleEditing(false)}
                  className="text-xs font-bold text-gray-900 bg-gray-100 border border-black rounded-xl px-3 py-1.5 outline-none w-36 sm:w-44"
                />
              ) : (
                <button
                  onClick={() => setIsTitleEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl border border-gray-200 transition cursor-pointer"
                >
                  <span className="truncate max-w-[120px]">{resume.title || "Resume 1"}</span>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* ATS Score Button */}
            <button
              onClick={() => setIsATSModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl border border-gray-200 transition cursor-pointer"
              title="Check ATS Compatibility Score"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span className="hidden sm:inline">ATS Score</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-60"
              title="Download Resume as PDF"
            >
              {isDownloading ? (
                <>
                  <span>Exporting...</span>
                  <RefreshCw size={14} className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Download</span>
                  <Download size={14} />
                </>
              )}
            </button>

            {/* Options Three-Dot Menu */}
            <div className="relative" ref={optionsMenuRef}>
              <button
                onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                className="p-2 text-gray-600 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer border border-gray-200"
                title="Options"
              >
                <MoreVertical size={16} />
              </button>

              {isOptionsMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      setIsTitleEditing(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Pencil size={14} />
                    <span>Edit Title</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      handleDuplicate();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Copy size={14} />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      setIsATSModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    <span>ATS Compatibility Score</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      setIsJobMatchModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Target size={14} className="text-gray-700" />
                    <span>Match Job Description</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      navigate(`/resume/${resumeId}/preview`);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Full Page Preview</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      handleDownloadPDF();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </button>
                  <div className="my-1 border-t border-gray-100 mx-3" />
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      handleDelete();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete Resume</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Toggle Bar */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setMobileTab("content")}
          className={`flex-1 py-3 text-xs font-bold ${
            mobileTab === "content" ? "border-b-2 border-black text-black" : "text-gray-500"
          }`}
        >
          Editor View
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-3 text-xs font-bold ${
            mobileTab === "preview" ? "border-b-2 border-black text-black" : "text-gray-500"
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* ── Main Workspace ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* ── Left Column: Active Tab Panel (6 Cols Desktop) ── */}
          <div className={`md:col-span-6 ${mobileTab === "preview" ? "hidden md:block" : "block"}`}>
            {/* CONTENT TAB VIEW */}
            {activeTab === "content" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 1. Personal Information Header Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all">
                  <div className="p-6 relative">
                    <button
                      type="button"
                      onClick={() => toggleSectionExpand("personalInfo")}
                      className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                      title="Edit Personal Information"
                    >
                      <Pencil size={15} />
                    </button>

                    <div className="flex items-start justify-between pr-12">
                      <div className="space-y-1.5">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                          {personalInfo.fullName || "Your Name"}
                        </h2>

                        <div className="flex flex-col gap-1 text-xs text-gray-500 pt-1">
                          {personalInfo.email ? (
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                              <Mail size={14} className="text-gray-400" />
                              <span>{personalInfo.email}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Mail size={14} />
                              <span>Email address</span>
                            </div>
                          )}

                          {personalInfo.phone ? (
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                              <Phone size={14} className="text-gray-400" />
                              <span>{personalInfo.phone}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Phone size={14} />
                              <span>Phone number</span>
                            </div>
                          )}

                          {personalInfo.location ? (
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                              <MapPin size={14} className="text-gray-400" />
                              <span>{personalInfo.location}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-400">
                              <MapPin size={14} />
                              <span>Address / Location</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                        {personalInfo.photo ? (
                          <img
                            src={personalInfo.photo}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Camera size={26} />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedSections.personalInfo && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                      <PersonalInfoEditor onDone={() => setExpandedSections(prev => ({ ...prev, personalInfo: false }))} />
                    </div>
                  )}
                </div>

                {/* 2. Accordion Cards for Content Sections */}
                <div className="space-y-3">
                  {order.map((secKey) => {
                    const meta = sectionMeta[secKey] || { label: secKey, icon: FileCode };
                    const Icon = meta.icon;
                    const isExpanded = expandedSections[secKey];
                    const isHidden = hidden.includes(secKey);
                    const entries = getEntries(secKey);

                    return (
                      <div
                        key={secKey}
                        className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                          isExpanded ? "border-gray-800 border-l-4" : "border-gray-200 hover:border-gray-300"
                        } ${isHidden ? "opacity-60 bg-gray-50" : ""}`}
                      >
                        <div
                          onClick={() => toggleSectionExpand(secKey)}
                          className="p-5 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center shrink-0">
                              <Icon size={18} />
                            </div>
                            <div className="flex items-center gap-2">
                              {editingHeading === secKey ? (
                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    autoFocus
                                    value={sectionHeadings[secKey] ?? meta.label}
                                    onChange={(e) => setSectionHeadings({ ...sectionHeadings, [secKey]: e.target.value })}
                                    onKeyDown={(e) => e.key === "Enter" && setEditingHeading(null)}
                                    className="text-sm font-bold text-gray-900 bg-gray-100 border border-black rounded-lg px-2 py-0.5 outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setEditingHeading(null)}
                                    className="p-1 text-white bg-black hover:bg-gray-800 rounded-md transition cursor-pointer"
                                    title="Save heading"
                                  >
                                    <Check size={13} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <h3 className={`text-base font-bold text-gray-900 ${isHidden ? "line-through text-gray-400" : ""}`}>
                                    {sectionHeadings[secKey] || meta.label}
                                  </h3>
                                  {isExpanded && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingHeading(secKey);
                                      }}
                                      className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                    >
                                      <Pencil size={12} />
                                      <span>Edit Heading</span>
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="p-1.5 text-gray-400 hover:text-black">
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-gray-100">
                            <div className="divide-y divide-gray-100">
                              {entries.map((entry, idx) => {
                                const isEntryHidden = Boolean(entry.hidden) || (secKey === "summary" && hidden.includes("summary"));
                                return (
                                  <div
                                    key={entry.id || idx}
                                    onClick={() => setEditingEntry({ section: secKey, entryId: entry.id || "summary_0", index: idx })}
                                    className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer group ${
                                      isEntryHidden ? "opacity-50 bg-gray-50/50" : ""
                                    }`}
                                  >
                                    <GripVertical size={16} className="text-gray-300 group-hover:text-gray-500 shrink-0 cursor-grab" />
                                    <span className={`flex-1 text-sm ${isEntryHidden ? "text-gray-400 line-through" : "text-gray-700"} truncate`}>
                                      {getEntryLabel(secKey, entry, idx)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleEntryVisibility(secKey, entry.id || "summary_0");
                                      }}
                                      className="p-1 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                      title={isEntryHidden ? "Show entry" : "Hide entry"}
                                    >
                                      {isEntryHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  </div>
                                );
                              })}

                              {/* New Entry row for all sections (matching FlowCV) */}
                              <div
                                onClick={() => handleAddEntry(secKey)}
                                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer group"
                              >
                                <GripVertical size={16} className="text-gray-300 shrink-0" />
                                <span className="flex-1 text-sm text-gray-400 italic">New Entry</span>
                                <div className="p-1 text-gray-300">
                                  <Eye size={16} />
                                </div>
                              </div>
                            </div>

                            {/* Bottom action bar for all sections (matching FlowCV) */}
                            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                              <div className="flex-1 flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleAddEntry(secKey)}
                                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-black border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-xl transition cursor-pointer"
                                >
                                  <Plus size={14} />
                                  <span>Add Entry</span>
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteSection(secKey)}
                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                title="Delete section content"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 3. + Add Content Button */}
                <button
                  type="button"
                  onClick={() => setIsAddContentOpen(true)}
                  className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-black bg-white hover:bg-gray-50 text-gray-700 hover:text-black font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <Plus size={18} />
                  <span>Add Content / Section</span>
                </button>
              </div>
            )}

            {/* CUSTOMIZE TAB VIEW */}
            {activeTab === "customize" && <CustomizePanel />}

            {/* AI TOOLS TAB VIEW */}
            {activeTab === "ai" && <AIToolsPanel />}
          </div>

          {/* ── Right Column: Live Resume Preview (6 Cols Desktop) ── */}
          <div className={`md:col-span-6 ${mobileTab === "content" ? "hidden md:block" : "block"}`}>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </main>

      {/* ── Centered Edit Entry Modal Window (FlowCV Style) ── */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Edit Entry</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalTips((prev) => !prev)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                    showModalTips
                      ? "text-amber-700 bg-amber-50 border-amber-200"
                      : "text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <Sparkles size={13} className="text-amber-500" />
                  <span>{showModalTips ? "Hide Tips" : "Get Tips"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  title="Close window"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {showModalTips && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Lightbulb size={16} className="text-amber-600" />
                    <span>Tips for {sectionMeta[editingEntry.section]?.label || "this section"}</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-800 space-y-1.5 leading-relaxed pl-1">
                    {(SECTION_TIPS[editingEntry.section] || [
                      "Keep description clear and relevant to target positions.",
                    ]).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {renderSectionEditor(editingEntry.section)}
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-3 border-t border-gray-100 bg-white shrink-0 space-y-3">
              <button
                type="button"
                onClick={() => setEditingEntry(null)}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Check size={16} />
                <span>Done</span>
              </button>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition cursor-pointer"
                >
                  <Settings size={13} />
                  <span>Show customizations for this section</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <AddContentModal
        isOpen={isAddContentOpen}
        onClose={() => setIsAddContentOpen(false)}
        onAddSection={(secId) => setExpandedSections({ [secId]: true })}
      />

      <ATSAnalysisModal
        isOpen={isATSModalOpen}
        onClose={() => setIsATSModalOpen(false)}
      />

      <JobMatchModal
        isOpen={isJobMatchModalOpen}
        onClose={() => setIsJobMatchModalOpen(false)}
      />

      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
      />
    </div>
  );
}

export function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id && id !== "new"));
  const [resumeId, setResumeId] = useState(id && id !== "new" ? id : null);

  useEffect(() => {
    if (id === "new") {
      handleCreateNew();
    } else if (id) {
      loadResume(id);
    }
  }, [id]);

  const handleCreateNew = async () => {
    try {
      setLoading(true);
      const res = await createResume({ title: "My Resume", template: "modern" });
      if (res.data.success && res.data.resume) {
        setInitialData(res.data.resume);
        setResumeId(res.data.resume._id);
        navigate(`/resume/${res.data.resume._id}/edit`, { replace: true });
      }
    } catch (err) {
      toast.error("Failed to create resume");
      navigate("/resumes");
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async (resId) => {
    try {
      setLoading(true);
      const res = await getResumeById(resId);
      if (res.data.success && res.data.resume) {
        setInitialData(res.data.resume);
      }
    } catch (err) {
      toast.error("Failed to load resume");
      navigate("/resumes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-black" />
          <p className="text-sm font-medium text-gray-600">Loading Resume Builder Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <ResumeProvider initialData={initialData} resumeId={resumeId}>
      <ResumeBuilderContent resumeId={resumeId} />
    </ResumeProvider>
  );
}

export default ResumeBuilder;
