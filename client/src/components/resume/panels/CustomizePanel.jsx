import React, { useState } from "react";
import {
  Check,
  Palette,
  Type,
  Layout,
  Sliders,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Trophy,
  FolderGit2,
  Heart,
  UserCheck,
  FileCheck2,
  BookOpen,
  Building2,
  FileCode,
  User,
  FileText,
  Camera,
  Link2,
} from "lucide-react";
import { useResume } from "../../../context/ResumeContext";

const subNavItems = [
  { id: "document", label: "Document" },
  { id: "templates", label: "Templates" },
  { id: "layout", label: "Layout" },
  { id: "fontSize", label: "Font Size" },
  { id: "spacing", label: "Spacing" },
  { id: "entries", label: "Entries" },
  { id: "headings", label: "Headings" },
  { id: "font", label: "Font" },
  { id: "colors", label: "Colors" },
  { id: "header", label: "Header" },
  { id: "photo", label: "Photo" },
  { id: "links", label: "Links" },
  { id: "footer", label: "Footer" },
  { id: "sections", label: "Sections" },
];

const templates = [
  { id: "modern", name: "Modern", desc: "Clean, dark headers, structured sidebar layout. Great for Tech & Design.", tag: "Popular" },
  { id: "classic", name: "Classic", desc: "Traditional serif typography. Ideal for Finance, Law & Academia.", tag: "Traditional" },
  { id: "minimal", name: "Minimal", desc: "Ultra-sleek single column layout with generous white space.", tag: "Clean" },
  { id: "professional", name: "Professional", desc: "Executive header with competencies grid. Perfect for Management.", tag: "Executive" },
];

const fontsList = [
  "Source Serif Pro",
  "Inter (Sans-Serif)",
  "Roboto",
  "Garamond (Serif)",
  "Fira Code (Monospace)",
  "Open Sans",
  "Lato",
  "Playfair Display",
  "Montserrat",
];

const colorPalettes = [
  { id: "#000000", bg: "bg-black" },
  { id: "#334155", bg: "bg-slate-700" },
  { id: "#0f766e", bg: "bg-teal-700" },
  { id: "#0284c7", bg: "bg-sky-600" },
  { id: "#1d4ed8", bg: "bg-blue-700" },
  { id: "#4338ca", bg: "bg-indigo-700" },
  { id: "#6b21a8", bg: "bg-purple-800" },
  { id: "#be185d", bg: "bg-pink-700" },
  { id: "#b91c1c", bg: "bg-red-700" },
  { id: "#c2410c", bg: "bg-orange-700" },
  { id: "#15803d", bg: "bg-green-700" },
];

const sectionIcons = {
  personalInfo: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  languages: Languages,
  awards: Trophy,
  projects: FolderGit2,
  interests: Heart,
  references: UserCheck,
  declaration: FileCheck2,
  publications: BookOpen,
  organizations: Building2,
  custom: FileCode,
};

const sectionLabels = {
  personalInfo: "Personal Details",
  summary: "Professional Summary",
  experience: "Professional Experience",
  education: "Education",
  skills: "Skills",
  languages: "Languages",
  awards: "Awards & Honors",
  projects: "Projects",
  interests: "Interests",
  references: "References",
  declaration: "Declaration",
  publications: "Publications",
  organizations: "Organizations",
  custom: "Custom Sections",
};

