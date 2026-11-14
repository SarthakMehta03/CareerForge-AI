import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Link as LinkIcon,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Award,
  FolderGit2,
  BookOpen,
  Building2,
  Heart,
  Users,
  FileCheck,
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles, formatResumeDate } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import HeadingRenderer from "../HeadingRenderer";
import SkillsRenderer from "../SkillsRenderer";
import ContactItem from "../ContactItem";
import EntryHeader from "../EntryHeader";

export function ProfessionalTemplate({ resume = {}, highlightKeywords = [] }) {
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
    publications = [],
    organizations = [],
    references = [],
    declaration = {},
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
      "publications",
      "organizations",
      "interests",
      "references",
      "declaration",
      "custom",
    ],
    theme = {},
    minPageHeight = 1123,
  } = resume;

  const isVisible = (sec) => !hiddenSections.includes(sec);
  const activeOrder = sectionOrder.filter((key) => key !== "personalInfo" && isVisible(key));

  // Reactive theme micro-spacing & typography styles
  const styles = getThemeSpacingStyles(theme);

  // Keyword highlighting helper
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;

  const isCentered = theme.headerAlign === "center";
  const headerAlignClass =
    theme.headerAlign === "center"
      ? "text-center items-center justify-center"
      : theme.headerAlign === "right"
      ? "text-right items-end justify-end"
      : "text-left items-start justify-start";

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary && theme.showSummaryHeading !== false ? (
          <div key="summary" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Professional Summary"
              icon={FileText}
              theme={theme}
            />
            <p className="text-gray-800 text-justify leading-relaxed">{H(summary)}</p>
          </div>
        ) : null;

      case "experience": {
        const activeExp = (experience || []).filter((e) => !e.hidden);
        return activeExp.length > 0 ? (
          <div key="experience" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Experience"
              icon={Briefcase}
              theme={theme}
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
                    <div className="text-xs text-gray-700 mt-0.5 whitespace-pre-line leading-relaxed">
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
        const activeEdu = (education || []).filter((e) => !e.hidden);
        return activeEdu.length > 0 ? (
          <div key="education" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Education"
              icon={GraduationCap}
              theme={theme}
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
                  {edu.grade && <p className="text-[11px] text-gray-600 italic">Grade: {edu.grade}</p>}
                  {edu.description && (
                    <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{H(edu.description)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "skills": {
        const activeSkills = (skills || []).filter((s) => !s.hidden);
        return activeSkills.length > 0 ? (
          <div key="skills" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Skills"
              icon={Wrench}
              theme={theme}
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
        const activeProj = (projects || []).filter((p) => !p.hidden);
        return activeProj.length > 0 ? (
          <div key="projects" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Key Projects"
              icon={FolderGit2}
              theme={theme}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeProj.map((proj, idx) => (
                <div key={proj.id || idx} className="resume-entry" style={styles.entryStyle}>
                  <EntryHeader
                    title={proj.title}
                    subtitle={proj.technologies ? `Tools: ${proj.technologies}` : ""}
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
                        accentColor={styles.accentColor}
                        isFirst={true}
                      />
                    </div>
                  )}
                  {proj.description && (
                    <div className="text-xs text-gray-700 mt-0.5 whitespace-pre-line leading-relaxed">
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
        const activeCerts = (certifications || []).filter((c) => !c.hidden);
        return activeCerts.length > 0 ? (
          <div key="certifications" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Certifications"
              icon={Award}
              theme={theme}
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
        const activeLang = (languages || []).filter((l) => !l.hidden);
        return activeLang.length > 0 ? (
          <div key="languages" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Languages"
              icon={Languages}
              theme={theme}
            />
            <p className="text-[11px] text-gray-800">
              {activeLang.map((l, idx) => (
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
        const activeAwards = (awards || []).filter((a) => !a.hidden);
        return activeAwards.length > 0 ? (
          <div key="awards" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Awards & Honors"
              icon={Award}
              theme={theme}
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
        const activePubs = (publications || []).filter((p) => !p.hidden);
        return activePubs.length > 0 ? (
          <div key="publications" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Publications & Research"
              icon={BookOpen}
              theme={theme}
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
        const activeOrgs = (organizations || []).filter((o) => !o.hidden);
        return activeOrgs.length > 0 ? (
          <div key="organizations" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Organizations & Volunteering"
              icon={Building2}
              theme={theme}
            />
            <div className="space-y-2.5 text-xs">
              {activeOrgs.map((org, idx) => (
                <div key={org.id || idx} className="resume-entry">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{H(org.name)}</span>
                    <span className="text-[11px] italic font-normal text-gray-600">
                      {formatResumeDate(org.startDate, theme.dateFormat)}
                      {org.startDate && (org.endDate || org.currentlyActive) ? " – " : ""}
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
        const activeRefs = (references || []).filter((r) => !r.hidden);
        return activeRefs.length > 0 ? (
          <div key="references" style={styles.sectionStyle}>
            <HeadingRenderer
              title="References"
              icon={Users}
              theme={theme}
            />
            <div className="grid grid-cols-2 gap-3 text-xs">
              {activeRefs.map((ref, idx) => (
                <div key={ref.id || idx} className="resume-entry">
                  <p className="font-bold text-gray-900">{H(ref.name)}</p>
                  <p className="text-gray-600 italic">{ref.relationship}{ref.company ? ` at ${H(ref.company)}` : ""}</p>
                  {ref.email && <p className="text-gray-500 text-[11px]">{ref.email}</p>}
                  {ref.phone && <p className="text-gray-500 text-[11px]">{ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }

      case "declaration": {
        const dec = declaration;
        return dec && (dec.statement || dec.signatureName) ? (
          <div key="declaration" style={styles.sectionStyle} className="resume-entry">
            {theme.showDeclarationHeading !== false && (
              <HeadingRenderer
                title="Declaration"
                icon={FileCheck}
                theme={theme}
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
        const activeInt = (interests || []).filter((i) => !i.hidden);
        return activeInt.length > 0 ? (
          <div key="interests" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Interests & Hobbies"
              icon={Heart}
              theme={theme}
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
                  theme={theme}
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
      className={`w-full ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 border-t-8 flex flex-col justify-between`}
      style={{
        ...styles.containerStyle,
        borderTopColor: styles.accentColor,
        minHeight: `${minPageHeight}px`,
        boxSizing: "border-box",
      }}
    >
      <div>
        {/* Header */}
        <div
          className={`pb-5 border-b border-gray-200 mb-5 ${
            isCentered ? "text-center" : ""
          }`}
          style={styles.sectionStyle}
        >
          {personalInfo?.photo && (
            <div className={`flex mb-3 ${isCentered ? "justify-center" : "justify-start"}`}>
              <PhotoDisplay
                photo={personalInfo.photo}
                photoSettings={resume.photoSettings}
                primaryColor={styles.accentColor}
              />
            </div>
          )}

          <div className={headerAlignClass}>
            <h1
              className="font-black tracking-tight transition-all"
              style={styles.nameFontStyle}
            >
              {personalInfo?.fullName || "Your Name"}
            </h1>
            {personalInfo?.jobTitle ? (
              <p
                className="text-sm font-semibold uppercase tracking-wider mt-1 transition-colors"
                style={styles.jobTitleStyle}
              >
                {personalInfo.jobTitle}
              </p>
            ) : null}

            {/* Contact Links & Meta */}
            <div
              className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-2.5 ${headerAlignClass}`}
            >
              <ContactItem
                icon={Mail}
                text={personalInfo?.email}
                href={personalInfo?.email ? `mailto:${personalInfo.email}` : null}
                theme={theme}
                accentColor={styles.accentColor}
                isFirst={true}
              />
              <ContactItem
                icon={Phone}
                text={personalInfo?.phone}
                href={personalInfo?.phone ? `tel:${personalInfo.phone}` : null}
                theme={theme}
                accentColor={styles.accentColor}
                delimiter={styles.delimiterSymbol}
              />
              <ContactItem
                icon={MapPin}
                text={personalInfo?.location}
                theme={theme}
                accentColor={styles.accentColor}
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
                accentColor={styles.accentColor}
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
                accentColor={styles.accentColor}
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
                accentColor={styles.accentColor}
                delimiter={styles.delimiterSymbol}
              />
            </div>
          </div>
        </div>

        {/* Render All Active Sections */}
        {activeOrder.map((secKey) => renderSection(secKey))}
      </div>
    </div>
  );
}

export default ProfessionalTemplate;
