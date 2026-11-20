import React from "react";

export function ResumeFooter({
  resume = {},
  pageIndex = 1,
  totalPages = 1,
  outerMarginPx = 48,
}) {
  const { theme = {}, personalInfo = {} } = resume;
  const showPageNumbers = Boolean(theme?.footerPageNumbers);
  const showEmail = Boolean(theme?.footerEmail && personalInfo?.email);
  const showName = Boolean(theme?.footerName && personalInfo?.fullName);

  if (!showPageNumbers && !showEmail && !showName) return null;

  return (
    <div
      className="resume-page-footer absolute bottom-0 left-0 right-0 h-9 flex items-center justify-between text-[10px] text-gray-500 font-medium select-text z-10 border-t border-gray-200/60 bg-white"
      style={{
        paddingLeft: `${Math.max(24, outerMarginPx)}px`,
        paddingRight: `${Math.max(24, outerMarginPx)}px`,
      }}
    >
      <div className="truncate max-w-[32%] text-left font-normal text-gray-600">
        {showName ? <span>{personalInfo.fullName}</span> : <span className="opacity-0">-</span>}
      </div>
      <div className="truncate max-w-[36%] text-center font-normal text-gray-500">
        {showEmail ? <span>{personalInfo.email}</span> : <span className="opacity-0">-</span>}
      </div>
      <div className="shrink-0 text-right font-medium text-gray-600">
        {showPageNumbers ? (
          <span>
            Page {pageIndex} of {totalPages}
          </span>
        ) : (
          <span className="opacity-0">-</span>
        )}
      </div>
    </div>
  );
}

export default ResumeFooter;
