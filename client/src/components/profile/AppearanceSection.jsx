import React from "react";
import { Sun, Moon, Monitor, Palette, Sparkles, CheckCircle2 } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

function AppearanceSection() {
  const { theme, resolvedTheme } = useTheme();

  const themeDescriptions = {
    light: "Crisp, bright interface optimized for well-lit environments and daylight productivity.",
    dark: "Sleek, low-contrast dark interface designed for reduced eye strain during evening sessions.",
    system: "Automatically synchronizes with your device operating system display preferences.",
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors">
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black transition-colors">
          <Palette size={19} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appearance & Display
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose your preferred theme across CareerForge AI.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Interface Theme
          </label>
          <div className="max-w-md">
            <ThemeToggle variant="segmented" />
          </div>
        </div>

        {/* Current Theme Info Pill */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 capitalize">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              Current Setting: {theme} {theme === "system" ? `(${resolvedTheme} active)` : ""}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
              Auto-persisted
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {themeDescriptions[theme]}
          </p>
        </div>

        {/* Note on Resume Document protection */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200">
          <Sparkles size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Professional Resume Export Protection:</strong> Your resume paper documents and exported PDFs always remain strictly white-sheet documents with black/formatted ink, regardless of your dark mode setting.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppearanceSection;
