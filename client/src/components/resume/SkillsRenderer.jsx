import React from "react";
import { HighlightText } from "./HighlightText";
import { getContrastTextColor } from "../../utils/themeStyles";

const LEVEL_MAP = {
  Beginner: { dots: 2, percent: 35 },
  Intermediate: { dots: 3, percent: 60 },
  Advanced: { dots: 4, percent: 85 },
  Expert: { dots: 5, percent: 100 },
  Master: { dots: 5, percent: 100 },
};

/**
 * Parses and groups skills intelligently:
 * 1. Automatically detects embedded category prefixes like "Programming Languages: Dart", "Frontend Development: Flutter"
 * 2. Recognizes explicit categories in skill objects (`skill.category`)
 * 3. Normalizes skill names so "Programming Languages: Dart" becomes category "Programming Languages" and skill name "Dart"
 * 4. Returns `{ groups: [{ category, items }], hasCategories: boolean }`
 */
export function parseAndGroupSkills(skills = []) {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return { groups: [], hasCategories: false };
  }

  // Check if any skill starts with "Category: SkillName"
  let hasColonPrefixes = false;
  skills.forEach((s) => {
    const name = typeof s === "object" ? (s.name || "") : String(s || "");
    if (/^[^:]{2,35}:\s*.+$/.test(name)) {
      hasColonPrefixes = true;
    }
  });

  // Check if skills have explicit distinct category fields
  const categoriesInObj = new Set();
  skills.forEach((s) => {
    if (
      typeof s === "object" &&
      s.category &&
      s.category.trim() &&
      s.category !== "Technical" &&
      s.category !== "Other / Core"
    ) {
      categoriesInObj.add(s.category.trim());
    }
  });
  const hasExplicitCategories = categoriesInObj.size > 1;

  if (hasColonPrefixes) {
    let activeCat = "Technical Skills";
    const groupsMap = new Map();

    skills.forEach((s, idx) => {
      const rawName = typeof s === "object" ? (s.name || "") : String(s || "");
      const colonMatch = rawName.match(/^([^:]{2,35}):\s*(.+)$/);
      let skillName = rawName.trim();

      if (colonMatch) {
        activeCat = colonMatch[1].trim();
        skillName = colonMatch[2].trim();
      }

      if (!groupsMap.has(activeCat)) groupsMap.set(activeCat, []);
      groupsMap.get(activeCat).push({
        ...(typeof s === "object" ? s : {}),
        id: (typeof s === "object" && s.id) ? s.id : `skill_${idx}`,
        name: skillName,
        category: activeCat,
        level: (typeof s === "object" && s.level) ? s.level : "Intermediate",
      });
    });

    const groups = Array.from(groupsMap.entries()).map(([category, items]) => ({
      category,
      items,
    }));
    return { groups, hasCategories: true };
  }

  if (hasExplicitCategories) {
    const groupsMap = new Map();
    skills.forEach((s, idx) => {
      const cat =
        typeof s === "object" && s.category && s.category.trim()
          ? s.category.trim()
          : "Other / Core";
      const name = typeof s === "object" ? (s.name || "") : String(s || "");
      if (!groupsMap.has(cat)) groupsMap.set(cat, []);
      groupsMap.get(cat).push({
        ...(typeof s === "object" ? s : {}),
        id: (typeof s === "object" && s.id) ? s.id : `skill_${idx}`,
        name,
        category: cat,
        level: (typeof s === "object" && s.level) ? s.level : "Intermediate",
      });
    });
    const groups = Array.from(groupsMap.entries()).map(([category, items]) => ({
      category,
      items,
    }));
    return { groups, hasCategories: true };
  }

  // Flat skills list
  const flatItems = skills.map((s, idx) => ({
    ...(typeof s === "object" ? s : {}),
    id: (typeof s === "object" && s.id) ? s.id : `skill_${idx}`,
    name: typeof s === "object" ? (s.name || "") : String(s || ""),
    category: (typeof s === "object" && s.category) ? s.category : "Technical",
    level: (typeof s === "object" && s.level) ? s.level : "Intermediate",
  }));

  return {
    groups: [{ category: null, items: flatItems }],
    hasCategories: false,
  };
}

