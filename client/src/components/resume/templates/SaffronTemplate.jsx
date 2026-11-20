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
import SkillsRenderer from "../SkillsRenderer";
import HeadingRenderer from "../HeadingRenderer";
import ContactItem from "../ContactItem";
import EntryHeader from "../EntryHeader";

/**
 * FlowCV Template: Saffron Line & Quicksilver
 * Asymmetric 35/65 dual-column layout with warm saffron or silver accent lines.
 */
export function SaffronTemplate({ resume = {}, highlightKeywords = [], variant = "saffron" }) {
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
  const accentColor =
    theme.primaryColor && theme.primaryColor !== "#000000"
      ? theme.primaryColor
      : isQuicksilver
      ? "#475569" // Quicksilver slate
      : "#D97706"; // Saffron Amber-600

  const sidebarBg = isQuicksilver ? "#F8FAFC" : "transparent";

  const isVisible = (sec) => !hiddenSections.includes(sec);
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;

  // Reactive theme micro-spacing & typography styles
  const styles = getThemeSpacingStyles(theme);

  const activeExp = experience.filter((e) => !e.hidden);
  const activeEdu = education.filter((e) => !e.hidden);
  const activeSkills = skills.filter((s) => !s.hidden);
  const activeProjects = projects.filter((p) => !p.hidden);
  const activeCerts = certifications.filter((c) => !c.hidden);
  const activeLangs = languages.filter((l) => !l.hidden);
  const activeAwards = (awards || []).filter((a) => !a.hidden);
  const activeInterests = (interests || []).filter((i) => (typeof i === "object" ? !i.hidden : true));
  const activeRefs = (references || []).filter((r) => !r.hidden);
  const activePubs = (publications || []).filter((p) => !p.hidden);
  const activeOrgs = (organizations || []).filter((o) => !o.hidden);

  return (
    <div
      className={`w-full bg-white flex flex-col justify-between ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 overflow-hidden`}
      style={{
        ...styles.containerStyle,
        minHeight: `${minPageHeight}px`,
        boxSizing: "border-box",
      }}
    >
      <div>
        {/* ── HEADER ── */}
        <div
          className="flex items-center gap-6 pb-6 border-b-2 mb-6"
          style={{ borderColor: accentColor }}
        >
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
              <h1
                className="tracking-tight transition-all"
                style={styles.nameFontStyle}
              >
                {personalInfo.fullName || "Your Name"}
              </h1>
              {personalInfo.jobTitle && (
                <span
                  className="text-sm font-medium transition-colors"
                  style={styles.jobTitleStyle}
                >
                  {personalInfo.jobTitle}
                </span>
              )}
            </div>

            {/* Contact Details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
              <ContactItem
                icon={Mail}
                text={personalInfo?.email}
                href={personalInfo?.email ? `mailto:${personalInfo.email}` : null}
                theme={theme}
                accentColor={accentColor}
                isFirst={true}
              />
              <ContactItem
                icon={Phone}
                text={personalInfo?.phone}
                href={personalInfo?.phone ? `tel:${personalInfo.phone}` : null}
                theme={theme}
                accentColor={accentColor}
                delimiter={styles.delimiterSymbol}
              />
              <ContactItem
                icon={MapPin}
                text={personalInfo?.location}
                theme={theme}
                accentColor={accentColor}
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
                accentColor={accentColor}
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
                accentColor={accentColor}
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
                accentColor={accentColor}
                delimiter={styles.delimiterSymbol}
              />
            </div>
          </div>
        </div>

        {/* ── 35/65 ASYMMETRIC GRID ── */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN (35% - col 4) ── */}
          <div
            className="col-span-4 rounded-xl p-4 flex flex-col gap-5"
            style={{ backgroundColor: sidebarBg }}
          >
            {/* Skills */}
            {activeSkills.length > 0 && isVisible("skills") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Skills" icon={Wrench} theme={theme} />
                <SkillsRenderer
                  skills={activeSkills}
                  theme={theme}
                  highlightKeywords={highlightKeywords}
                />
              </div>
            )}

            {/* Languages */}
            {activeLangs.length > 0 && isVisible("languages") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Languages" icon={Languages} theme={theme} />
                <div className="space-y-1.5">
                  {activeLangs.map((lang, idx) => (
                    <div
                      key={lang.id || idx}
                      className="text-[11px] flex justify-between items-center"
                    >
                      <span className="font-semibold text-gray-800">{H(lang.language)}</span>
                      <span className="text-[10.5px] text-gray-500">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {activeCerts.length > 0 && isVisible("certifications") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Certifications" icon={Award} theme={theme} />
                <div className="space-y-2">
                  {activeCerts.map((cert, idx) => (
                    <div key={cert.id || idx} className="text-[10.5px]">
                      <p className="font-bold text-gray-900">{H(cert.name)}</p>
                      <p className="text-gray-500">
                        {H(cert.issuer)}
                        {(cert.date || cert.issueDate)
                          ? ` • ${formatResumeDate(cert.date || cert.issueDate, theme.dateFormat)}`
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {activeAwards.length > 0 && isVisible("awards") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Awards" theme={theme} />
                <div className="space-y-2">
                  {activeAwards.map((a, idx) => (
                    <div key={a.id || idx} className="text-[10.5px]">
                      <p className="font-bold text-gray-900">{H(a.title)}</p>
                      <p className="text-gray-500">
                        {H(a.issuer)}
                        {a.date ? ` • ${formatResumeDate(a.date, theme.dateFormat)}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {activeInterests.length > 0 && isVisible("interests") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Interests" icon={Heart} theme={theme} />
                <p className="text-[11px] text-gray-700 leading-relaxed">
                  {activeInterests.map((i, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && " • "}
                      {H(typeof i === "object" ? i.name : i)}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            )}

            {/* References */}
            {activeRefs.length > 0 && isVisible("references") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="References" icon={UserCheck} theme={theme} />
                <div className="space-y-2">
                  {activeRefs.map((ref, idx) => (
                    <div key={ref.id || idx} className="text-[10.5px]">
                      <p className="font-bold text-gray-900">{H(ref.name)}</p>
                      <p className="text-gray-500">{ref.relationship} {ref.company ? `• ${H(ref.company)}` : ""}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (65% - col 8) ── */}
          <div className="col-span-8 flex flex-col gap-6">
            {/* Summary */}
            {summary && isVisible("summary") && theme.showSummaryHeading !== false && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Summary" icon={FileText} theme={theme} />
                <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                  {H(summary)}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {activeExp.length > 0 && isVisible("experience") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Work Experience" icon={Briefcase} theme={theme} />
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
            )}

            {/* Education */}
            {activeEdu.length > 0 && isVisible("education") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Education" icon={GraduationCap} theme={theme} />
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
                        <p className="text-gray-600 mt-1 text-xs leading-relaxed">{H(edu.description)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {activeProjects.length > 0 && isVisible("projects") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Key Projects" icon={FolderGit2} theme={theme} />
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
                            accentColor={accentColor}
                            isFirst={true}
                          />
                        </div>
                      )}
                      {proj.description && (
                        <p className="text-gray-600 text-xs mt-1 whitespace-pre-line leading-relaxed">
                          {H(proj.description)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {activePubs.length > 0 && isVisible("publications") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Publications" icon={BookOpen} theme={theme} />
                <div className="space-y-3">
                  {activePubs.map((pub, idx) => (
                    <div key={pub.id || idx} className="text-xs resume-entry">
                      <p className="font-bold text-gray-900">{H(pub.title)}</p>
                      {pub.publisher && (
                        <p className="text-[10.5px] text-gray-500">
                          {H(pub.publisher)}
                          {pub.date ? ` • ${formatResumeDate(pub.date, theme.dateFormat)}` : ""}
                        </p>
                      )}
                      {pub.description && <p className="text-gray-600 mt-1 whitespace-pre-line">{H(pub.description)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizations */}
            {activeOrgs.length > 0 && isVisible("organizations") && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Organizations" icon={Building2} theme={theme} />
                <div className="space-y-3">
                  {activeOrgs.map((org, idx) => (
                    <div key={org.id || idx} className="text-xs resume-entry">
                      <div className="flex justify-between items-baseline font-bold text-gray-900">
                        <span>
                          {H(org.name)}
                          {org.role && <span className="font-normal text-gray-600"> — {H(org.role)}</span>}
                        </span>
                        {(org.startDate || org.endDate) && (
                          <span className="text-[11px] text-gray-400 font-normal">
                            {formatResumeDate(org.startDate, theme.dateFormat)}
                            {org.startDate && org.endDate ? " – " : ""}
                            {formatResumeDate(org.endDate, theme.dateFormat)}
                          </span>
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
              <div style={styles.sectionStyle} className="resume-entry">
                <HeadingRenderer title="Declaration" icon={FileCheck} theme={theme} />
                <p className="text-xs text-gray-700 italic whitespace-pre-line">{H(declaration.statement)}</p>
                <div className="flex justify-between items-center mt-3 text-xs text-gray-600">
                  {declaration.place && <span>Place: {declaration.place}</span>}
                  {declaration.date && <span>Date: {formatResumeDate(declaration.date, theme.dateFormat)}</span>}
                </div>
                {declaration.signatureName && (
                  <p className="text-xs font-bold text-gray-900 mt-2">{declaration.signatureName}</p>
                )}
              </div>
            )}

            {/* Custom Sections */}
            {customSections &&
              customSections.length > 0 &&
              isVisible("custom") &&
              customSections.map((cSec) => (
                <div key={cSec.id} style={styles.sectionStyle}>
                  <HeadingRenderer title={cSec.title || "Custom Section"} theme={theme} />
                  <div className="space-y-2">
                    {(cSec.items || []).map((item, idx) => (
                      <div key={item.id || idx} className="text-xs resume-entry" style={styles.entryStyle}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-gray-900">{H(item.title)}</span>
                          {item.date && (
                            <span className="text-[11px] text-gray-400">
                              {formatResumeDate(item.date, theme.dateFormat)}
                            </span>
                          )}
                        </div>
                        {item.subtitle && <p className="text-[10.5px] text-gray-600 font-medium">{H(item.subtitle)}</p>}
                        {item.description && (
                          <p className="text-gray-600 mt-1 whitespace-pre-line">{H(item.description)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaffronTemplate;
