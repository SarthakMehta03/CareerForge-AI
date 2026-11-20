import React from "react";

export function ContactItem({
  icon: Icon,
  text,
  href,
  theme = {},
  accentColor = "#000000",
  delimiter = "",
  isFirst = false,
}) {
  if (!text) return null;

  const showIcon = theme.linkIcon !== false && Icon;
  const isLink = Boolean(href);
  const linkUnderlineClass = theme.linkUnderline ? "underline" : "no-underline";
  const linkColorStyle = theme.linkBlue ? { color: "#2563eb" } : undefined;

  const content = isLink ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:opacity-80 transition-opacity ${linkUnderlineClass}`}
      style={linkColorStyle}
    >
      {text}
    </a>
  ) : (
    <span>{text}</span>
  );

  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      {!isFirst && delimiter && (
        <span className="text-gray-400 select-none mr-0.5">{delimiter}</span>
      )}
      {showIcon && <Icon size={12} style={{ color: accentColor }} className="shrink-0" />}
      {content}
    </span>
  );
}

export default ContactItem;
