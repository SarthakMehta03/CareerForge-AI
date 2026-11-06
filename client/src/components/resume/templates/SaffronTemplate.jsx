import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Link as LinkIcon,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Award,
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import SkillsRenderer from "../SkillsRenderer";

/**
 * FlowCV Template: Saffron Line & Quicksilver
 * Features an asymmetric 35/65 dual-column layout with warm saffron or silver accent lines.
 */
export function SaffronTemplate({ resume, highlightKeywords = [], variant = "saffron" }) {
  const {
    personalInfo = {},
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    interests = [],
    awards = [],
    references = [],
    declaration = {},
    publications = [],
    organizations = [],
    customSections = [],
    hiddenSections = [],
    theme = {},
    minPageHeight = 1123,
  } = resume;

  const isQuicksilver = variant === "quicksilver" || resume.template === "quicksilver";
  const accentColor = theme.primaryColor && theme.primaryColor !== "#000000"
    ? theme.primaryColor
    : isQuicksilver
    ? "#475569" // Quicksilver slate
    : "#D97706"; // Saffron Amber-600

  const sidebarBg = isQuicksilver ? "#F8FAFC" : "transparent";

  const fontFamilyClass =
    theme.fontFamily === "serif"
      ? "font-serif"
      : theme.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  const isVisible = (sec) => !hiddenSections.includes(sec);
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;
  const styles = getThemeSpacingStyles(theme);

  const activeExp = experience.filter((e) => !e.hidden);
  const activeEdu = education.filter((e) => !e.hidden);
  const activeSkills = skills.filter((s) => !s.hidden);
  const activeProjects = projects.filter((p) => !p.hidden);
  const activeCerts = certifications.filter((c) => !c.hidden);
  const activeLangs = languages.filter((l) => !l.hidden);
  const activeAwards = (awards || []).filter((a) => !a.hidden);
  const activeInterests = (interests || []).filter((i) => typeof i === "object" ? !i.hidden : true);
  const activeRefs = (references || []).filter((r) => !r.hidden);
  const activePubs = (publications || []).filter((p) => !p.hidden);
  const activeOrgs = (organizations || []).filter((o) => !o.hidden);

  return (
    <div
      className={`w-full bg-white p-8 sm:p-10 flex flex-col ${fontFamilyClass} ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 overflow-hidden`}
      style={{ minHeight: `${minPageHeight}px` }}
    >
      {/* ── HEADER ── */}
      <div className="flex items-center gap-6 pb-6 border-b-2 mb-6" style={{ borderColor: accentColor }}>
        {personalInfo.photo && (
          <div className="shrink-0">
            <PhotoDisplay
              photo={personalInfo.photo}
              photoSettings={resume.photoSettings}
              primaryColor={accentColor}
            />
          </div>
        )}

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="text-2xl font-serif font-black text-gray-900 tracking-tight">
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.jobTitle && (
              <span className="text-sm font-medium text-gray-600">
                {personalInfo.jobTitle}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} style={{ color: accentColor }} />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} style={{ color: accentColor }} />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} style={{ color: accentColor }} />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <LinkIcon size={12} style={{ color: accentColor }} />
                {personalInfo.linkedin}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── ASYMMETRIC DUAL-COLUMN BODY (35% Left / 65% Right) ── */}
      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Column (35% width) */}
        <div className={`col-span-4 space-y-6 ${isQuicksilver ? "p-4 rounded-xl" : "pr-2"}`} style={{ backgroundColor: sidebarBg }}>
          {/* Summary */}
          {summary && isVisible("summary") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Summary
              </h2>
              <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-line">{H(summary)}</p>
            </div>
          )}

          {/* Skills */}
          {activeSkills.length > 0 && isVisible("skills") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Skills
              </h2>
              <SkillsRenderer skills={activeSkills} theme={{ ...theme, primaryColor: accentColor }} highlightKeywords={highlightKeywords} />
            </div>
          )}

          {/* Languages */}
          {activeLangs.length > 0 && isVisible("languages") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Languages
              </h2>
              <div className="space-y-1.5">
                {activeLangs.map((lang) => (
                  <div key={lang.id || Math.random()} className="text-[11px] flex justify-between">
                    <span className="font-semibold text-gray-800">{H(lang.language)}</span>
                    <span className="text-gray-500">{lang.proficiency || "Fluent"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {activeCerts.length > 0 && isVisible("certifications") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Certificates
              </h2>
              <div className="space-y-2">
                {activeCerts.map((cert) => (
                  <div key={cert.id || Math.random()} className="text-[11px]">
                    <p className="font-bold text-gray-900 leading-snug">{H(cert.name)}</p>
                    {cert.issuer && <p className="text-[10px] text-gray-500">{H(cert.issuer)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {activeInterests.length > 0 && isVisible("interests") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Interests
              </h2>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                {activeInterests.map((i, idx) => (
                  <React.Fragment key={idx}>{idx > 0 && " • "}{H(typeof i === "object" ? i.name : i)}</React.Fragment>
                ))}
              </p>
            </div>
          )}

          {/* Awards */}
          {activeAwards.length > 0 && isVisible("awards") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Awards
              </h2>
              <div className="space-y-2">
                {activeAwards.map((award) => (
                  <div key={award.id || Math.random()} className="text-[11px]">
                    <p className="font-bold text-gray-900 leading-snug">{H(award.title)}</p>
                    {award.issuer && <p className="text-[10px] text-gray-500">{H(award.issuer)}{award.date ? ` • ${award.date}` : ""}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {activeRefs.length > 0 && isVisible("references") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                References
              </h2>
              <div className="space-y-2">
                {activeRefs.map((ref) => (
                  <div key={ref.id || Math.random()} className="text-[11px]">
                    <p className="font-bold text-gray-900">{H(ref.name)}</p>
                    {ref.relationship && <p className="text-[10px] text-gray-500">{ref.relationship}</p>}
                    {ref.company && <p className="text-[10px] text-gray-600">{ref.company}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (65% width) */}
        <div className="col-span-8 space-y-6">
          {/* Professional Experience */}
          {activeExp.length > 0 && isVisible("experience") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b flex items-center gap-1.5"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                <Briefcase size={13} />
                <span>Professional Experience</span>
              </h2>

              <div className="space-y-4">
                {activeExp.map((exp) => (
                  <div key={exp.id || Math.random()} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span className="text-[12px]">{exp.jobTitle}</span>
                      <span className="text-[11px] text-gray-400 font-semibold">
                        {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                      {exp.company}{exp.location ? ` | ${exp.location}` : ""}
                    </p>
                    {exp.description && (
                      <div className="text-gray-600 text-xs whitespace-pre-line mt-1.5 leading-relaxed">
                        {H(exp.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {activeEdu.length > 0 && isVisible("education") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b flex items-center gap-1.5"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                <GraduationCap size={13} />
                <span>Education</span>
              </h2>

              <div className="space-y-3">
                {activeEdu.map((edu) => (
                  <div key={edu.id || Math.random()} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{edu.degree || "Degree"}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</span>
                      <span className="text-[11px] text-gray-400 font-semibold">
                        {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium text-[11px] mt-0.5">
                      {edu.institution} {edu.grade ? `• Grade: ${edu.grade}` : ""}
                    </p>
                    {edu.description && <p className="text-gray-500 mt-1">{H(edu.description)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {activeProjects.length > 0 && isVisible("projects") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Projects
              </h2>
              <div className="space-y-3">
                {activeProjects.map((proj) => (
                  <div key={proj.id || Math.random()} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{H(proj.title)}</span>
                      {proj.endDate && <span className="text-[11px] text-gray-400 font-normal">{proj.endDate}</span>}
                    </div>
                    {proj.technologies && (
                      <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">
                        Tech: {H(proj.technologies)}
                      </p>
                    )}
                    {proj.description && (
                      <div className="text-gray-600 text-xs whitespace-pre-line mt-1 leading-relaxed">
                        {H(proj.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publications */}
          {activePubs.length > 0 && isVisible("publications") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Publications
              </h2>
              <div className="space-y-3">
                {activePubs.map((pub) => (
                  <div key={pub.id || Math.random()} className="text-xs">
                    <p className="font-bold text-gray-900">{H(pub.title)}</p>
                    {pub.publisher && <p className="text-[10.5px] text-gray-500">{H(pub.publisher)}{pub.date ? ` • ${pub.date}` : ""}</p>}
                    {pub.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{H(pub.description)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizations */}
          {activeOrgs.length > 0 && isVisible("organizations") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Organizations & Volunteering
              </h2>
              <div className="space-y-3">
                {activeOrgs.map((org) => (
                  <div key={org.id || Math.random()} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{H(org.name)}{org.role && <span className="font-normal text-gray-600"> — {H(org.role)}</span>}</span>
                      {(org.startDate || org.endDate) && (
                        <span className="text-[11px] text-gray-400 font-normal">{org.startDate}{org.startDate && org.endDate ? " – " : ""}{org.endDate}</span>
                      )}
                    </div>
                    {org.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{H(org.description)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Declaration */}
          {declaration && declaration.statement && isVisible("declaration") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Declaration
              </h2>
              <p className="text-xs text-gray-700 italic whitespace-pre-line">{H(declaration.statement)}</p>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-600">
                {declaration.place && <span>{declaration.place}</span>}
                {declaration.date && <span>{declaration.date}</span>}
              </div>
              {declaration.signatureName && <p className="text-xs font-bold text-gray-900 mt-2">{declaration.signatureName}</p>}
            </div>
          )}

          {/* Custom Sections */}
          {customSections && customSections.length > 0 && isVisible("custom") && customSections.map((cSec) => (
            <div key={cSec.id}>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                {cSec.title || "Custom Section"}
              </h2>
              <div className="space-y-2">
                {(cSec.items || []).map((item) => (
                  <div key={item.id || Math.random()} className="text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-900">{H(item.title)}</span>
                      {item.date && <span className="text-[11px] text-gray-400">{item.date}</span>}
                    </div>
                    {item.subtitle && <p className="text-[10.5px] text-gray-600 font-medium">{H(item.subtitle)}</p>}
                    {item.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{H(item.description)}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SaffronTemplate;

