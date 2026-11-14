/**
 * Theme Spacing & Typography Helper
 *
 * Translates theme micro-controls (sectionSpacing, entrySpacing, fontScale, lineHeight, pageMargin,
 * bodyFont, nameFont, nameFontSize, headingFontSize, delimiters, link styles, date format)
 * into reactive inline styles and Tailwind classes across all resume templates.
 */

export const FONT_MAP = {
  "Source Serif Pro": "'Source Serif 4', 'Source Serif Pro', Georgia, serif",
  "Inter (Sans-Serif)": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "Inter": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "Roboto": "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  "Garamond (Serif)": "'EB Garamond', Garamond, 'Times New Roman', serif",
  "Garamond": "'EB Garamond', Garamond, 'Times New Roman', serif",
  "Fira Code (Monospace)": "'Fira Code', 'Courier New', monospace",
  "Fira Code": "'Fira Code', 'Courier New', monospace",
  "Open Sans": "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  "Lato": "'Lato', -apple-system, BlinkMacSystemFont, sans-serif",
  "Playfair Display": "'Playfair Display', Georgia, serif",
  "Montserrat": "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
  "serif": "'Source Serif 4', 'EB Garamond', Georgia, serif",
  "sans": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "mono": "'Fira Code', 'Courier New', monospace",
};

export function getFontFamily(fontName) {
  if (!fontName) return FONT_MAP["Inter"];
  if (FONT_MAP[fontName]) return FONT_MAP[fontName];
  // Strip parentheses e.g. "Inter (Sans-Serif)" -> "Inter"
  const clean = fontName.replace(/\s*\(.*?\)/g, "").trim();
  if (FONT_MAP[clean]) return FONT_MAP[clean];
  return fontName;
}

export function getHeaderDelimiter(delimiter) {
  switch (delimiter) {
    case "pipe":
    case "bar":
      return " | ";
    case "slash":
      return " / ";
    case "dash":
      return " – ";
    case "space":
      return "   ";
    case "none":
      return "";
    case "bullet":
    default:
      return " • ";
  }
}

/**
 * Format date string according to theme.dateFormat
 * Supported formats: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'MM/YYYY'
 */
export function formatResumeDate(dateStr, format = "MM/YYYY") {
  if (!dateStr || typeof dateStr !== "string") return dateStr || "";
  const trimmed = dateStr.trim();
  if (trimmed.toLowerCase() === "present" || trimmed.toLowerCase() === "current") {
    return "Present";
  }

  // Check if date matches YYYY-MM-DD or YYYY-MM
  const isoMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})(?:[-/.](\d{1,2}))?$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, "0");
    const day = (isoMatch[3] || "01").padStart(2, "0");

    switch (format) {
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "MM/YYYY":
      default:
        return `${month}/${year}`;
    }
  }

  return trimmed;
}

