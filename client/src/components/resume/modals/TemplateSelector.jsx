import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";

const templates = [
  { id: "modern", name: "Modern", desc: "Clean, dark headers, structured sidebar layout. Great for Tech & Design.", tag: "Popular" },
  { id: "classic", name: "Classic", desc: "Traditional centered serif typography. Ideal for Finance, Law & Academia.", tag: "Traditional" },
  { id: "minimal", name: "Minimal", desc: "Ultra-sleek single column layout with generous white space.", tag: "Clean" },
  { id: "professional", name: "Professional", desc: "Executive banner header with competencies grid. Perfect for Management.", tag: "Executive" },
];

export function TemplateSelector({ isOpen, onClose }) {
  const { resume, setTemplate } = useResume();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Select Resume Template</h3>
              <p className="text-xs text-gray-500">Choose a layout style that best highlights your career story.</p>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tpl) => {
              const isSelected = resume.template === tpl.id;

              return (
                <div
                  key={tpl.id}
                  onClick={() => {
                    setTemplate(tpl.id);
                    onClose();
                  }}
                  className={`relative p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-black bg-gray-50 shadow-md"
                      : "border-gray-200 hover:border-gray-400 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{tpl.tag}</span>
                      {isSelected && (
                        <span className="bg-black text-white p-1 rounded-full">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-gray-900">{tpl.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{tpl.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-500">ATS Optimized</span>
                    <span className={`text-xs font-bold ${isSelected ? "text-black" : "text-gray-400"}`}>
                      {isSelected ? "Active Template" : "Use Template →"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default TemplateSelector;
