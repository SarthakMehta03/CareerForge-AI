import { useState } from "react";
import { BookOpen, MessageSquare, Copy, Check, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Stacked vertical fraction component (e.g. 1 over 15 with horizontal divider)
 */
export function StackedFraction({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
      <span className="border-b border-gray-800 px-1 pb-0.5 text-center whitespace-nowrap">
        {num}
      </span>
      <span className="pt-0.5 px-1 text-center whitespace-nowrap">
        {den}
      </span>
    </span>
  );
}

/**
 * Tall parentheses container that elegantly frames stacked fractions
 */
export function MathParentheses({ children }) {
  return (
    <span className="inline-flex items-center align-middle mx-1">
      <span className="text-2xl sm:text-3xl font-light text-gray-500 select-none leading-none -mr-0.5">
        (
      </span>
      <span className="inline-flex items-center px-0.5 text-sm sm:text-base font-medium text-gray-900">
        {children}
      </span>
      <span className="text-2xl sm:text-3xl font-light text-gray-500 select-none leading-none -ml-0.5">
        )
      </span>
    </span>
  );
}

/**
 * Parses simple fractions like 1/15, 7/60, 8/15 in a text string
 */
function parseFractionsInSpan(text, keyPrefix = "frac") {
  const fracRegex = /\b(\d+|[a-zA-Z]+)\s*\/\s*(\d+|[a-zA-Z]+)\b/g;
  let lastIdx = 0;
  let match;
  const nodes = [];

  while ((match = fracRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(
        <span key={`${keyPrefix}-t-${lastIdx}`}>
          {text.slice(lastIdx, match.index)}
        </span>
      );
    }
    nodes.push(
      <StackedFraction
        key={`${keyPrefix}-f-${match.index}`}
        num={match[1]}
        den={match[2]}
      />
    );
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) {
    nodes.push(
      <span key={`${keyPrefix}-t-${lastIdx}`}>
        {text.slice(lastIdx)}
      </span>
    );
  }
  return nodes.length > 0 ? nodes : text;
}

/**
 * Parses content inside parentheses (e.g. "1/15 + 1/20" or "1200 x R x R / 100")
 */
function parseParenContent(inner, keyPrefix = "paren") {
  const slashCount = (inner.match(/\//g) || []).length;
  if (slashCount === 1) {
    const bigFracMatch = inner.match(/^\s*([^()=]+?)\s*\/\s*(\d+|[a-zA-Z]+)\s*$/);
    if (
      bigFracMatch &&
      (bigFracMatch[1].includes("x") ||
        bigFracMatch[1].includes("×") ||
        bigFracMatch[1].includes("*"))
    ) {
      return (
        <StackedFraction
          key={`${keyPrefix}-big`}
          num={bigFracMatch[1].trim()}
          den={bigFracMatch[2].trim()}
        />
      );
    }
  }
  return parseFractionsInSpan(inner, keyPrefix);
}

/**
 * Renders an entire mathematical line supporting parentheses, fractions, ⇒, and ∴
 */
function MathLine({ line, lineIdx }) {
  const parenRegex = /\(([^()]+)\)/g;
  let lastIdx = 0;
  let match;
  const nodes = [];

  while ((match = parenRegex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      const textChunk = line.slice(lastIdx, match.index);
      nodes.push(
        <span key={`l-${lineIdx}-txt-${lastIdx}`}>
          {parseFractionsInSpan(textChunk, `l-${lineIdx}-c-${lastIdx}`)}
        </span>
      );
    }

    const inner = match[1].trim();
    if (inner.includes("/")) {
      nodes.push(
        <MathParentheses key={`l-${lineIdx}-paren-${match.index}`}>
          {parseParenContent(inner, `l-${lineIdx}-p-${match.index}`)}
        </MathParentheses>
      );
    } else {
      nodes.push(
        <span key={`l-${lineIdx}-rawparen-${match.index}`} className="font-normal text-gray-900">
          ({inner})
        </span>
      );
    }
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < line.length) {
    const textChunk = line.slice(lastIdx);
    nodes.push(
      <span key={`l-${lineIdx}-txt-${lastIdx}`}>
        {parseFractionsInSpan(textChunk, `l-${lineIdx}-end`)}
      </span>
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-y-2 text-sm sm:text-base text-gray-900 leading-relaxed font-normal">
      {nodes.length > 0 ? nodes : parseFractionsInSpan(line, `l-${lineIdx}`)}
    </div>
  );
}

function WorkedExampleCard({ example, exampleIndex }) {
  const [copied, setCopied] = useState(false);
  const { problem, options, correctOption, solution, explanation } = example;

  const rawSolution = solution || explanation || "";

  // Split lines cleanly
  const lines = rawSolution
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Determine correct option letter
  let correctLetter = correctOption || "";
  if (!correctLetter) {
    const optMatch = rawSolution.match(/Option\s+([A-D])/i);
    if (optMatch) {
      correctLetter = optMatch[1].toUpperCase();
    }
  }

  // Determine answer text if no letter
  let answerDisplay = "";
  if (correctLetter) {
    answerDisplay = correctLetter.replace(/^Option\s*/i, "").trim().toUpperCase();
  } else {
    const finalAnsMatch = rawSolution.match(/Final Answer:\s*(.+)/i);
    if (finalAnsMatch) {
      answerDisplay = finalAnsMatch[1].trim();
    }
  }

  const handleCopy = () => {
    let copyText = `Example ${exampleIndex}:\n${problem}\n`;
    if (options && options.length > 0) {
      copyText += options.map((o) => `(${o.id}) ${o.text}`).join("   ") + "\n";
    }
    if (correctLetter) {
      copyText += `Answer: Option (${correctLetter})\n\n`;
    } else if (answerDisplay) {
      copyText += `Answer: ${answerDisplay}\n\n`;
    }
    copyText += `Explanation:\n${rawSolution}`;

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    toast.success("Example copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActionToast = (label) => {
    toast(`${label} recorded.`, { icon: "ℹ️" });
  };

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
      {/* Question Header */}
      <div className="p-5 sm:p-6 bg-gray-50/70 border-b border-gray-200">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Example {exampleIndex}
        </span>
        <p className="text-sm sm:text-base font-semibold text-gray-900 leading-relaxed">
          {problem}
        </p>

        {/* Options list if provided */}
        {options && options.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            {options.map((opt, oIdx) => (
              <div
                key={oIdx}
                className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2 transition ${
                  opt.id === correctLetter
                    ? "border-emerald-300 bg-emerald-50/50 text-emerald-950 font-semibold"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <span className="font-bold text-gray-900">({opt.id})</span>
                <span className="inline-flex items-center">
                  {parseFractionsInSpan(opt.text, `opt-${oIdx}`)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer & Explanation Section (IndiaBIX / Classic Textbook Style) */}
      <div className="p-5 sm:p-6 bg-white space-y-4">
        {/* Answer Pill */}
        {correctLetter ? (
          <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#2e7d32]">
            <span>Answer:</span>
            <span>Option</span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#2e7d32] text-xs font-bold text-[#2e7d32] bg-emerald-50/60 shadow-2xs">
              {correctLetter}
            </span>
          </div>
        ) : answerDisplay ? (
          <div className="text-sm sm:text-base font-semibold text-[#2e7d32]">
            <span>Answer: </span>
            <span className="font-bold text-gray-900">{answerDisplay}</span>
          </div>
        ) : null}

        {/* Green Explanation Header */}
        <h4 className="text-[#2e7d32] font-bold text-sm sm:text-base tracking-normal pt-1">
          Explanation:
        </h4>

        {/* Formatted Calculation Lines */}
        <div className="space-y-4 text-gray-900 pl-0.5">
          {lines.map((line, lIdx) => {
            // Strip redundant "Final Answer:" from line list if already shown in Answer header
            if (line.startsWith("Final Answer:") && (correctLetter || answerDisplay)) {
              return null;
            }
            return <MathLine key={lIdx} line={line} lineIdx={lIdx} />;
          })}
        </div>

        {/* Bottom Action Icon Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => handleActionToast("Added to Study List")}
            className="w-8 h-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-black transition shadow-2xs cursor-pointer"
            title="Read concept notes"
            aria-label="Read concept notes"
          >
            <BookOpen size={14} />
          </button>

          <button
            type="button"
            onClick={() => handleActionToast("Community discussions")}
            className="w-8 h-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-black transition shadow-2xs cursor-pointer"
            title="View Discussion"
            aria-label="View Discussion"
          >
            <MessageSquare size={14} />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-8 h-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-black transition shadow-2xs cursor-pointer"
            title="Copy explanation"
            aria-label="Copy explanation"
          >
            {copied ? (
              <Check size={14} className="text-emerald-600" />
            ) : (
              <Copy size={14} />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleActionToast("Question reported")}
            className="w-8 h-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-black transition shadow-2xs cursor-pointer"
            title="Report issue"
            aria-label="Report issue"
          >
            <AlertTriangle size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkedExampleCard;

