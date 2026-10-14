import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import { matchJobDescription } from "../../../services/resumeService";

export function JobMatchModal({ isOpen, onClose }) {
  const { resume } = useResume();
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  if (!isOpen) return null;

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first.");
      return;
    }

    try {
      setLoading(true);
      const res = await matchJobDescription(resume, jobDescription);
      if (res.data.success) {
        setMatchResult(res.data);
        toast.success("Job match analysis complete!");
      }
    } catch (err) {
      toast.error("Job match failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-h-[85vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                <Target size={16} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Job Description Match Analysis</h3>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <X size={20} />
            </button>
          </div>

          {!matchResult ? (
            <form onSubmit={handleMatch} className="space-y-4">
              <p className="text-xs text-gray-600">
                Paste the target job description below. AI will analyze key requirements, missing keywords, and skill alignment.
              </p>

              <textarea
                rows={7}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting description here (e.g. We are looking for a Senior Software Engineer proficient in React, Node.js, AWS...)"
                className="w-full rounded-xl border border-gray-300 p-3 text-xs text-gray-900 focus:border-black outline-none transition"
              />

              <button
                type="submit"
                disabled={loading || !jobDescription.trim()}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Target size={14} />}
                <span>Calculate Match Score</span>
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Target Job Match</p>
                  <h4 className="text-3xl font-black text-gray-900 mt-1">{matchResult.matchScore}%</h4>
                </div>

                <button
                  type="button"
                  onClick={() => setMatchResult(null)}
                  className="text-xs font-bold text-black bg-white border border-gray-300 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
                >
                  Test Another Job
                </button>
              </div>

              {/* Matching Skills */}
              {matchResult.matchingSkills && matchResult.matchingSkills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-green-600" />
                    Matching Skills ({matchResult.matchingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matchingSkills.map((sk, i) => (
                      <span key={i} className="bg-green-100 border border-green-300 text-green-900 text-xs px-2.5 py-0.5 rounded font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle size={15} className="text-amber-500" />
                    Missing / Desired Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingSkills.map((sk, i) => (
                      <span key={i} className="bg-amber-50 border border-amber-300 text-amber-900 text-xs px-2.5 py-0.5 rounded font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {matchResult.suggestions && matchResult.suggestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Tailoring Suggestions</h4>
                  <ul className="space-y-1 text-xs text-gray-700 list-disc pl-4">
                    {matchResult.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default JobMatchModal;
