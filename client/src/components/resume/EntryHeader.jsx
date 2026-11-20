import React from "react";
import { formatResumeDate } from "../../utils/themeStyles";

export function EntryHeader({
  title,
  subtitle,
  subdetail,
  startDate,
  endDate,
  currentlyWorking,
  location,
  type = "exp", // 'exp' | 'edu' | 'proj'
  theme = {},
  H = (t) => t,
}) {
  const dateFormat = theme.dateFormat || "MM/YYYY";
  const datePosition = theme.datePosition || "right"; // 'right' | 'below' | 'inline'
  const isExp = type === "exp";
  const isEdu = type === "edu";

  // Determine primary and secondary labels based on user's title order
  let primaryText = "";
  let secondaryText = "";

  if (isExp) {
    const isEmployerFirst =
      theme.expTitleOrder === "employer_title" || theme.expTitleOrder === "company-first";
    if (isEmployerFirst) {
      primaryText = subtitle || ""; // Company
      secondaryText = title || "";  // Job Title
    } else {
      primaryText = title || "";     // Job Title
      secondaryText = subtitle || ""; // Company
    }
  } else if (isEdu) {
    const isSchoolFirst =
      theme.eduTitleOrder === "school_degree" || theme.eduTitleOrder === "school-first";
    if (isSchoolFirst) {
      primaryText = subtitle || ""; // Institution
      secondaryText = title ? `${title}${subdetail ? ` in ${subdetail}` : ""}` : (subdetail || "");
    } else {
      primaryText = title ? `${title}${subdetail ? ` in ${subdetail}` : ""}` : (subdetail || "");
      secondaryText = subtitle || "";
    }
  } else {
    // Project or other
    primaryText = title || "";
    secondaryText = subtitle || "";
  }

  // Format date
  const startFmt = formatResumeDate(startDate, dateFormat);
  const endFmt = currentlyWorking ? "Present" : formatResumeDate(endDate, dateFormat);
  const hasDate = Boolean(startDate || endDate || currentlyWorking);
  const dateRangeStr = hasDate ? `${startFmt}${startFmt && endFmt ? " – " : ""}${endFmt}` : "";

  // Right-aligned date
  if (datePosition === "right") {
    return (
      <div className="resume-entry-header mb-1">
        <div className="flex justify-between items-baseline gap-2">
          <div className="font-bold text-gray-900 text-xs select-text">
            <span>{H(primaryText)}</span>
            {secondaryText && (
              <span className="font-normal text-gray-700 italic ml-1.5 select-text">
                — {H(secondaryText)}
              </span>
            )}
          </div>
          {hasDate && (
            <span className="text-[11px] font-normal text-gray-600 shrink-0 italic select-text">
              {dateRangeStr}
            </span>
          )}
        </div>
        {location && (
          <div className="text-[11px] italic text-gray-500 select-text">{location}</div>
        )}
      </div>
    );
  }

  // Inline date
  if (datePosition === "inline") {
    return (
      <div className="resume-entry-header mb-1">
        <div className="font-bold text-gray-900 text-xs flex flex-wrap items-baseline gap-x-2 select-text">
          <span>{H(primaryText)}</span>
          {secondaryText && (
            <span className="font-normal text-gray-700 italic select-text">
              — {H(secondaryText)}
            </span>
          )}
          {hasDate && (
            <span className="text-[11px] font-normal text-gray-600 italic select-text">
              • {dateRangeStr}
            </span>
          )}
        </div>
        {location && (
          <div className="text-[11px] italic text-gray-500 select-text">{location}</div>
        )}
      </div>
    );
  }

  // Below title
  return (
    <div className="resume-entry-header mb-1">
      <div className="font-bold text-gray-900 text-xs select-text">
        {H(primaryText)}
      </div>
      {secondaryText && (
        <div className="text-xs text-gray-700 italic select-text">
          {H(secondaryText)}
        </div>
      )}
      <div className="flex items-center gap-2 text-[11px] text-gray-500 italic select-text mt-0.5">
        {hasDate && <span>{dateRangeStr}</span>}
        {hasDate && location && <span>•</span>}
        {location && <span>{location}</span>}
      </div>
    </div>
  );
}

export default EntryHeader;
