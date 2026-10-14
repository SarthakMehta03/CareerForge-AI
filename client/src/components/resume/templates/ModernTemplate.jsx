import React from "react";
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from "lucide-react";

function paginateSections(resume, maxPage1Height = 840) {
  const {
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    interests = [],
    customSections = [],
    hiddenSections = [],
    sectionOrder = [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
      "interests",
      "custom",
    ],
  } = resume;

  const isVisible = (sec) => !hiddenSections.includes(sec);

  let currentHeight = 130; // Header height + padding
  const page1 = [];
  const page2 = [];

  const estimates = {
    summary: isVisible("summary") && summary ? 45 + Math.ceil(summary.length / 100) * 16 : 0,
    experience: isVisible("experience") && experience?.length > 0
      ? experience.reduce((acc, exp) => acc + 45 + (exp.description ? Math.ceil(exp.description.length / 85) * 16 : 0), 25)
      : 0,
    education: isVisible("education") && education?.length > 0
      ? education.reduce((acc, edu) => acc + 40, 25)
      : 0,
    skills: isVisible("skills") && skills?.length > 0 ? 50 : 0,
    projects: isVisible("projects") && projects?.length > 0
      ? projects.reduce((acc, proj) => acc + 45 + (proj.description ? Math.ceil(proj.description.length / 85) * 16 : 0), 25)
      : 0,
    certifications: isVisible("certifications") && certifications?.length > 0 ? 35 + certifications.length * 20 : 0,
    languages: isVisible("languages") && languages?.length > 0 ? 35 : 0,
    interests: isVisible("interests") && interests?.length > 0 ? 35 : 0,
    custom: isVisible("custom") && customSections?.length > 0
      ? customSections.reduce((acc, c) => acc + 35 + (c.items || []).length * 30, 0)
      : 0,
  };

  const activeOrder = sectionOrder.filter((key) => key !== "personalInfo" && isVisible(key));

  activeOrder.forEach((secKey) => {
    const h = estimates[secKey] || 0;
    if (h === 0) return;

    if (currentHeight + h <= maxPage1Height || page1.length === 0) {
      page1.push(secKey);
      currentHeight += h;
    } else {
      page2.push(secKey);
    }
  });

  return { page1, page2 };
}

