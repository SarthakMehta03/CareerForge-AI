import React from "react";

export function ProfessionalTemplate({ resume }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, hiddenSections = [] } = resume;
  const isVisible = (sec) => !hiddenSections.includes(sec);

  return (
    <div className="w-full bg-white text-gray-900 font-sans p-8 text-[13px] leading-relaxed shadow-sm min-h-[1100px] border-t-8 border-black">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-5 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            {personalInfo?.fullName || "Your Name"}
          </h1>
          {personalInfo?.jobTitle ? (
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mt-1">
              {personalInfo.jobTitle}
            </p>
          ) : null}
        </div>
        <div className="text-right text-xs text-gray-600 space-y-1">
          {personalInfo?.email && <p>{personalInfo.email}</p>}
          {personalInfo?.phone && <p>{personalInfo.phone}</p>}
          {personalInfo?.location && <p>{personalInfo.location}</p>}
          {personalInfo?.linkedin && <p className="text-black font-medium">{personalInfo.linkedin}</p>}
        </div>
      </div>

      {isVisible("summary") && summary && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-black">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Executive Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {isVisible("experience") && experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id || Math.random()}>
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className="text-sm">{exp.jobTitle}</span>
                  <span className="text-xs text-gray-500 font-semibold">{exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}</span>
                </div>
                <p className="text-xs font-semibold text-gray-700 mb-1">{exp.company} | {exp.location}</p>
                {exp.description && <div className="text-xs text-gray-600 whitespace-pre-line">{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {isVisible("education") && education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1 mb-3">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id || Math.random()} className="mb-3">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</span>
              </div>
              <p className="text-xs font-medium text-gray-700">{edu.institution} {edu.grade ? `• Grade: ${edu.grade}` : ""}</p>
            </div>
          ))}
        </div>
      )}

      {isVisible("skills") && skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1 mb-2">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            {skills.map((s) => (
              <div key={s.id || Math.random()} className="bg-gray-50 p-2 rounded border border-gray-200 font-medium text-gray-800">
                {s.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfessionalTemplate;
