import React from "react";

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

  let currentHeight = 130;
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
    skills: isVisible("skills") && skills?.length > 0 ? 40 : 0,
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

export function ClassicTemplate({ resume }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, interests, customSections } = resume;

  const { page1, page2 } = paginateSections(resume, 840);

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary ? (
          <div key="summary" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2 font-sans">
              Professional Summary
            </h2>
            <p className="text-gray-800 text-justify">{summary}</p>
          </div>
        ) : null;

      case "experience":
        return experience && experience.length > 0 ? (
          <div key="experience" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2.5 font-sans">
              Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp) => (
                <div key={exp.id || Math.random()}>
                  <div className="flex justify-between font-bold text-gray-900 text-xs">
                    <span>{exp.jobTitle} — {exp.company}</span>
                    <span className="text-[11px] italic font-normal text-gray-600">{exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}</span>
                  </div>
                  {exp.description && <div className="text-xs text-gray-700 mt-0.5 whitespace-pre-line">{exp.description}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education && education.length > 0 ? (
          <div key="education" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2.5 font-sans">
              Education
            </h2>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id || Math.random()}>
                  <div className="flex justify-between font-bold text-gray-900 text-xs">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-[11px] italic font-normal text-gray-600">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <p className="text-[11px] text-gray-700">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills && skills.length > 0 ? (
          <div key="skills" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2 font-sans">
              Skills
            </h2>
            <p className="text-xs text-gray-800">{skills.map((s) => s.name).join(" • ")}</p>
          </div>
        ) : null;

      case "projects":
        return projects && projects.length > 0 ? (
          <div key="projects" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2.5 font-sans">
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id || Math.random()}>
                  <div className="flex justify-between font-bold text-gray-900 text-xs">
                    <span>{proj.title}</span>
                    <span className="text-[11px] italic font-normal text-gray-600">{proj.startDate}</span>
                  </div>
                  {proj.description && <div className="text-xs text-gray-700 mt-0.5 whitespace-pre-line">{proj.description}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return certifications && certifications.length > 0 ? (
          <div key="certifications" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2 font-sans">
              Certifications
            </h2>
            <div className="space-y-1">
              {certifications.map((cert) => (
                <p key={cert.id || Math.random()} className="text-[11px] text-gray-800">
                  <strong>{cert.name}</strong> — {cert.issuer} ({cert.issueDate})
                </p>
              ))}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages && languages.length > 0 ? (
          <div key="languages" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2 font-sans">
              Languages
            </h2>
            <p className="text-[11px] text-gray-800">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
            </p>
          </div>
        ) : null;

      case "interests":
        return interests && interests.length > 0 ? (
          <div key="interests" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2 font-sans">
              Interests & Hobbies
            </h2>
            <p className="text-[11px] text-gray-800">{interests.join(" • ")}</p>
          </div>
        ) : null;

      case "custom":
        return customSections && customSections.length > 0 ? (
          <div key="custom" className="space-y-3">
            {customSections.map((cSec) => (
              <div key={cSec.id} className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2 font-sans">
                  {cSec.title}
                </h2>
                <div className="space-y-1.5">
                  {cSec.items.map((item) => (
                    <div key={item.id} className="text-[11px]">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>{item.title}</span>
                        <span className="text-gray-500 font-normal">{item.date}</span>
                      </div>
                      {item.subtitle && <p className="text-gray-700 italic">{item.subtitle}</p>}
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
    <div className="w-full font-serif">
      {/* ── PAGE 1 ── */}
      <div className="w-full bg-white text-gray-900 rounded-2xl shadow-sm border border-gray-200/80 p-8 sm:p-10 min-h-[1050px] text-[13px] leading-relaxed relative flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="text-center border-b border-gray-400 pb-4 mb-5">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-black">
              {personalInfo?.fullName || "Your Name"}
            </h1>
            {personalInfo?.jobTitle ? (
              <p className="text-sm italic text-gray-700 mt-1">
                {personalInfo.jobTitle}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-center gap-x-3 text-xs text-gray-600 mt-2">
              {personalInfo?.email && <span>{personalInfo.email}</span>}
              {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo?.location && <span>• {personalInfo.location}</span>}
              {personalInfo?.linkedin && <span>• {personalInfo.linkedin}</span>}
            </div>
          </div>

          {page1.map((secKey) => renderSection(secKey))}
        </div>
      </div>

      {/* ── PAGE 2 ── */}
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

export default ClassicTemplate;
