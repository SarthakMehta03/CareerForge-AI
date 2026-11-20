import React from "react";
import logoLight from "../../assets/logo-light.svg";
import logoDark from "../../assets/logo-dark.svg";

/**
 * BrandLogo renders the CareerForge-AI logo mark according to the active theme.
 * - In light theme: displays the light mode SVG.
 * - In dark theme: displays the dark mode SVG.
 * Switches seamlessly via CSS (dark: classes) without layout shifts or theme flashes.
 * Preserves original aspect ratio and accessibility with appropriate alt text.
 */
export function BrandLogo({ className = "w-9 h-9 sm:w-10 sm:h-10", alt = "CareerForge-AI" }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Light mode logo */}
      <img
        src={logoLight}
        alt={alt}
        className="w-full h-full object-contain dark:hidden transition-transform duration-200 group-hover:scale-105"
        loading="eager"
        decoding="async"
      />

      {/* Dark mode logo */}
      <img
        src={logoDark}
        alt={alt}
        className="w-full h-full object-contain hidden dark:block transition-transform duration-200 group-hover:scale-105"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export default BrandLogo;
