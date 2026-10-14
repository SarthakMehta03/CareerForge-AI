import React from "react";

export function MinimalTemplate({ resume }) {
  const { personalInfo, summary, experience, education, skills, projects, hiddenSections = [] } = resume;
  const isVisible = (sec) => !hiddenSections.includes(sec);

  return (
    <div className="w-full bg-white text-gray-900 font-sans p-8 text-[12.5px] leading-relaxed shadow-sm min-h-[1100px]">
      {/* Top Header Minimal */}
      <div className="mb-6">
        <h1 className="text-3xl font-light tracking-tight text-black">
          {personalInfo?.fullName || "Your Name"}
        </h1>
        {personalInfo?.jobTitle ? (
          <p className="text-xs uppercase font-medium tracking-widest text-gray-500 mt-1">
            {personalInfo.jobTitle}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {isVisible("summary") && summary && (
        <div className="mb-6">
          <p className="text-gray-600 text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {isVisible("experience") && experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id || Math.random()}>
                <div className="flex justify-between items-baseline font-medium text-black">
                  <span>{exp.jobTitle} / <span className="text-gray-500 font-normal">{exp.company}</span></span>
                  <span className="text-[11px] text-gray-400">{exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}</span>
                </div>
                {exp.description && <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {isVisible("projects") && projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Projects</h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id || Math.random()}>
                <div className="flex justify-between font-medium text-black">
                  <span>{proj.title}</span>
                  <span className="text-[11px] text-gray-400">{proj.startDate}</span>
                </div>
                {proj.description && <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">{proj.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {isVisible("education") && education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Education</h2>
          {education.map((edu) => (
            <div key={edu.id || Math.random()} className="mb-2 flex justify-between text-xs">
              <div>
                <span className="font-medium text-black">{edu.degree} in {edu.fieldOfStudy}</span>
                <p className="text-gray-500">{edu.institution}</p>
              </div>
              <span className="text-gray-400">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {isVisible("skills") && skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-700">
            {skills.map((s) => (
              <span key={s.id || Math.random()} className="bg-gray-50 px-2 py-0.5 rounded text-[11px]">{s.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MinimalTemplate;
