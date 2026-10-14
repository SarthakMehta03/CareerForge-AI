import React, { useRef } from "react";
import ModernTemplate from "./ModernTemplate";
import ClassicTemplate from "./ClassicTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";

export function ResumePreview({ resume }) {
  const previewRef = useRef();

  const renderTemplate = () => {
    switch (resume?.template) {
      case "classic":
        return <ClassicTemplate resume={resume} />;
      case "minimal":
        return <MinimalTemplate resume={resume} />;
      case "professional":
        return <ProfessionalTemplate resume={resume} />;
      case "modern":
      default:
        return <ModernTemplate resume={resume} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Clean FlowCV-Style Page Sheet */}
      <div
        ref={previewRef}
        id="resume-preview-content"
        className="w-full bg-white rounded-2xl shadow-sm border border-gray-200/80 p-8 sm:p-10 min-h-[1050px] text-black relative transition-all"
      >
        {renderTemplate()}
      </div>
    </div>
  );
}

export default ResumePreview;
