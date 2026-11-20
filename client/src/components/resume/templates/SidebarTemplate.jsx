import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Link as LinkIcon,
  Award,
  Languages,
  Trophy,
  Heart,
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit2,
  BookOpen,
  Building2,
  UserCheck,
  FileCheck,
  Wrench,
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles, formatResumeDate } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import HeadingRenderer from "../HeadingRenderer";
import SkillsRenderer from "../SkillsRenderer";
import ContactItem from "../ContactItem";
import EntryHeader from "../EntryHeader";

export function SidebarTemplate({ resume = {}, highlightKeywords = [] }) {
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

  const isVisible = (sec) => !hiddenSections.includes(sec);

  // Keyword highlighting helper
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;

  // Reactive theme micro-spacing & typography styles
  const styles = getThemeSpacingStyles(theme);

  const activeExp = experience.filter((e) => !e.hidden);
  const activeEdu = education.filter((e) => !e.hidden);
  const activeSkills = skills.filter((s) => !s.hidden);
  const activeProjects = projects.filter((p) => !p.hidden);
  const activeCerts = certifications.filter((c) => !c.hidden);
  const activeLangs = languages.filter((l) => !l.hidden);
  const activeAwards = awards.filter((a) => !a.hidden);
  const activeInterests = interests.filter((i) => (typeof i === "object" ? !i.hidden : true));
  const activeRefs = references.filter((r) => !r.hidden);
  const activePubs = publications.filter((p) => !p.hidden);
  const activeOrgs = organizations.filter((o) => !o.hidden);

  return (
    <div
      className={`w-full ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 flex flex-col justify-between`}
      style={{
        ...styles.containerStyle,
        minHeight: `${minPageHeight}px`,
        boxSizing: "border-box",
      }}
    >
      <div>
        {/* Top Banner / Header (Full Width) */}
        <div
          className="pb-5 border-b mb-6"
          style={{ borderColor: styles.headingBorderColor }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1
                className="font-extrabold uppercase tracking-tight transition-all"
                style={styles.nameFontStyle}
              >
                {personalInfo.fullName || "Your Name"}
              </h1>
              {personalInfo.jobTitle && (
                <p
                  className="text-sm font-semibold mt-0.5 uppercase tracking-wide transition-colors"
                  style={styles.jobTitleStyle}
                >
                  {personalInfo.jobTitle}
                </p>
              )}
            </div>

            {personalInfo.photo && (
              <PhotoDisplay
                photo={personalInfo.photo}
                photoSettings={resume.photoSettings}
                primaryColor={styles.accentColor}
              />
            )}
          </div>
        </div>

        {/* 30/70 Split Grid */}
        <div className="grid grid-cols-12 gap-7 items-start">
          {/* ── LEFT SIDEBAR (Col 4 - 33% Width) ── */}
          <div
            className="col-span-4 flex flex-col pr-4 border-r border-gray-100"
            style={styles.entryGapStyle}
          >
            {/* Contact Information */}
            <div style={styles.sectionStyle}>
              <HeadingRenderer title="Contact" theme={theme} />
              <div className="flex flex-col gap-2 text-[11px] text-gray-700">
                <ContactItem
                  icon={Mail}
                  text={personalInfo.email}
                  href={personalInfo.email ? `mailto:${personalInfo.email}` : null}
                  theme={theme}
                  accentColor={styles.accentColor}
                  isFirst={true}
                />
                <ContactItem
                  icon={Phone}
                  text={personalInfo.phone}
                  href={personalInfo.phone ? `tel:${personalInfo.phone}` : null}
                  theme={theme}
                  accentColor={styles.accentColor}
                  isFirst={true}
                />
                <ContactItem
                  icon={MapPin}
                  text={personalInfo.location}
                  theme={theme}
                  accentColor={styles.accentColor}
                  isFirst={true}
                />
                <ContactItem
                  icon={LinkIcon}
                  text={personalInfo.linkedin}
                  href={
                    personalInfo.linkedin
                      ? personalInfo.linkedin.startsWith("http")
                        ? personalInfo.linkedin
                        : `https://${personalInfo.linkedin}`
                      : null
                  }
                  theme={theme}
                  accentColor={styles.accentColor}
                  isFirst={true}
                />
                <ContactItem
                  icon={LinkIcon}
                  text={personalInfo.github}
                  href={
                    personalInfo.github
                      ? personalInfo.github.startsWith("http")
                        ? personalInfo.github
                        : `https://${personalInfo.github}`
                      : null
                  }
                  theme={theme}
                  accentColor={styles.accentColor}
                  isFirst={true}
                />
                <ContactItem
                  icon={Globe}
                  text={personalInfo.portfolio}
                  href={
                    personalInfo.portfolio
                      ? personalInfo.portfolio.startsWith("http")
                        ? personalInfo.portfolio
                        : `https://${personalInfo.portfolio}`
                      : null
                  }
                  theme={theme}
                  accentColor={styles.accentColor}
                  isFirst={true}
                />
              </div>
            </div>

            {/* Skills */}
            {isVisible("skills") && activeSkills.length > 0 && (
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
            {isVisible("languages") && activeLangs.length > 0 && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Languages" icon={Languages} theme={theme} />
                <div className="flex flex-col gap-1.5">
                  {activeLangs.map((lang, idx) => (
                    <div
                      key={lang.id || idx}
                      className="flex justify-between items-center text-[11px]"
                    >
                      <span className="font-semibold text-gray-800">{H(lang.language)}</span>
                      {lang.proficiency && (
                        <span className="text-[10px] text-gray-500 font-medium">
                          {lang.proficiency}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {isVisible("certifications") && activeCerts.length > 0 && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Certifications" icon={Award} theme={theme} />
                <div className="space-y-1.5">
                  {activeCerts.map((cert, idx) => (
                    <div key={cert.id || idx} className="text-[11px]">
                      <p className="font-bold text-gray-900">{H(cert.name)}</p>
                      <p className="text-gray-500 text-[10px]">
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
            {isVisible("awards") && activeAwards.length > 0 && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Awards" icon={Trophy} theme={theme} />
                <div className="space-y-1.5">
                  {activeAwards.map((item, idx) => (
                    <div key={item.id || idx} className="text-[11px]">
                      <p className="font-bold text-gray-900">{H(item.title)}</p>
                      <p className="text-gray-500 text-[10px]">
                        {H(item.issuer)}
                        {item.date ? ` • ${formatResumeDate(item.date, theme.dateFormat)}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {isVisible("interests") && activeInterests.length > 0 && (
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
          </div>

          {/* ── RIGHT MAIN CONTENT (Col 8 - 67% Width) ── */}
          <div className="col-span-8 flex flex-col" style={styles.entryGapStyle}>
            {/* Summary */}
            {isVisible("summary") && summary && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Professional Summary" icon={FileText} theme={theme} />
                <p className="text-xs text-gray-700 leading-relaxed">{H(summary)}</p>
              </div>
            )}

            {/* Experience */}
            {isVisible("experience") && activeExp.length > 0 && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Experience" icon={Briefcase} theme={theme} />
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
                        <div className="text-xs text-gray-700 whitespace-pre-line mt-1 leading-relaxed">
                          {H(exp.description)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {isVisible("education") && activeEdu.length > 0 && (
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
                      {edu.grade && (
                        <div className="text-[10.5px] text-gray-500 italic">Grade: {edu.grade}</div>
                      )}
                      {edu.description && (
                        <div className="text-[11.5px] text-gray-600 mt-0.5 leading-relaxed">
                          {H(edu.description)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {isVisible("projects") && activeProjects.length > 0 && (
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
                            accentColor={styles.accentColor}
                            isFirst={true}
                          />
                        </div>
                      )}
                      {proj.description && (
                        <div className="text-[11.5px] text-gray-600 whitespace-pre-line mt-0.5 leading-relaxed">
                          {H(proj.description)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {isVisible("publications") && activePubs.length > 0 && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Publications" icon={BookOpen} theme={theme} />
                <div className="flex flex-col" style={styles.entryGapStyle}>
                  {activePubs.map((pub, idx) => (
                    <div key={pub.id || idx} className="text-[11.5px] resume-entry">
                      <p className="font-bold text-gray-900">{H(pub.title)}</p>
                      <p className="text-gray-500 text-[10.5px]">
                        {H(pub.publisher)}
                        {pub.date ? `, ${formatResumeDate(pub.date, theme.dateFormat)}` : ""}
                      </p>
                      {pub.description && <p className="text-gray-600 mt-0.5">{H(pub.description)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizations / Volunteering */}
            {isVisible("organizations") && activeOrgs.length > 0 && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="Organizations" icon={Building2} theme={theme} />
                <div className="flex flex-col" style={styles.entryGapStyle}>
                  {activeOrgs.map((org, idx) => (
                    <div key={org.id || idx} className="text-[11.5px] resume-entry">
                      <div className="flex justify-between items-baseline font-bold text-gray-900">
                        <span>{H(org.name)}</span>
                        <span className="text-[10.5px] text-gray-500 font-normal">
                          {formatResumeDate(org.startDate, theme.dateFormat)} –{" "}
                          {org.currentlyActive ? "Present" : formatResumeDate(org.endDate, theme.dateFormat)}
                        </span>
                      </div>
                      {org.role && <p className="text-[11px] font-semibold text-gray-700">{H(org.role)}</p>}
                      {org.description && <p className="text-gray-600 mt-0.5">{H(org.description)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            {isVisible("references") && activeRefs.length > 0 && (
              <div style={styles.sectionStyle}>
                <HeadingRenderer title="References" icon={UserCheck} theme={theme} />
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  {activeRefs.map((ref, idx) => (
                    <div
                      key={ref.id || idx}
                      className="p-2 bg-gray-50 rounded-lg border border-gray-100 resume-entry"
                    >
                      <p className="font-bold text-gray-900">{H(ref.name)}</p>
                      <p className="text-gray-600 text-[10.5px]">
                        {ref.relationship} {ref.company ? `at ${H(ref.company)}` : ""}
                      </p>
                      {ref.email && <p className="text-gray-500 text-[10px]">{ref.email}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Declaration */}
            {isVisible("declaration") &&
              declaration &&
              (declaration.statement || declaration.signatureName) && (
                <div style={styles.sectionStyle} className="resume-entry pt-2 border-t border-gray-100">
                  <p className="text-[11px] text-gray-700 italic leading-relaxed">
                    {H(declaration.statement)}
                  </p>
                  <div
                    className={`mt-3 flex text-[10.5px] text-gray-800 ${
                      theme.declarationPosition === "left"
                        ? "justify-start gap-10"
                        : theme.declarationPosition === "center"
                        ? "justify-center gap-10"
                        : "justify-between"
                    }`}
                  >
                    <div>
                      {declaration.place && <p>Place: {declaration.place}</p>}
                      {declaration.date && (
                        <p>Date: {formatResumeDate(declaration.date, theme.dateFormat)}</p>
                      )}
                    </div>
                    <div className={theme.declarationPosition === "left" ? "text-left" : "text-right"}>
                      {theme.signatureLine !== "none" && (
                        <div
                          className={`w-28 mb-1 ${
                            theme.signatureLine === "dashed"
                              ? "border-b border-dashed"
                              : "border-b border-solid"
                          } border-gray-400 ${
                            theme.declarationPosition === "left" ? "mr-auto" : "ml-auto"
                          }`}
                        />
                      )}
                      <p className="font-bold">{declaration.signatureName}</p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarTemplate;
