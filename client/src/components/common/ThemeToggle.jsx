import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const THEME_OPTIONS = [
  { id: "light", label: "Light", icon: Sun, description: "Crisp white interface" },
  { id: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes" },
  { id: "system", label: "System", icon: Laptop, description: "Match device setting" },
];

/**
 * Accessible Light / Dark / System Theme Toggle Component
 *
 * @param {'dropdown' | 'segmented' | 'button'} variant
 * @param {string} className
 * @param {boolean} showLabel - Whether to show the active label next to the icon in dropdown button
 */
export function ThemeToggle({
  variant = "dropdown",
  className = "",
  showLabel = false,
  align = "right",
}) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const CurrentIcon =
    theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;

  // 1. SEGMENTED VARIANT (for Settings / Profile pages)
  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Theme preference"
        className={`inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 ${className}`}
      >
        {THEME_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(opt.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-black dark:focus:ring-white ${
                isSelected
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs border border-gray-200/80 dark:border-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <Icon size={14} className={isSelected ? "text-black dark:text-white" : ""} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. BUTTON ONLY VARIANT (cycles through themes)
  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Current theme: ${theme}. Click to change theme.`}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to switch)`}
        className={`p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-black dark:focus:ring-white ${className}`}
      >
        <CurrentIcon size={16} className="transition-transform active:rotate-45" />
      </button>
    );
  }

  // 3. DROPDOWN VARIANT (Default: Compact button with popup menu)
  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Theme settings. Current: ${theme} (${resolvedTheme} active)`}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold transition cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-black dark:focus:ring-white shadow-2xs"
      >
        <CurrentIcon size={15} className="text-gray-700 dark:text-gray-300" />
        {showLabel && (
          <span className="capitalize hidden sm:inline text-xs">
            {theme}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Theme options"
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-44 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 focus:outline-hidden`}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
            Appearance
          </div>

          <div className="p-1 space-y-0.5">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  role="menuitemradio"
                  aria-checked={isSelected}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={15} className={isSelected ? "text-black dark:text-white" : "text-gray-400"} />
                    <span>{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check size={14} className="text-black dark:text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