export function getThemeSpacingStyles(theme = {}) {
  // 1. Section vertical margin (in px, default 18px)
  const sectionSpacingVal =
    typeof theme.sectionSpacing === "number" ? theme.sectionSpacing : 18;

  // 2. Entry vertical spacing between jobs/schools/projects (in px, default 12px)
  const entrySpacingVal =
    typeof theme.entrySpacing === "number" ? theme.entrySpacing : 12;

  // 3. Body Font Size Scale (Compact 9pt / Normal 10pt / Spacious 11pt)
  let fontScaleClass = "text-[12.5px]";
  let headingBaseClass = "text-xs";
  if (theme.fontScale === "compact") {
    fontScaleClass = "text-[11px]";
    headingBaseClass = "text-[11px]";
  } else if (theme.fontScale === "spacious") {
    fontScaleClass = "text-[14px]";
    headingBaseClass = "text-sm";
  }

  // 4. Line Height
  let lineHeightVal = 1.45;
  let lineHeightClass = "leading-normal";
  if (theme.lineHeight === "tight") {
    lineHeightVal = 1.25;
    lineHeightClass = "leading-tight";
  } else if (theme.lineHeight === "relaxed") {
    lineHeightVal = 1.65;
    lineHeightClass = "leading-relaxed";
  } else if (theme.lineHeight === "loose") {
    lineHeightVal = 1.85;
    lineHeightClass = "leading-loose";
  }

  // 5. Outer Page Margin
  let pageMarginClass = "p-8 sm:p-10";
  let pagePaddingStyle = { padding: "32px 36px" };
  if (theme.pageMargin === "compact") {
    pageMarginClass = "p-5 sm:p-6";
    pagePaddingStyle = { padding: "20px 24px" };
  } else if (theme.pageMargin === "spacious") {
    pageMarginClass = "p-10 sm:p-14";
    pagePaddingStyle = { padding: "44px 48px" };
  }
  if (typeof theme.marginHorizontal === "number" || typeof theme.marginVertical === "number") {
    const mx = typeof theme.marginHorizontal === "number" ? theme.marginHorizontal : 24;
    const my = typeof theme.marginVertical === "number" ? theme.marginVertical : 24;
    pagePaddingStyle = { padding: `${my}px ${mx}px` };
  }

  // 6. Fonts
  const bodyFontRaw = theme.bodyFont || (theme.fontFamily === "serif" ? "Source Serif Pro" : theme.fontFamily === "mono" ? "Fira Code" : "Inter");
  const bodyFontFamily = getFontFamily(bodyFontRaw);
  const nameFontRaw =
    theme.nameFont && theme.nameFont !== "Same as body font"
      ? theme.nameFont
      : bodyFontRaw;
  const nameFontFamily = getFontFamily(nameFontRaw);

  // 7. Font Sizing
  const nameFontSizeVal =
    typeof theme.nameFontSize === "number" ? theme.nameFontSize : 28;
  const headingFontSizeVal =
    typeof theme.headingFontSize === "number" ? theme.headingFontSize : 14;

  // 8. Colors & Accents
  const accentColor = theme.primaryColor || "#000000";
  const targets = theme.accentTargets || {
    name: true,
    jobTitle: true,
    headings: true,
    headingLine: true,
  };
  const nameColor = targets.name !== false ? accentColor : "#111827";
  const jobTitleColor = targets.jobTitle !== false ? accentColor : "#4B5563";
  const headingTextColor = targets.headings !== false ? accentColor : "#111827";
  const headingBorderColor = targets.headingLine !== false ? accentColor : "#E5E7EB";

  // 9. Delimiter
  const delimiterSymbol = getHeaderDelimiter(theme.headerDelimiter);

  // 10. Links
  const linkUnderlineClass = theme.linkUnderline ? "underline" : "no-underline";
  const linkColorStyle = theme.linkBlue ? { color: "#2563eb" } : { color: "inherit" };
  const showLinkIcon = theme.linkIcon !== false;

  return {
    sectionSpacingVal,
    entrySpacingVal,
    sectionStyle: { marginBottom: `${sectionSpacingVal}px` },
    entryStyle: { marginBottom: `${entrySpacingVal}px` },
    entryGapStyle: { gap: `${entrySpacingVal}px` },
    containerStyle: {
      fontFamily: bodyFontFamily,
      lineHeight: lineHeightVal,
      ...pagePaddingStyle,
    },
    bodyFontStyle: { fontFamily: bodyFontFamily },
    nameFontStyle: {
      fontFamily: nameFontFamily,
      fontSize: `${nameFontSizeVal}px`,
      color: nameColor,
    },
    jobTitleStyle: {
      color: jobTitleColor,
    },
    headingFontStyle: {
      fontSize: `${headingFontSizeVal}px`,
      color: headingTextColor,
    },
    headingFontSizeVal,
    nameFontSizeVal,
    lineHeightClass,
    lineHeightVal,
    pageMarginClass,
    pagePaddingStyle,
    fontScaleClass,
    headingBaseClass,
    delimiterSymbol,
    accentColor,
    nameColor,
    jobTitleColor,
    headingTextColor,
    headingBorderColor,
    linkUnderlineClass,
    linkColorStyle,
    showLinkIcon,
  };
}

/**
 * Pre-defined spacing presets
 */
export const SPACING_PRESETS = {
  fitToOnePage: {
    fontScale: "compact", // 9pt
    lineHeight: "tight", // 1.25
    sectionSpacing: 12, // 12px
    entrySpacing: 8, // 8px
    pageMargin: "compact", // 15mm
  },
  defaultBalanced: {
    fontScale: "normal", // 10pt
    lineHeight: "normal", // 1.45
    sectionSpacing: 18, // 18px
    entrySpacing: 12, // 12px
    pageMargin: "normal", // 20mm
  },
  spacious: {
    fontScale: "spacious", // 11pt
    lineHeight: "relaxed", // 1.65
    sectionSpacing: 24, // 24px
    entrySpacing: 16, // 16px
    pageMargin: "spacious", // 25mm
  },
};

/**
 * Calculate dynamic contrast text color (dark charcoal or pure white) based on background hex
 * Uses standard ITU-R BT.709 / YIQ relative luminance formula
 */
export function getContrastTextColor(hexColor) {
  if (!hexColor || typeof hexColor !== "string") return "#FFFFFF";
  let cleanHex = hexColor.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) return "#FFFFFF";

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return "#FFFFFF";

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "#111827" : "#FFFFFF";
}
