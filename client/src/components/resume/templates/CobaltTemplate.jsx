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
  FolderGit2,
  BookOpen,
  Building2,
  UserCheck,
  FileCheck,
  Heart,
  FileText,
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles, formatResumeDate } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import HeadingRenderer from "../HeadingRenderer";
import SkillsRenderer from "../SkillsRenderer";
import ContactItem from "../ContactItem";
import EntryHeader from "../EntryHeader";

/**
 * FlowCV Template: Cobalt Edge
 * Bold top hero banner with white text and circular avatar on the right,
 * followed by a clean, single-column body with accent borders.
 */
export function CobaltTemplate({ resume = {}, highlightKeywords = [] }) {
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
    sectionOrder = [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
      "awards",
      "interests",
      "publications",
      "organizations",
      "references",
      "declaration",
      "custom",
    ],
    theme = {},
    minPageHeight = 1123,
  } = resume;

  const bannerColor =
    theme.primaryColor && theme.primaryColor !== "#000000"
      ? theme.primaryColor
      : "#0B3B60"; // Deep Cobalt Blue

  const isVisible = (sec) => !hiddenSections.includes(sec);
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;

  // Reactive theme micro-spacing & typography styles
  const styles = getThemeSpacingStyles(theme);

  const activeOrder = sectionOrder.filter((k) => k !== "personalInfo" && isVisible(k));

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary && theme.showSummaryHeading !== false ? (
          <div key="summary" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Summary"
              icon={FileText}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{H(summary)}</p>
          </div>
        ) : null;

      case "experience": {
        const activeExp = experience.filter((e) => !e.hidden);
        return activeExp.length > 0 ? (
          <div key="experience" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Professional Experience"
              icon={Briefcase}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeExp.map((exp, idx) => (
                <div key={exp.id || idx} className="resume-entry" style={styles.entryStyle}>
                  <EntryHeader
                    title={exp.jobTitle}
                    subtitle={exp.company}
                    startDate={exp.startDate}
                    endDate={exp.endDate}
                    currentlyWorking={exp.currentlyWorking}
                    location={exp.location}
                    type="exp"
                    theme={theme}
                    H={H}
                  />
                  {exp.description && (
                    <div className="text-gray-600 text-xs whitespace-pre-line mt-1 leading-relaxed">
                      {H(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "education": {
        const activeEdu = education.filter((e) => !e.hidden);
        return activeEdu.length > 0 ? (
          <div key="education" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Education"
              icon={GraduationCap}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeEdu.map((edu, idx) => (
                <div key={edu.id || idx} className="resume-entry" style={styles.entryStyle}>
                  <EntryHeader
                    title={edu.degree}
                    subtitle={edu.institution}
                    subdetail={edu.fieldOfStudy}
                    startDate={edu.startDate}
                    endDate={edu.endDate}
                    type="edu"
                    theme={theme}
                    H={H}
                  />
                  {edu.grade && <p className="text-[11px] text-gray-500 italic">Grade: {edu.grade}</p>}
                  {edu.description && (
                    <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{H(edu.description)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "skills": {
        const activeSkills = skills.filter((s) => !s.hidden);
        return activeSkills.length > 0 ? (
          <div key="skills" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Technical Skills"
              icon={Wrench}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <SkillsRenderer
              skills={activeSkills}
              theme={theme}
              highlightKeywords={highlightKeywords}
            />
          </div>
        ) : null;
      }

      case "projects": {
        const activeProjects = projects.filter((p) => !p.hidden);
        return activeProjects.length > 0 ? (
          <div key="projects" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Key Projects"
              icon={FolderGit2}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeProjects.map((proj, idx) => (
                <div key={proj.id || idx} className="resume-entry" style={styles.entryStyle}>
                  <EntryHeader
                    title={proj.title}
                    subtitle={proj.technologies ? `Stack: ${proj.technologies}` : ""}
                    startDate={proj.startDate}
                    endDate={proj.endDate}
                    type="proj"
                    theme={theme}
                    H={H}
                  />
                  {proj.link && (
                    <div className="text-[11px] mb-0.5">
                      <ContactItem
                        icon={LinkIcon}
                        text={proj.link}
                        href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                        theme={theme}
                        accentColor={bannerColor}
                        isFirst={true}
                      />
                    </div>
                  )}
                  {proj.description && (
                    <div className="text-gray-600 text-xs whitespace-pre-line mt-0.5 leading-relaxed">
                      {H(proj.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "certifications": {
        const activeCerts = certifications.filter((c) => !c.hidden);
        return activeCerts.length > 0 ? (
          <div key="certifications" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Certifications"
              icon={Award}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <div className="space-y-1.5 text-xs text-gray-800">
              {activeCerts.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline resume-entry">
                  <span>
                    <strong>{H(cert.name)}</strong>
                    {cert.issuer && <span className="text-gray-600"> — {H(cert.issuer)}</span>}
                  </span>
                  {(cert.date || cert.issueDate) && (
                    <span className="text-[11px] italic text-gray-500 font-normal">
                      {formatResumeDate(cert.date || cert.issueDate, theme.dateFormat)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "languages": {
        const activeLangs = languages.filter((l) => !l.hidden);
        return activeLangs.length > 0 ? (
          <div key="languages" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Languages"
              icon={Languages}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <p className="text-[11px] text-gray-800">
              {activeLangs.map((l, idx) => (
                <React.Fragment key={l.id || idx}>
                  {idx > 0 && "  •  "}
                  {H(l.language)}
                  {l.proficiency ? ` (${l.proficiency})` : ""}
                </React.Fragment>
              ))}
            </p>
          </div>
        ) : null;
      }

      case "awards": {
        const activeAwards = awards.filter((a) => !a.hidden);
        return activeAwards.length > 0 ? (
          <div key="awards" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Awards & Honors"
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <div className="space-y-1.5 text-xs">
              {activeAwards.map((item, idx) => (
                <div key={item.id || idx} className="flex justify-between items-baseline resume-entry">
                  <span>
                    <strong className="text-gray-900">{H(item.title)}</strong>
                    {item.issuer && <span className="text-gray-600 ml-1">({H(item.issuer)})</span>}
                  </span>
                  {item.date && (
                    <span className="text-[11px] italic text-gray-500">
                      {formatResumeDate(item.date, theme.dateFormat)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "publications": {
        const activePubs = publications.filter((p) => !p.hidden);
        return activePubs.length > 0 ? (
          <div key="publications" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Publications"
              icon={BookOpen}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <div className="space-y-2 text-xs">
              {activePubs.map((pub, idx) => (
                <div key={pub.id || idx} className="resume-entry">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{H(pub.title)}</span>
                    {pub.date && (
                      <span className="text-[11px] italic font-normal text-gray-500">
                        {formatResumeDate(pub.date, theme.dateFormat)}
                      </span>
                    )}
                  </div>
                  {pub.publisher && <p className="text-[11px] italic text-gray-600">{H(pub.publisher)}</p>}
                  {pub.description && <p className="text-gray-700 mt-0.5 leading-relaxed">{H(pub.description)}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "organizations": {
        const activeOrgs = organizations.filter((o) => !o.hidden);
        return activeOrgs.length > 0 ? (
          <div key="organizations" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Organizations & Volunteering"
              icon={Building2}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <div className="space-y-2.5 text-xs">
              {activeOrgs.map((org, idx) => (
                <div key={org.id || idx} className="resume-entry">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{H(org.name)}</span>
                    <span className="text-[11px] italic font-normal text-gray-500">
                      {formatResumeDate(org.startDate, theme.dateFormat)} –{" "}
                      {org.currentlyActive ? "Present" : formatResumeDate(org.endDate, theme.dateFormat)}
                    </span>
                  </div>
                  {org.role && <p className="text-[11px] italic text-gray-700">{H(org.role)}</p>}
                  {org.description && <p className="text-gray-700 mt-0.5 leading-relaxed">{H(org.description)}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "references": {
        const activeRefs = references.filter((r) => !r.hidden);
        return activeRefs.length > 0 ? (
          <div key="references" style={styles.sectionStyle}>
            <HeadingRenderer
              title="References"
              icon={UserCheck}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <div className="grid grid-cols-2 gap-3 text-xs">
              {activeRefs.map((ref, idx) => (
                <div key={ref.id || idx} className="resume-entry">
                  <p className="font-bold text-gray-900">{H(ref.name)}</p>
                  <p className="text-gray-600 italic">
                    {ref.relationship} {ref.company ? `at ${H(ref.company)}` : ""}
                  </p>
                  {ref.email && <p className="text-gray-500 text-[11px]">{ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "declaration": {
        const dec = declaration;
        return dec && (dec.statement || dec.signatureName) ? (
          <div key="declaration" style={styles.sectionStyle} className="resume-entry pt-2">
            {theme.showDeclarationHeading !== false && (
              <HeadingRenderer
                title="Declaration"
                icon={FileCheck}
                theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
              />
            )}
            <p className="text-xs text-gray-800 italic leading-relaxed">{H(dec.statement)}</p>
            <div
              className={`mt-4 flex text-xs text-gray-800 ${
                theme.declarationPosition === "left"
                  ? "justify-start gap-12"
                  : theme.declarationPosition === "center"
                  ? "justify-center gap-12"
                  : "justify-between"
              }`}
            >
              <div>
                {dec.place && <p>Place: {dec.place}</p>}
                {dec.date && <p>Date: {formatResumeDate(dec.date, theme.dateFormat)}</p>}
              </div>
              <div className={theme.declarationPosition === "left" ? "text-left" : "text-right"}>
                {theme.signatureLine !== "none" && (
                  <div
                    className={`w-36 mb-1 ${
                      theme.signatureLine === "dashed" ? "border-b border-dashed" : "border-b border-solid"
                    } border-gray-600 ${theme.declarationPosition === "left" ? "mr-auto" : "ml-auto"}`}
                  />
                )}
                <p className="font-bold">{dec.signatureName}</p>
              </div>
            </div>
          </div>
        ) : null;
      }

      case "interests": {
        const activeInt = interests.filter((i) => !i.hidden);
        return activeInt.length > 0 ? (
          <div key="interests" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Interests & Hobbies"
              icon={Heart}
              theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
            />
            <p className="text-xs text-gray-800">
              {activeInt.map((i, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && "  •  "}
                  {H(typeof i === "object" ? i.name : i)}
                </React.Fragment>
              ))}
            </p>
          </div>
        ) : null;
      }

      case "custom": {
        return customSections && customSections.length > 0 ? (
          <div key="custom" className="space-y-4">
            {customSections.map((cSec) => (
              <div key={cSec.id} className="mb-4" style={styles.sectionStyle}>
                <HeadingRenderer
                  title={cSec.title}
                  theme={{ ...theme, headingStyle: theme.headingStyle || "left-bar", primaryColor: bannerColor }}
                />
                <div className="space-y-2">
                  {(cSec.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="text-xs resume-entry" style={styles.entryStyle}>
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>{H(item.title)}</span>
                        <span className="text-gray-500 italic font-normal text-[11px]">
                          {formatResumeDate(item.date, theme.dateFormat)}
                        </span>
                      </div>
                      {item.subtitle && <p className="text-gray-700 italic">{H(item.subtitle)}</p>}
                      {item.description && <p className="text-gray-700 mt-0.5 leading-relaxed">{H(item.description)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null;
      }

      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full bg-white flex flex-col justify-between ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 overflow-hidden`}
      style={{
        ...styles.bodyFontStyle,
        minHeight: `${minPageHeight}px`,
        boxSizing: "border-box",
      }}
    >
      <div>
        {/* ── TOP HERO BANNER (Full Bleed) ── */}
        <div
          className="w-full p-8 text-white flex items-center justify-between shadow-xs"
          style={{ backgroundColor: bannerColor }}
        >
          <div className="space-y-2">
            <h1
              className="font-extrabold tracking-tight text-white transition-all"
              style={{
                ...styles.nameFontStyle,
                color: "#FFFFFF",
                fontSize: theme.nameFontSize ? `${theme.nameFontSize}px` : "26px",
              }}
            >
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-sm font-semibold text-white/80 uppercase tracking-widest">
                {personalInfo.jobTitle}
              </p>
            )}

            {/* Contact Links */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/90 pt-2">
              <ContactItem
                icon={Mail}
                text={personalInfo?.email}
                href={personalInfo?.email ? `mailto:${personalInfo.email}` : null}
                theme={theme}
                accentColor="#FFFFFF"
                isFirst={true}
              />
              <ContactItem
                icon={Phone}
                text={personalInfo?.phone}
                href={personalInfo?.phone ? `tel:${personalInfo.phone}` : null}
                theme={theme}
                accentColor="#FFFFFF"
                delimiter={styles.delimiterSymbol}
              />
              <ContactItem
                icon={MapPin}
                text={personalInfo?.location}
                theme={theme}
                accentColor="#FFFFFF"
                delimiter={styles.delimiterSymbol}
              />
              <ContactItem
                icon={LinkIcon}
                text={personalInfo?.linkedin}
                href={
                  personalInfo?.linkedin
                    ? personalInfo.linkedin.startsWith("http")
                      ? personalInfo.linkedin
                      : `https://${personalInfo.linkedin}`
                    : null
                }
                theme={theme}
                accentColor="#FFFFFF"
                delimiter={styles.delimiterSymbol}
              />
              <ContactItem
                icon={LinkIcon}
                text={personalInfo?.github}
                href={
                  personalInfo?.github
                    ? personalInfo.github.startsWith("http")
                      ? personalInfo.github
                      : `https://${personalInfo.github}`
                    : null
                }
                theme={theme}
                accentColor="#FFFFFF"
                delimiter={styles.delimiterSymbol}
              />
              <ContactItem
                icon={Globe}
                text={personalInfo?.portfolio}
                href={
                  personalInfo?.portfolio
                    ? personalInfo.portfolio.startsWith("http")
                      ? personalInfo.portfolio
                      : `https://${personalInfo.portfolio}`
                    : null
                }
                theme={theme}
                accentColor="#FFFFFF"
                delimiter={styles.delimiterSymbol}
              />
            </div>
          </div>

          {/* Circular Avatar / Photo */}
          {personalInfo.photo && (
            <div className="shrink-0 ml-6">
              <PhotoDisplay
                photo={personalInfo.photo}
                photoSettings={resume.photoSettings}
                primaryColor="#FFFFFF"
              />
            </div>
          )}
        </div>

        {/* ── BODY CONTENT ── */}
        <div className="p-8 sm:p-10 space-y-5">
          {activeOrder.map((key) => renderSection(key))}
        </div>
      </div>
    </div>
  );
}

export default CobaltTemplate;
