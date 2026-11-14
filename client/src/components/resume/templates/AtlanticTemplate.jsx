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
  Trophy,
  Award,
  FolderGit2,
  BookOpen,
  Building2,
  Heart,
  UserCheck,
  FileCheck2,
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles, formatResumeDate } from "../../../utils/themeStyles";
import SkillsRenderer from "../SkillsRenderer";
import HeadingRenderer from "../HeadingRenderer";
import ContactItem from "../ContactItem";
import EntryHeader from "../EntryHeader";
import PhotoDisplay from "../PhotoDisplay";

/**
 * FlowCV Template: Atlantic Blue & Hunter Green
 * Split-layout design with a deep navy or hunter-green left sidebar (34% width).
 */
export function AtlanticTemplate({ resume = {}, highlightKeywords = [], variant = "atlantic" }) {
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

  // Variant color: Atlantic Blue (navy) or Hunter Green (forest)
  const isHunter = variant === "hunter" || resume.template === "hunter-green";
  const sidebarBg =
    theme.primaryColor && theme.primaryColor !== "#000000"
      ? theme.primaryColor
      : isHunter
      ? "#23372F" // Hunter Green
      : "#1E293B"; // Atlantic Blue Slate-800

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
  const activeAwards = awards.filter((a) => !a.hidden);
  const activeInterests = interests.filter((i) => (typeof i === "object" ? !i.hidden : true));
  const activeRefs = (references || []).filter((r) => !r.hidden);
  const activePubs = (publications || []).filter((p) => !p.hidden);
  const activeOrgs = (organizations || []).filter((o) => !o.hidden);

  return (
    <div
      className={`w-full bg-white flex ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 overflow-hidden`}
      style={{
        ...styles.bodyFontStyle,
        minHeight: `${minPageHeight}px`,
        boxSizing: "border-box",
      }}
    >
      {/* ── LEFT DARK SIDEBAR (34% width) ── */}
      <div
        className="w-[34%] p-6 text-white flex flex-col shrink-0"
        style={{ backgroundColor: sidebarBg, minHeight: `${minPageHeight}px` }}
      >
        <div className="space-y-6">
          {/* Avatar / Photo */}
          {personalInfo.photo ? (
            <div className="flex justify-center mb-3">
              <PhotoDisplay
                photo={personalInfo.photo}
                photoSettings={resume.photoSettings}
                primaryColor="#FFFFFF"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 mx-auto flex items-center justify-center text-xl font-bold text-white mb-3 border-2 border-white/20">
              {(personalInfo.fullName || "CV")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}

          {/* Name & Title */}
          <div className="text-center">
            <h1
              className="font-extrabold tracking-tight text-white leading-tight transition-all"
              style={{
                ...styles.nameFontStyle,
                color: "#FFFFFF",
                fontSize: theme.nameFontSize ? `${theme.nameFontSize}px` : "22px",
              }}
            >
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-xs font-medium text-white/80 mt-1 uppercase tracking-wider">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-2 text-[11px] text-white/90 pt-3 border-t border-white/15">
            <ContactItem
              icon={Mail}
              text={personalInfo.email}
              href={personalInfo.email ? `mailto:${personalInfo.email}` : null}
              theme={theme}
              accentColor="#FFFFFF"
              isFirst={true}
            />
            <ContactItem
              icon={Phone}
              text={personalInfo.phone}
              href={personalInfo.phone ? `tel:${personalInfo.phone}` : null}
              theme={theme}
              accentColor="#FFFFFF"
              isFirst={true}
            />
            <ContactItem
              icon={MapPin}
              text={personalInfo.location}
              theme={theme}
              accentColor="#FFFFFF"
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
              accentColor="#FFFFFF"
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
              accentColor="#FFFFFF"
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
              accentColor="#FFFFFF"
              isFirst={true}
            />
          </div>

          {/* Languages */}
          {activeLangs.length > 0 && isVisible("languages") && (
            <div className="pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white mb-2">
                <Languages size={13} className="text-white/70" />
                <span>Languages</span>
              </div>
              <div className="space-y-1.5">
                {activeLangs.map((lang, idx) => (
                  <div key={lang.id || idx} className="text-[11px] flex justify-between items-center">
                    <span className="font-semibold text-white">{H(lang.language)}</span>
                    <span className="text-[10px] text-white/60">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {activeCerts.length > 0 && isVisible("certifications") && (
            <div className="pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white mb-2">
                <Award size={13} className="text-white/70" />
                <span>Certifications</span>
              </div>
              <div className="space-y-1.5">
                {activeCerts.map((cert, idx) => (
                  <div key={cert.id || idx} className="text-[10.5px]">
                    <p className="font-bold text-white leading-tight">{H(cert.name)}</p>
                    <p className="text-white/70">
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
            <div className="pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white mb-2">
                <Trophy size={13} className="text-white/70" />
                <span>Awards</span>
              </div>
              <div className="space-y-1.5">
                {activeAwards.map((award, idx) => (
                  <div key={award.id || idx} className="text-[10.5px]">
                    <p className="font-bold text-white">{H(award.title)}</p>
                    <p className="text-white/70">
                      {H(award.issuer)}
                      {award.date ? ` • ${formatResumeDate(award.date, theme.dateFormat)}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {activeInterests.length > 0 && isVisible("interests") && (
            <div className="pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white mb-2">
                <Heart size={13} className="text-white/70" />
                <span>Interests & Hobbies</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
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
            <div className="pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white mb-2">
                <UserCheck size={13} className="text-white/70" />
                <span>References</span>
              </div>
              <div className="space-y-2">
                {activeRefs.map((ref, idx) => (
                  <div key={ref.id || idx} className="text-[10.5px]">
                    <p className="font-bold text-white">{H(ref.name)}</p>
                    {ref.relationship && <p className="text-white/70">{ref.relationship}</p>}
                    {ref.company && <p className="text-white/60">{ref.company}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT MAIN BODY (66% width) ── */}
      <div className="w-[66%] p-7 sm:p-9 flex flex-col justify-between" style={styles.entryGapStyle}>
        <div>
          {/* Summary */}
          {summary && isVisible("summary") && theme.showSummaryHeading !== false && (
            <div style={styles.sectionStyle}>
              <HeadingRenderer title="Professional Summary" theme={theme} />
              <p className="text-gray-700 text-xs leading-relaxed text-justify whitespace-pre-line">
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
                    {edu.description && <p className="text-gray-500 mt-1 leading-relaxed text-xs">{H(edu.description)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                          accentColor={styles.accentColor}
                          isFirst={true}
                        />
                      </div>
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
            <div style={styles.sectionStyle}>
              <HeadingRenderer title="Publications" icon={BookOpen} theme={theme} />
              <div className="flex flex-col" style={styles.entryGapStyle}>
                {activePubs.map((pub, idx) => (
                  <div key={pub.id || idx} className="resume-entry text-xs">
                    <p className="font-bold text-gray-900">{H(pub.title)}</p>
                    <p className="text-gray-500 text-[11px]">
                      {H(pub.publisher)}
                      {pub.date ? `, ${formatResumeDate(pub.date, theme.dateFormat)}` : ""}
                    </p>
                    {pub.description && <p className="text-gray-600 mt-0.5">{H(pub.description)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizations */}
          {activeOrgs.length > 0 && isVisible("organizations") && (
            <div style={styles.sectionStyle}>
              <HeadingRenderer title="Organizations" icon={Building2} theme={theme} />
              <div className="flex flex-col" style={styles.entryGapStyle}>
                {activeOrgs.map((org, idx) => (
                  <div key={org.id || idx} className="resume-entry text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{H(org.name)}</span>
                      <span className="text-[11px] text-gray-400 font-normal">
                        {formatResumeDate(org.startDate, theme.dateFormat)} –{" "}
                        {org.currentlyActive ? "Present" : formatResumeDate(org.endDate, theme.dateFormat)}
                      </span>
                    </div>
                    {org.role && <p className="text-gray-600 text-[11px]">{H(org.role)}</p>}
                    {org.description && <p className="text-gray-600 mt-0.5">{H(org.description)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Declaration */}
          {declaration && declaration.statement && isVisible("declaration") && (
            <div style={styles.sectionStyle} className="resume-entry">
              <HeadingRenderer title="Declaration" icon={FileCheck2} theme={theme} />
              <p className="text-xs text-gray-700 italic whitespace-pre-line leading-relaxed">
                {H(declaration.statement)}
              </p>
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
  );
}

export default AtlanticTemplate;