export function CustomizePanel() {
  const { resume, setResume, setTemplate, reorderSections, toggleSectionVisibility } = useResume();
  const [activeSubNav, setActiveSubNav] = useState("document");
  const [isSectionCustomizationsOpen, setIsSectionCustomizationsOpen] = useState(true);

  const order = resume.sectionOrder || [
    "personalInfo",
    "summary",
    "experience",
    "education",
    "skills",
    "languages",
    "awards",
    "projects",
    "interests",
    "references",
    "declaration",
    "publications",
    "custom",
  ];
  const hidden = resume.hiddenSections || [];

  const theme = resume.theme || {
    language: "English (UK)",
    dateFormat: "DD/MM/YYYY",
    pageFormat: "A4",
    columns: "one",
    baseFontSize: 9.5,
    nameFontSize: 14,
    headingFontSize: 2,
    entryHeaderSize: 0,
    lineHeight: 1.35,
    spacing: 3,
    marginHorizontal: 18,
    marginVertical: 18,
    entryStructure: "full",
    datePosition: "right",
    headerSplit: "auto",
    headingStyle: "line-bottom",
    capitalization: "uppercase",
    headingIcons: "none",
    bodyFont: "Source Serif Pro",
    nameFont: "Same as body font",
    primaryColor: "#000000",
    colorMode: "full",
    headerAlign: "center",
    headerDelimiter: "bullet",
    linkUnderline: false,
    linkBlue: false,
    linkIcon: true,
    footerPageNumbers: false,
    footerEmail: false,
    footerName: false,
    expTitleOrder: "employer_title",
    eduTitleOrder: "school_degree",
    skillStyle: "pipe",
    skillSubinfoStyle: "bracket",
    accentTargets: {
      name: true,
      jobTitle: true,
      headings: true,
      headingLine: true,
      headerIcons: false,
      dots: false,
      dates: false,
      entryTitle: false,
      entrySubtitle: false,
      linkIcons: false,
    },
  };

  const updateTheme = (key, val) => {
    setResume((prev) => ({
      ...prev,
      theme: {
        ...(prev.theme || {}),
        [key]: val,
      },
    }));
  };

  const updateThemeNum = (key, delta, min = 0, max = 50, step = 0.5) => {
    const current = (theme[key] !== undefined ? theme[key] : min);
    const next = Math.min(max, Math.max(min, Number((current + delta).toFixed(2))));
    updateTheme(key, next);
  };

  const toggleAccentTarget = (targetKey) => {
    setResume((prev) => {
      const curTargets = prev.theme?.accentTargets || {};
      return {
        ...prev,
        theme: {
          ...(prev.theme || {}),
          accentTargets: {
            ...curTargets,
            [targetKey]: !curTargets[targetKey],
          },
        },
      };
    });
  };

  const handleMove = (index, direction) => {
    const newOrder = [...order];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex <= 0 || targetIndex >= newOrder.length) return;

    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    reorderSections(newOrder);
  };

  const scrollToSection = (secId) => {
    setActiveSubNav(secId);
    const elem = document.getElementById(`customize-sec-${secId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex items-start gap-4 animate-in fade-in duration-200">
      {/* ── FlowCV Left Vertical Sub-Navigation Sidebar ── */}
      <div className="w-36 shrink-0 bg-white border border-gray-200 rounded-2xl p-3 shadow-xs sticky top-20 space-y-1 text-xs">
        {subNavItems.map((item) => {
          const isActive = activeSubNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center justify-between ${
                isActive
                  ? "bg-black text-white shadow-xs font-bold"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <span>{item.label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          );
        })}
      </div>

      {/* ── Main Customization Cards Column ── */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* 1. Document Settings Card */}
        <div id="customize-sec-document" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Document Settings</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Language</label>
              <select
                value={theme.language || "English (UK)"}
                onChange={(e) => updateTheme("language", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                <option value="English (UK)">English (UK)</option>
                <option value="English (US)">English (US)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
                <option value="Gujarati">Gujarati</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Date Format</label>
              <select
                value={theme.dateFormat || "DD/MM/YYYY"}
                onChange={(e) => updateTheme("dateFormat", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="Month YYYY">Month YYYY (e.g. May 2024)</option>
                <option value="MMM YYYY">MMM YYYY (e.g. 05/2024)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Page Format</label>
              <select
                value={theme.pageFormat || "A4"}
                onChange={(e) => updateTheme("pageFormat", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                <option value="A4">A4 (Standard 210 × 297 mm)</option>
                <option value="US Letter">US Letter (8.5 × 11 in)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Design Templates Card */}
        <div id="customize-sec-templates" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Design Templates</h2>
            <p className="text-xs text-gray-500 mt-0.5">Update your entire resume design with one click.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {templates.map((tpl) => {
              const isSelected = resume.template === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setTemplate(tpl.id)}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-black bg-gray-50 shadow-xs"
                      : "border-gray-200 hover:border-gray-400 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{tpl.tag}</span>
                      {isSelected && (
                        <span className="bg-black text-white p-0.5 rounded-full">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{tpl.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{tpl.desc}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 text-xs font-bold flex items-center justify-between">
                    <span className={isSelected ? "text-black" : "text-gray-400"}>
                      {isSelected ? "Active Template" : "Apply Template"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Layout Options Card (FlowCV Style) */}
        <div id="customize-sec-layout" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Layout</h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2.5">Columns</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => updateTheme("columns", "one")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
                  (theme.columns || "one") === "one"
                    ? "border-black bg-gray-50 ring-1 ring-black"
                    : "border-gray-200 hover:border-gray-400 bg-white"
                }`}
              >
                <div className="w-8 h-6 bg-gray-200 rounded flex flex-col gap-1 p-1">
                  <div className="w-full h-1 bg-black rounded-xs" />
                  <div className="w-full h-1 bg-gray-500 rounded-xs" />
                  <div className="w-full h-1 bg-gray-500 rounded-xs" />
                </div>
                <span className="text-xs font-semibold text-gray-800">One</span>
              </button>

              <button
                type="button"
                onClick={() => updateTheme("columns", "two")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
                  theme.columns === "two"
                    ? "border-black bg-gray-50 ring-1 ring-black"
                    : "border-gray-200 hover:border-gray-400 bg-white"
                }`}
              >
                <div className="w-8 h-6 bg-gray-200 rounded flex gap-1 p-1">
                  <div className="w-2.5 h-full bg-black rounded-xs" />
                  <div className="flex-1 h-full bg-gray-500 rounded-xs" />
                </div>
                <span className="text-xs font-semibold text-gray-800">Two</span>
              </button>

              <button
                type="button"
                onClick={() => updateTheme("columns", "mix")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
                  theme.columns === "mix"
                    ? "border-black bg-gray-50 ring-1 ring-black"
                    : "border-gray-200 hover:border-gray-400 bg-white"
                }`}
              >
                <div className="w-8 h-6 bg-gray-200 rounded flex flex-col justify-between p-1">
                  <div className="w-full h-1.5 bg-black rounded-xs" />
                  <div className="flex gap-1 h-2">
                    <div className="w-2 h-full bg-gray-500 rounded-xs" />
                    <div className="flex-1 h-full bg-gray-500 rounded-xs" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-800">Mix</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2.5">Change Section Layout Order</label>
            <div className="space-y-2">
              <div className="bg-gray-100/70 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 flex items-center justify-center gap-2">
                <User size={15} />
                <span>Personal Details</span>
              </div>

              {order
                .filter((key) => key !== "personalInfo")
                .map((secKey, idx) => {
                  const Icon = sectionIcons[secKey] || FileText;
                  const isHidden = hidden.includes(secKey);
                  const realIndex = order.indexOf(secKey);

                  return (
                    <div
                      key={secKey}
                      className={`flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold ${
                        isHidden ? "opacity-40 line-through" : "text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <GripVertical size={16} className="text-gray-300 cursor-grab" />
                        <Icon size={15} className="text-gray-700 shrink-0" />
                        <span>{sectionLabels[secKey] || secKey}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(secKey)}
                          className="p-1 text-gray-400 hover:text-black rounded"
                          title={isHidden ? "Show Section" : "Hide Section"}
                        >
                          {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMove(realIndex, "up")}
                          disabled={realIndex <= 1}
                          className="p-1 text-gray-400 hover:text-black rounded disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMove(realIndex, "down")}
                          disabled={realIndex >= order.length - 1}
                          className="p-1 text-gray-400 hover:text-black rounded disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* 4. Font Size Card (FlowCV Steppers) */}
        <div id="customize-sec-fontSize" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Font Size</h2>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="block text-xs font-bold text-gray-900">Base Font Size</span>
                <span className="text-[11px] text-gray-500 font-mono">{(theme.baseFontSize || 9.5)}pt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("baseFontSize", -0.5, 7, 14, 0.5)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("baseFontSize", 0.5, 7, 14, 0.5)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="block text-xs font-bold text-gray-900">Full Name</span>
                <span className="text-[11px] text-gray-500 font-mono">+{(theme.nameFontSize || 14)}pt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("nameFontSize", -1, 8, 24, 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("nameFontSize", 1, 8, 24, 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="block text-xs font-bold text-gray-900">Section Headings</span>
                <span className="text-[11px] text-gray-500 font-mono">+{(theme.headingFontSize || 2)}pt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("headingFontSize", -0.5, 0, 10, 0.5)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("headingFontSize", 0.5, 0, 10, 0.5)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-900">Entry Header</span>
                <span className="text-[11px] text-gray-500 font-mono">+{(theme.entryHeaderSize || 0)}pt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("entryHeaderSize", -0.5, 0, 8, 0.5)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("entryHeaderSize", 0.5, 0, 8, 0.5)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Spacing Card */}
        <div id="customize-sec-spacing" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Spacing</h2>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="block text-xs font-bold text-gray-900">Line Height</span>
                <span className="text-[11px] text-gray-500 font-mono">{(theme.lineHeight || 1.35)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("lineHeight", -0.05, 1.0, 2.0, 0.05)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("lineHeight", 0.05, 1.0, 2.0, 0.05)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="block text-xs font-bold text-gray-900">Space Between Elements</span>
                <span className="text-[11px] text-gray-500 font-mono">{(theme.spacing || 3)}px</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("spacing", -1, 0, 10, 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("spacing", 1, 0, 10, 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="block text-xs font-bold text-gray-900">Left & Right Margin</span>
                <span className="text-[11px] text-gray-500 font-mono">{(theme.marginHorizontal || 18)}mm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("marginHorizontal", -2, 8, 30, 2)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("marginHorizontal", 2, 8, 30, 2)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-900">Top & Bottom Margin</span>
                <span className="text-[11px] text-gray-500 font-mono">{(theme.marginVertical || 18)}mm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("marginVertical", -2, 8, 30, 2)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("marginVertical", 2, 8, 30, 2)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Entry Layout Card */}
        <div id="customize-sec-entries" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Entry Layout</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Structure</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateTheme("entryStructure", "full")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                    (theme.entryStructure || "full") === "full"
                      ? "border-black bg-gray-50 ring-1 ring-black font-bold"
                      : "border-gray-200 hover:border-gray-400 bg-white"
                  }`}
                >
                  <span className="text-xs text-gray-900">Full Width</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("entryStructure", "columns")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                    theme.entryStructure === "columns"
                      ? "border-black bg-gray-50 ring-1 ring-black font-bold"
                      : "border-gray-200 hover:border-gray-400 bg-white"
                  }`}
                >
                  <span className="text-xs text-gray-900">Columns</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Date & Location Position</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateTheme("datePosition", "right")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    (theme.datePosition || "right") === "right"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Right
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("datePosition", "below")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    theme.datePosition === "below"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Below Title
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Section Headings Card */}
        <div id="customize-sec-headings" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Section Headings</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Capitalization</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateTheme("capitalization", "capitalize")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    theme.capitalization === "capitalize"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Capitalize
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("capitalization", "uppercase")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    (theme.capitalization || "uppercase") === "uppercase"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  UPPERCASE
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Heading Icons</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateTheme("headingIcons", "none")}
                  className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    (theme.headingIcons || "none") === "none"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  None
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headingIcons", "outline")}
                  className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    theme.headingIcons === "outline"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Outline
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headingIcons", "filled")}
                  className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    theme.headingIcons === "filled"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Filled
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Font Card */}
        <div id="customize-sec-font" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Font</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Body Font</label>
              <select
                value={theme.bodyFont || "Source Serif Pro"}
                onChange={(e) => updateTheme("bodyFont", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                {fontsList.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Name Font</label>
              <select
                value={theme.nameFont || "Same as body font"}
                onChange={(e) => updateTheme("nameFont", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                <option value="Same as body font">Same as body font</option>
                {fontsList.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 9. Colors Card (FlowCV Target Checkboxes) */}
        <div id="customize-sec-colors" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Colors</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2.5">Accent Color Palette</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {colorPalettes.map((c) => {
                  const isSelected = (theme.primaryColor || "#000000") === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateTheme("primaryColor", c.id)}
                      className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center transition cursor-pointer shadow-xs ${
                        isSelected ? "ring-2 ring-black ring-offset-2 scale-105" : "hover:scale-105"
                      }`}
                    >
                      {isSelected && <Check size={16} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-2.5">Apply Accent Color To</label>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                {[
                  { key: "name", label: "Name" },
                  { key: "jobTitle", label: "Job title" },
                  { key: "headings", label: "Headings" },
                  { key: "headingLine", label: "Headings line" },
                  { key: "headerIcons", label: "Header icons" },
                  { key: "dots", label: "Dots/bars/bubbles" },
                  { key: "dates", label: "Dates" },
                  { key: "entryTitle", label: "Entry title" },
                ].map((tgt) => {
                  const checked = Boolean(theme.accentTargets?.[tgt.key]);
                  return (
                    <label key={tgt.key} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAccentTarget(tgt.key)}
                        className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                      />
                      <span>{tgt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 10. Header Card */}
        <div id="customize-sec-header" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Header Alignment & Delimiters</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Text Alignment</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateTheme("headerAlign", "left")}
                  className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    theme.headerAlign === "left"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headerAlign", "center")}
                  className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    (theme.headerAlign || "center") === "center"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Center
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Contact Delimiter</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateTheme("headerDelimiter", "bullet")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    (theme.headerDelimiter || "bullet") === "bullet"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  • Bullet
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headerDelimiter", "bar")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    theme.headerDelimiter === "bar"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  | Bar
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headerDelimiter", "icon")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    theme.headerDelimiter === "icon"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Icon
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 11. Photo Card */}
        <div id="customize-sec-photo" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-2">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Photo</h2>
          <p className="text-xs text-gray-500">
            Photo design options will appear here once you upload a photo in <span className="font-bold text-gray-900">Content → Personal Details 📷</span>
          </p>
        </div>

        {/* 12. Links Card */}
        <div id="customize-sec-links" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Link Styling</h2>

          <div className="space-y-2 text-xs text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.linkUnderline)}
                onChange={(e) => updateTheme("linkUnderline", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Underline links</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.linkBlue)}
                onChange={(e) => updateTheme("linkBlue", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Blue link color</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={theme.linkIcon !== false}
                onChange={(e) => updateTheme("linkIcon", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Display link icon</span>
            </label>
          </div>
        </div>

        {/* 13. Footer Card */}
        <div id="customize-sec-footer" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Footer</h2>

          <div className="space-y-2 text-xs text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.footerPageNumbers)}
                onChange={(e) => updateTheme("footerPageNumbers", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Page numbers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.footerEmail)}
                onChange={(e) => updateTheme("footerEmail", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Email in footer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.footerName)}
                onChange={(e) => updateTheme("footerName", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Name in footer</span>
            </label>
          </div>
        </div>

        {/* 14. Section Customizations Collapsible Accordion */}
        <div id="customize-sec-sections" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div
            onClick={() => setIsSectionCustomizationsOpen((prev) => !prev)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Section Customizations</h2>
            <div className="p-1 text-gray-400 hover:text-black">
              {isSectionCustomizationsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          {isSectionCustomizationsOpen && (
            <div className="space-y-6 pt-2 border-t border-gray-100">
              {/* Summary Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-gray-900">Summary</h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(theme.summaryInHeader)}
                      onChange={(e) => updateTheme("summaryInHeader", e.target.checked)}
                      className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    />
                    <span>Display summary as part of header</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={theme.showSummaryHeading !== false}
                      onChange={(e) => updateTheme("showSummaryHeading", e.target.checked)}
                      className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    />
                    <span>Show summary heading</span>
                  </label>
                </div>
              </div>

              {/* Work Experience Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Work Experience</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Title / Subtitle Order</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateTheme("expTitleOrder", "title_employer")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.expTitleOrder === "title_employer"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Job Title – Employer
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("expTitleOrder", "employer_title")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        (theme.expTitleOrder || "employer_title") === "employer_title"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Employer – Job Title
                    </button>
                  </div>
                </div>
              </div>

              {/* Education Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Education</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Title & Subtitle Order</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateTheme("eduTitleOrder", "degree_school")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.eduTitleOrder === "degree_school"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Degree, School
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("eduTitleOrder", "school_degree")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        (theme.eduTitleOrder || "school_degree") === "school_degree"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      School, Degree
                    </button>
                  </div>
                </div>
              </div>

              {/* Skills Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Skills</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Display Layout</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {["grid", "rows", "compact", "bubble", "level"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateTheme("skillStyle", st)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.skillStyle || "compact") === st
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Delimiter Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["bullet", "pipe", "comma"].map((del) => (
                      <button
                        key={del}
                        type="button"
                        onClick={() => updateTheme("skillDelimiter", del)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.skillDelimiter || "pipe") === del
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {del}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Subinfo Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "colon", label: ": Colon" },
                      { id: "dash", label: "– Dash" },
                      { id: "bracket", label: "() Bracket" },
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => updateTheme("skillSubinfo", sub.id)}
                        className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                          (theme.skillSubinfo || "bracket") === sub.id
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Languages Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Languages</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Display Layout</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {["grid", "rows", "compact", "bubble", "level"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateTheme("langStyle", st)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.langStyle || "compact") === st
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Delimiter Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["bullet", "pipe", "comma"].map((del) => (
                      <button
                        key={del}
                        type="button"
                        onClick={() => updateTheme("langDelimiter", del)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.langDelimiter || "pipe") === del
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {del}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certificates Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Certificates & Licenses</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Display Layout</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["grid", "rows", "compact", "bubble"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateTheme("certStyle", st)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.certStyle || "compact") === st
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Delimiter Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["bullet", "pipe", "comma"].map((del) => (
                      <button
                        key={del}
                        type="button"
                        onClick={() => updateTheme("certDelimiter", del)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.certDelimiter || "pipe") === del
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {del}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Subinfo Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "colon", label: ": Colon" },
                      { id: "dash", label: "– Dash" },
                      { id: "bracket", label: "() Bracket" },
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => updateTheme("certSubinfo", sub.id)}
                        className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                          (theme.certSubinfo || "bracket") === sub.id
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interests Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Interests</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Display Layout</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["grid", "rows", "compact", "bubble"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateTheme("interestStyle", st)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.interestStyle || "compact") === st
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Declaration Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Declaration</h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800 select-none">
                  <input
                    type="checkbox"
                    checked={theme.showDeclarationHeading !== false}
                    onChange={(e) => updateTheme("showDeclarationHeading", e.target.checked)}
                    className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span>Show section heading</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateTheme("declarationPosition", "left")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.declarationPosition === "left"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("declarationPosition", "right")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        (theme.declarationPosition || "right") === "right"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Right
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Signature Line</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateTheme("signatureLine", "none")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.signatureLine === "none"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      None
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("signatureLine", "solid")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        (theme.signatureLine || "solid") === "solid"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Solid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomizePanel;