export function ModernTemplate({ resume }) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    interests,
    customSections,
    theme = {},
  } = resume;

  const accentColor = theme.primaryColor || "#000000";
  const fontFamilyClass =
    theme.fontFamily === "serif"
      ? "font-serif"
      : theme.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  const { page1, page2 } = paginateSections(resume, 840);

  // Accent Targets
  const targets = theme.accentTargets || {
    name: true,
    jobTitle: true,
    headings: true,
    headingLine: true,
  };

  const nameColor = targets.name ? accentColor : "#111827";
  const jobTitleColor = targets.jobTitle ? accentColor : "#374151";
  const headingTextColor = targets.headings !== false ? accentColor : "#111827";
  const headingBorderColor = targets.headingLine !== false ? accentColor : "#E5E7EB";

  const headingTransformClass =
    theme.capitalization === "capitalize" ? "capitalize" : "uppercase";

  const headerAlignClass =
    theme.headerAlign === "center" ? "text-center justify-center" : "text-left justify-start";

  const delimiterSymbol =
    theme.headerDelimiter === "bar" ? "|" : theme.headerDelimiter === "icon" ? "" : "•";

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary && theme.showSummaryHeading !== false ? (
          <div key="summary" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              Professional Summary
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{summary}</p>
          </div>
        ) : null;

      case "experience":
        const activeExp = (experience || []).filter((e) => !e.hidden);
        return activeExp.length > 0 ? (
          <div key="experience" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-3.5">
              {activeExp.map((exp) => (
                <div key={exp.id || Math.random()}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-xs">
                      {theme.expTitleOrder === "title_employer"
                        ? `${exp.jobTitle} – ${exp.company}`
                        : `${exp.company}${exp.jobTitle ? ` – ${exp.jobTitle}` : ""}`}
                    </h3>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.location && <div className="text-[11px] font-semibold text-gray-500">{exp.location}</div>}
                  {exp.description && (
                    <div className="text-xs text-gray-600 whitespace-pre-line mt-0.5">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        const activeEdu = (education || []).filter((e) => !e.hidden);
        return activeEdu.length > 0 ? (
          <div key="education" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              Education
            </h2>
            <div className="space-y-2.5">
              {activeEdu.map((edu) => (
                <div key={edu.id || Math.random()}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-xs">
                      {theme.eduTitleOrder === "degree_school"
                        ? `${edu.degree}${edu.institution ? `, ${edu.institution}` : ""}`
                        : `${edu.institution}${edu.degree ? `, ${edu.degree}` : ""}`}
                    </h3>
                    <span className="text-[11px] text-gray-500">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ""}</span>
                  </div>
                  {edu.grade && <p className="text-[11px] font-medium text-gray-600">Grade: {edu.grade}</p>}
                  {edu.description && <p className="text-xs text-gray-600 mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        const activeSkills = (skills || []).filter((s) => !s.hidden);
        return activeSkills.length > 0 ? (
          <div key="skills" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {activeSkills.map((skill) => (
                <span
                  key={skill.id || Math.random()}
                  className="bg-gray-100 border border-gray-200 text-gray-800 px-2.5 py-0.5 rounded text-[11px] font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case "languages":
        const activeLang = (languages || []).filter((l) => !l.hidden);
        return activeLang.length > 0 ? (
          <div key="languages" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              {activeLang.map((lang) => (
                <span key={lang.id || Math.random()} className="text-gray-800">
                  <strong className="text-gray-900">{lang.language}:</strong> {lang.proficiency}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case "awards":
        const activeAwards = (resume.awards || []).filter((a) => !a.hidden);
        return activeAwards.length > 0 ? (
          <div key="awards" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              Awards & Honors
            </h2>
            <div className="space-y-1.5">
              {activeAwards.map((item) => (
                <div key={item.id || Math.random()} className="text-[11px]">
                  <span className="font-bold text-gray-900">{item.title}</span>
                  {item.issuer && <span className="text-gray-600 ml-1">({item.issuer}{item.date ? `, ${item.date}` : ""})</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        const activeProj = (projects || []).filter((p) => !p.hidden);
        return activeProj.length > 0 ? (
          <div key="projects" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              Key Projects
            </h2>
            <div className="space-y-3">
              {activeProj.map((proj) => (
                <div key={proj.id || Math.random()}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-xs">{proj.title}</h3>
                    <span className="text-[11px] text-gray-500">{proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ""}</span>
                  </div>
                  {proj.technologies && (
                    <p className="text-[10px] font-medium text-gray-500 mb-0.5">
                      Technologies: {proj.technologies}
                    </p>
                  )}
                  {proj.description && (
                    <div className="text-xs text-gray-600 whitespace-pre-line">
                      {proj.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        const activeCerts = (certifications || []).filter((c) => !c.hidden);
        return activeCerts.length > 0 ? (
          <div key="certifications" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              Certifications & Licenses
            </h2>
            <div className="space-y-1.5">
              {activeCerts.map((cert) => (
                <div key={cert.id || Math.random()} className="text-[11px]">
                  <span className="font-bold text-gray-900">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-600 ml-1">({cert.issuer}{cert.date ? `, ${cert.date}` : ""})</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "references":
        const activeRefs = (resume.references || []).filter((r) => !r.hidden);
        return activeRefs.length > 0 ? (
          <div key="references" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              References
            </h2>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              {activeRefs.map((ref) => (
                <div key={ref.id || Math.random()}>
                  <p className="font-bold text-gray-900">{ref.name}</p>
                  <p className="text-gray-600">{ref.relationship} {ref.company ? `at ${ref.company}` : ""}</p>
                  {ref.email && <p className="text-gray-500">{ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "declaration":
        const dec = resume.declaration;
        return dec && (dec.statement || dec.signatureName) ? (
          <div key="declaration" className="mb-5">
            {theme.showDeclarationHeading !== false && (
              <h2
                className={`text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
                style={{ color: headingTextColor, borderColor: headingBorderColor }}
              >
                Declaration
              </h2>
            )}
            <p className="text-xs text-gray-700 italic">{dec.statement}</p>
            <div className={`mt-3 flex justify-between text-xs text-gray-800 ${theme.declarationPosition === "left" ? "flex-row-reverse" : "flex-row"}`}>
              <div>
                {dec.place && <p>Place: {dec.place}</p>}
                {dec.date && <p>Date: {dec.date}</p>}
              </div>
              <div className="text-right">
                {theme.signatureLine !== "none" && <div className="w-32 border-b border-gray-400 mb-1 ml-auto" />}
                <p className="font-bold">{dec.signatureName}</p>
              </div>
            </div>
          </div>
        ) : null;

      case "interests":
        const activeInt = (interests || []).filter((i) => !i.hidden);
        return activeInt.length > 0 ? (
          <div key="interests" className="mb-5">
            <h2
              className={`text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
              style={{ color: headingTextColor, borderColor: headingBorderColor }}
            >
              Interests & Hobbies
            </h2>
            <p className="text-[11px] text-gray-700">{activeInt.map((i) => i.name || i).join(" • ")}</p>
          </div>
        ) : null;

      case "custom":
        return customSections && customSections.length > 0 ? (
          <div key="custom" className="space-y-3">
            {customSections.map((cSec) => (
              <div key={cSec.id} className="mb-4">
                <h2
                  className={`text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
                  style={{ color: headingTextColor, borderColor: headingBorderColor }}
                >
                  {cSec.title}
                </h2>
                <div className="space-y-2">
                  {(cSec.items || []).map((item) => (
                    <div key={item.id} className="text-[11px]">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>{item.title}</span>
                        <span className="text-gray-500 font-normal">{item.date}</span>
                      </div>
                      {item.subtitle && <p className="text-gray-700 font-medium">{item.subtitle}</p>}
                      {item.description && <p className="text-gray-600 mt-0.5">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${fontFamilyClass}`}>
      {/* ── PAGE 1 (Standard A4 Sheet 1) ── */}
      <div className="w-full bg-white text-gray-900 rounded-2xl shadow-sm border border-gray-200/80 p-8 sm:p-10 min-h-[1050px] text-[13px] leading-relaxed relative flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className={`pb-4 mb-5 ${headerAlignClass}`} style={{ borderBottom: `2px solid ${headingBorderColor}` }}>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight" style={{ color: nameColor }}>
              {personalInfo?.fullName || "Your Name"}
            </h1>
            {personalInfo?.jobTitle ? (
              <p className="text-sm font-semibold mt-0.5 uppercase tracking-wide" style={{ color: jobTitleColor }}>
                {personalInfo.jobTitle}
              </p>
            ) : null}

            <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-xs text-gray-600 ${headerAlignClass}`}>
              {personalInfo?.email && (
                <span className="flex items-center gap-1">
                  <Mail size={12} style={{ color: accentColor }} />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo?.phone && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <Phone size={12} style={{ color: accentColor }} />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo?.location && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <MapPin size={12} style={{ color: accentColor }} />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo?.linkedin && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <LinkIcon size={12} style={{ color: accentColor }} />
                  {personalInfo.linkedin}
                </span>
              )}
              {personalInfo?.github && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <LinkIcon size={12} style={{ color: accentColor }} />
                  {personalInfo.github}
                </span>
              )}
              {personalInfo?.portfolio && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <Globe size={12} style={{ color: accentColor }} />
                  {personalInfo.portfolio}
                </span>
              )}
            </div>
          </div>

          {/* Render Page 1 Sections */}
          {page1.map((secKey) => renderSection(secKey))}
        </div>
      </div>

      {/* ── PAGE 2 (Standard A4 Sheet 2 - Appears ONLY when Page 1 is full) ── */}
      {page2.length > 0 && (
        <div className="w-full bg-white text-gray-900 rounded-2xl shadow-sm border border-gray-200/80 p-8 sm:p-10 min-h-[1050px] text-[13px] leading-relaxed relative flex flex-col justify-between mt-6">
          <div>
            {page2.map((secKey) => renderSection(secKey))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModernTemplate;