export function SkillsRenderer({ skills = [], theme = {}, highlightKeywords = [] }) {
  if (!skills || skills.length === 0) return null;

  const { groups, hasCategories } = parseAndGroupSkills(skills);
  if (groups.length === 0) return null;

  // Default to professional inline categorized format ("inline")
  // User can choose 'inline' | 'pills' | 'dots' | 'bars' | 'compact'
  const style = theme.skillDisplay || theme.skillStyle || (hasCategories ? "inline" : "inline");
  const primaryColor = theme.primaryColor || "#000000";
  const isFilledPill = theme.skillBadgeStyle === "filled" || theme.accentTargets?.skills;
  const contrastColor = getContrastTextColor(primaryColor);
  const delimiter = theme.skillDelimiter || "comma"; // 'comma' | 'bullet' | 'pipe'

  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;

  const sepChar = delimiter === "bullet" ? " • " : delimiter === "pipe" ? " | " : ", ";

  // 1. PROFESSIONAL INLINE / CATEGORIZED FORMAT (Executive Gold Standard)
  if (style === "inline" || style === "text" || style === "clean" || style === "compact") {
    if (hasCategories) {
      return (
        <div className="space-y-1.5 text-[12px] leading-relaxed text-gray-800">
          {groups.map(({ category, items }) => (
            <div key={category} className="resume-entry flex flex-wrap items-baseline gap-x-1.5">
              <span className="font-bold text-gray-900 tracking-tight shrink-0 select-text">
                {category}:
              </span>
              <span className="text-gray-700">
                {items.map((skill, idx) => (
                  <React.Fragment key={skill.id || idx}>
                    <span className="font-medium text-gray-800 select-text">{H(skill.name)}</span>
                    {theme.showSkillLevel && skill.level && skill.level !== "Intermediate" && (
                      <span className="text-gray-400 text-[10px] ml-0.5">({skill.level})</span>
                    )}
                    {idx < items.length - 1 && (
                      <span className="text-gray-400 font-normal mr-1.5">,</span>
                    )}
                  </React.Fragment>
                ))}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Flat inline list
    return (
      <div className="resume-entry text-[12px] leading-relaxed text-gray-800 flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {groups[0].items.map((skill, idx) => (
          <React.Fragment key={skill.id || idx}>
            <span className="font-medium text-gray-800 select-text">{H(skill.name)}</span>
            {theme.showSkillLevel && skill.level && skill.level !== "Intermediate" && (
              <span className="text-gray-400 text-[10px] ml-0.5">({skill.level})</span>
            )}
            {idx < groups[0].items.length - 1 && (
              <span className="text-gray-300 font-bold select-none">{sepChar}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // 2. MODERN REFINED BADGES / PILLS
  if (style === "pills" || style === "badges" || style === "tags") {
    if (hasCategories) {
      return (
        <div className="space-y-2 pt-0.5">
          {groups.map(({ category, items }) => (
            <div key={category} className="resume-entry flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-bold text-gray-900 text-xs shrink-0 sm:min-w-[130px] select-text">
                {category}:
              </span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {items.map((skill) => (
                  <span
                    key={skill.id}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium inline-flex items-center gap-1 transition-colors select-text ${
                      isFilledPill ? "" : "bg-gray-50 border border-gray-200/80 text-gray-800"
                    }`}
                    style={
                      isFilledPill
                        ? { backgroundColor: primaryColor, color: contrastColor }
                        : {}
                    }
                  >
                    <span>{H(skill.name)}</span>
                    {theme.showSkillLevel && skill.level && (
                      <span className={`text-[9px] font-normal ${isFilledPill ? "opacity-80" : "text-gray-400"}`}>
                        • {skill.level}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Flat badges
    return (
      <div className="resume-entry flex flex-wrap gap-1.5 pt-0.5">
        {groups[0].items.map((skill) => (
          <span
            key={skill.id}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium inline-flex items-center gap-1 transition-colors select-text ${
              isFilledPill ? "" : "bg-gray-50 border border-gray-200/80 text-gray-800"
            }`}
            style={
              isFilledPill
                ? { backgroundColor: primaryColor, color: contrastColor }
                : {}
            }
          >
            <span>{H(skill.name)}</span>
            {theme.showSkillLevel && skill.level && (
              <span className={`text-[9px] font-normal ${isFilledPill ? "opacity-80" : "text-gray-400"}`}>
                • {skill.level}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  }

  // 3. PROFICIENCY DOTS
  if (style === "dots") {
    return (
      <div className="space-y-3 pt-0.5">
        {groups.map(({ category, items }) => (
          <div key={category || "flat"} className="space-y-1">
            {category && (
              <div className="text-xs font-bold text-gray-900 tracking-tight pb-0.5 border-b border-gray-100">
                {category}
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 pt-0.5">
              {items.map((skill) => {
                const lvl = LEVEL_MAP[skill.level] || { dots: 3, percent: 60 };
                return (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between text-[11px] py-0.5 border-b border-gray-50"
                  >
                    <span className="font-semibold text-gray-900 truncate mr-2 select-text">
                      {H(skill.name)}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map((i) => {
                        const isFilled = i <= lvl.dots;
                        return (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full transition-colors"
                            style={{
                              backgroundColor: isFilled ? primaryColor : "#E5E7EB",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 4. PROGRESS BARS
  if (style === "bars") {
    return (
      <div className="space-y-3 pt-0.5">
        {groups.map(({ category, items }) => (
          <div key={category || "flat"} className="space-y-1.5">
            {category && (
              <div className="text-xs font-bold text-gray-900 tracking-tight pb-0.5 border-b border-gray-100">
                {category}
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-0.5">
              {items.map((skill) => {
                const lvl = LEVEL_MAP[skill.level] || { dots: 3, percent: 60 };
                return (
                  <div key={skill.id} className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 truncate select-text">
                        {H(skill.name)}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0 font-medium ml-1">
                        {skill.level || "Intermediate"}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${lvl.percent}%`,
                          backgroundColor: primaryColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default SkillsRenderer;
