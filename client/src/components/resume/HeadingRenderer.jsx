import React from "react";
import { getContrastTextColor, getFontFamily } from "../../utils/themeStyles";

export function HeadingRenderer({
  title,
  icon: Icon,
  theme = {},
  headingTextColor,
  headingBorderColor,
  className = "",
}) {
  const headingStyle = theme.headingStyle || "line-bottom"; // 'line-bottom' | 'left-bar' | 'pill' | 'boxed' | 'line-top' | 'minimal'
  const capitalization =
    theme.capitalization === "capitalize"
      ? "capitalize"
      : theme.capitalization === "lowercase"
      ? "lowercase"
      : "uppercase";
  const iconMode = theme.headingIcons || "none"; // 'none' | 'outline' | 'filled'
  const accentColor = theme.primaryColor || "#000000";
  const contrastColor = getContrastTextColor(accentColor);

  const targets = theme.accentTargets || {
    name: true,
    jobTitle: true,
    headings: true,
    headingLine: true,
  };
  const activeTextColor =
    headingTextColor || (targets.headings !== false ? accentColor : "#111827");
  const activeBorderColor =
    headingBorderColor || (targets.headingLine !== false ? accentColor : "#E5E7EB");

  const fontStyle = {
    fontFamily: getFontFamily(theme.bodyFont),
    fontSize: theme.headingFontSize ? `${theme.headingFontSize}px` : undefined,
    color: activeTextColor,
  };

  const renderIcon = () => {
    if (!Icon || iconMode === "none") return null;
    if (iconMode === "filled") {
      return (
        <span
          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mr-1.5 shadow-2xs"
          style={{ backgroundColor: accentColor, color: contrastColor }}
        >
          <Icon size={11} strokeWidth={2.5} />
        </span>
      );
    }
    // outline
    return (
      <span className="shrink-0 mr-1.5" style={{ color: accentColor }}>
        <Icon size={14} strokeWidth={2.2} />
      </span>
    );
  };

  // 1. Left Bar Accent Style (FlowCV favorite)
  if (headingStyle === "left-bar") {
    return (
      <div
        className={`resume-heading-block flex items-center pl-2.5 py-0.5 border-l-4 mb-2.5 ${className}`}
        style={{ borderLeftColor: activeBorderColor }}
      >
        {renderIcon()}
        <h2 className={`font-bold tracking-wider ${capitalization}`} style={fontStyle}>
          {title}
        </h2>
      </div>
    );
  }

  // 2. Solid Pill / Badge Accent Style
  if (headingStyle === "pill") {
    return (
      <div className={`resume-heading-block mb-2.5 ${className}`}>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold shadow-2xs"
          style={{
            backgroundColor: accentColor,
            color: contrastColor,
            fontSize: theme.headingFontSize ? `${theme.headingFontSize}px` : "12px",
          }}
        >
          {Icon && iconMode !== "none" && <Icon size={12} strokeWidth={2.5} />}
          <span className={capitalization}>{title}</span>
        </div>
      </div>
    );
  }

  // 3. Boxed Style
  if (headingStyle === "boxed") {
    return (
      <div
        className={`resume-heading-block flex items-center px-2.5 py-1 border rounded-md mb-2.5 ${className}`}
        style={{ borderColor: activeBorderColor, backgroundColor: "#f9fafb" }}
      >
        {renderIcon()}
        <h2 className={`font-bold tracking-wider ${capitalization}`} style={fontStyle}>
          {title}
        </h2>
      </div>
    );
  }

  // 4. Line Top (Overline)
  if (headingStyle === "line-top") {
    return (
      <div
        className={`resume-heading-block flex items-center border-t pt-1 mb-2.5 ${className}`}
        style={{ borderTopColor: activeBorderColor }}
      >
        {renderIcon()}
        <h2 className={`font-bold tracking-wider ${capitalization}`} style={fontStyle}>
          {title}
        </h2>
      </div>
    );
  }

  // 5. Minimal Clean Text Style (no lines or pills)
  if (headingStyle === "minimal") {
    return (
      <div className={`resume-heading-block flex items-center mb-1.5 ${className}`}>
        {renderIcon()}
        <h2 className={`font-extrabold tracking-wider ${capitalization}`} style={fontStyle}>
          {title}
        </h2>
      </div>
    );
  }

  // 6. Default: Line Bottom (Underline across width)
  return (
    <div
      className={`resume-heading-block flex items-center border-b pb-1 mb-2.5 ${className}`}
      style={{ borderBottomColor: activeBorderColor }}
    >
      {renderIcon()}
      <h2 className={`font-bold tracking-wider ${capitalization}`} style={fontStyle}>
        {title}
      </h2>
    </div>
  );
}

export default HeadingRenderer;
