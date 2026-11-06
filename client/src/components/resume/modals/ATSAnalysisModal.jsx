import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Key,
  AlignLeft,
  Plus,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  FileCheck2,
} from "lucide-react";
import { useResume } from "../../../context/ResumeContext";
import { analyzeATS } from "../../../services/resumeService";
import { calculateClientATS } from "../../../utils/atsCalculator";
import toast from "react-hot-toast";

export function ATSAnalysisModal({ isOpen, onClose }) {
  const { resume, setResume } = useResume();
  const [loading, setLoading] = useState(false);
  const [atsData, setAtsData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      runAnalysis();
    }
  }, [isOpen]);

  const runAnalysis = async () => {
    try {
      setLoading(true);
      const res = await analyzeATS(resume);
      if (res?.data?.success && res.data.atsScore) {
        setAtsData(res.data);
      } else {
        const local = calculateClientATS(resume);
        setAtsData(local);
      }
    } catch (err) {
      console.warn("ATS backend call failed, using client engine:", err.message);
      const local = calculateClientATS(resume);
      setAtsData(local);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeywordToSkills = (keyword) => {
    const existing = (resume.skills || []).map((s) => (typeof s === "object" ? s.name || "" : String(s || "")).toLowerCase());
    if (existing.includes(keyword.toLowerCase())) {
      toast("Keyword already in your skills!");
      return;
    }

    const newSkillObj = {
      id: `skill_${Date.now()}_${Math.random()}`,
      name: keyword,
      category: "Technical Skills",
      level: "Intermediate",
    };

    setResume((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), newSkillObj],
    }));
    toast.success(`Added "${keyword}" to skills!`);
  };

  if (!isOpen) return null;

  const score = atsData?.atsScore ?? 0;
  const scoreColor =
    score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-500" : "text-rose-500";
  const scoreBg =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500";

  const sub = atsData?.subScores || {
    structure: { score: 20, max: 25, label: "Structure & Contact", percentage: 80 },
    impact: { score: 14, max: 25, label: "Measurable Impact (Metrics)", percentage: 56 },
    actionVerbs: { score: 18, max: 25, label: "Action Verbs & Tone", percentage: 72 },
    skills: { score: 18, max: 25, label: "Domain Keywords & Skills", percentage: 72 },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                <ShieldCheck size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">ATS Resume Compatibility Score</h3>
                <p className="text-xs text-gray-500">Recruiter parsing algorithms & keyword readiness breakdown</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw size={36} className="animate-spin text-black" />
              <p className="text-sm font-bold text-gray-800">Evaluating ATS parseability & metrics...</p>
              <p className="text-xs text-gray-400 max-w-sm">
                Analyzing contact completeness, measurable numbers, power verbs, and domain-specific keywords.
              </p>
            </div>
          ) : atsData ? (
            <div className="space-y-5">
              {/* Overall Score Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-5 rounded-2xl shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Overall ATS Readiness Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className={`text-4xl font-black ${scoreColor}`}>{score}</span>
                      <span className="text-base font-bold text-gray-400">/ 100</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-2 ${
                        score >= 80 ? "bg-emerald-100 text-emerald-800" : score >= 60 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {score >= 80 ? "Excellent" : score >= 60 ? "Good Baseline" : "Needs Action"}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mt-1.5">
                      {score >= 80
                        ? "🎉 Outstanding parseability! High likelihood of passing automated enterprise ATS filters."
                        : score >= 60
                        ? "👍 Solid foundation. Add measurable metrics and missing domain keywords below to hit 85+."
                        : "⚠️ Missing key metrics or keywords. Review the recommendations below to avoid being filtered out."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={runAnalysis}
                    className="self-start sm:self-center flex items-center gap-1.5 text-xs font-bold text-black bg-white border border-gray-300 hover:bg-gray-100 px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                  >
                    <RefreshCw size={13} />
                    <span>Re-evaluate</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-4">
                  <div
                    className={`h-full ${scoreBg} transition-all duration-500`}
                    style={{ width: `${Math.min(score, 100)}%` }}
                  />
                </div>
              </div>

              {/* 4 Pillars Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-gray-600" />
                  <span>The 4 ATS Pillars Breakdown</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(sub).map(([key, pillar]) => (
                    <div key={key} className="bg-gray-50 border border-gray-200/90 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-gray-800 truncate mr-2">{pillar.label}</span>
                        <span className="text-xs font-black text-gray-900 shrink-0">
                          {pillar.score} <span className="text-gray-400 font-normal">/ {pillar.max}</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            (pillar.score / pillar.max) >= 0.8
                              ? "bg-emerald-500"
                              : (pillar.score / pillar.max) >= 0.6
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${Math.min(Math.round((pillar.score / pillar.max) * 100), 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measurable Metrics & Bullet Stats */}
              {atsData.totalBulletsCount !== undefined && (
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {atsData.quantifiedBulletsCount || 0}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-950">Quantifiable Metrics Audit</p>
                      <p className="text-[11px] text-blue-800">
                        {atsData.quantifiedBulletsCount || 0} of {atsData.totalBulletsCount || 0} bullets contain measurable numbers (%, $, x).
                        {atsData.quantifiedBulletsCount === 0 && " Employers heavily prefer quantified achievements!"}
                      </p>
                    </div>
                  </div>
                  {atsData.metricsFound && atsData.metricsFound.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {atsData.metricsFound.map((m, i) => (
                        <span key={i} className="text-[10px] font-bold bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Passive Phrases Warning */}
              {atsData.weakPhrasesFound && atsData.weakPhrasesFound.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1 text-amber-900 font-bold text-xs">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span>Passive Words to Replace ({atsData.weakPhrasesFound.length})</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mb-2">
                    Recruiters favor decisive action verbs over passive phrasing. Replace these detected phrases:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {atsData.weakPhrasesFound.map((w, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-white text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-md">
                        "{w}" → use <em>Engineered</em> / <em>Architected</em>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Domain ATS Keywords with 1-Click Add */}
              {atsData.missingKeywords && atsData.missingKeywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Key size={14} className="text-gray-700" />
                      <span>Missing High-Impact Keywords ({atsData.missingKeywords.length})</span>
                    </span>
                    <span className="text-[10px] font-normal text-gray-500 lowercase">Click to add to your skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {atsData.missingKeywords.map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddKeywordToSkills(kw)}
                        className="text-[11px] font-semibold text-gray-800 bg-white hover:bg-gray-100 border border-gray-300 hover:border-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1 transition cursor-pointer shadow-2xs"
                        title="Click to add this keyword to your resume skills"
                      >
                        <Plus size={11} className="text-emerald-600" />
                        <span>{kw}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {atsData.strengths && atsData.strengths.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Verified Strengths ({atsData.strengths.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {atsData.strengths.map((str, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-gray-700 bg-emerald-50/60 border border-emerald-200/60 p-2.5 rounded-xl flex items-start gap-2"
                      >
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Recommendations */}
              {atsData.recommendations && atsData.recommendations.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-blue-500" />
                    <span>Actionable Next Steps</span>
                  </h4>
                  <div className="space-y-1.5">
                    {atsData.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-gray-700 bg-blue-50/60 border border-blue-200/60 p-2.5 rounded-xl flex items-start gap-2"
                      >
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formatting Advice */}
              {atsData.formattingIssues && atsData.formattingIssues.length > 0 && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <h5 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlignLeft size={13} className="text-gray-600" />
                    <span>ATS Layout & Formatting Rules</span>
                  </h5>
                  <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                    {atsData.formattingIssues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 text-xs">
              Unable to load analysis. Please click Re-evaluate.
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ATSAnalysisModal;
