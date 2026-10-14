import React, { useState } from "react";
import { Sparkles, Target, CheckCircle2, Lightbulb, RefreshCw, Wand2, FileSearch } from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import { analyzeATS, matchJobDescription, generateSummary, suggestSkills } from "../../../services/resumeService";
import { calculateClientATS } from "../../../utils/atsCalculator";

export function AIToolsPanel() {
  const { resume, setResume } = useResume();
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsData, setAtsData] = useState(null);

  const [jobDesc, setJobDesc] = useState("");
  const [jobMatchLoading, setJobMatchLoading] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState(null);

  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [suggestSkillsLoading, setSuggestSkillsLoading] = useState(false);

  const handleRunATS = async () => {
    try {
      setAtsLoading(true);
      const res = await analyzeATS(resume);
      if (res?.data?.success) {
        setAtsData(res.data);
        toast.success("ATS Analysis completed!");
      } else {
        const local = calculateClientATS(resume);
        setAtsData(local);
        toast.success("ATS Analysis completed!");
      }
    } catch (err) {
      console.warn("ATS backend call error, falling back to local heuristic:", err.message);
      const local = calculateClientATS(resume);
      setAtsData(local);
      toast.success("ATS Analysis completed!");
    } finally {
      setAtsLoading(false);
    }
  };

  const handleMatchJob = async () => {
    if (!jobDesc.trim()) {
      toast.error("Please paste a job description first");
      return;
    }
    try {
      setJobMatchLoading(true);
      const res = await matchJobDescription(resume, jobDesc);
      if (res.data.success && res.data.result) {
        setJobMatchResult(res.data.result);
        toast.success("Job match analysis completed!");
      }
    } catch (err) {
      toast.error("Failed to match job description");
    } finally {
      setJobMatchLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setAiSummaryLoading(true);
      const res = await generateSummary(resume);
      if (res.data.success && res.data.result) {
        setResume((prev) => ({ ...prev, summary: res.data.result }));
        toast.success("AI Professional Summary updated!");
      }
    } catch (err) {
      toast.error("Failed to generate summary");
    } finally {
      setAiSummaryLoading(false);
    }
  };

  const handleSuggestSkills = async () => {
    try {
      setSuggestSkillsLoading(true);
      const res = await suggestSkills(resume);
      if (res.data.success && res.data.skills) {
        const existingNames = (resume.skills || []).map((s) => s.name.toLowerCase());
        const newSkills = res.data.skills
          .filter((name) => !existingNames.includes(name.toLowerCase()))
          .map((name) => ({ id: Math.random().toString(), name, category: "Technical" }));

        if (newSkills.length > 0) {
          setResume((prev) => ({
            ...prev,
            skills: [...(prev.skills || []), ...newSkills],
          }));
          toast.success(`Added ${newSkills.length} suggested skills!`);
        } else {
          toast("No new skills to add.");
        }
      }
    } catch (err) {
      toast.error("Failed to suggest skills");
    } finally {
      setSuggestSkillsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI Enhancement Suite</h2>
            <p className="text-xs text-gray-500">Analyze ATS parseability, match job descriptions, and write AI content.</p>
          </div>
        </div>
      </div>

      {/* 1. ATS Score & Analysis Tool */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <FileSearch size={15} className="text-gray-900" />
            <span>ATS Compatibility Analysis</span>
          </h3>

          <button
            type="button"
            onClick={handleRunATS}
            disabled={atsLoading}
            className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {atsLoading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
            <span>{atsData ? "Re-analyze" : "Run ATS Analysis"}</span>
          </button>
        </div>

        {atsData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-xl">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ATS Optimization Score</p>
                <h4 className="text-2xl font-black text-gray-900 mt-0.5">{atsData.atsScore} / 100</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {atsData.atsScore >= 80 ? "🎉 Excellent ATS parseability!" : atsData.atsScore >= 60 ? "👍 Good baseline resume. Needs minor tweaks." : "⚠️ Requires optimization."}
                </p>
              </div>
            </div>

            {atsData.strengths && atsData.strengths.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-600" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {atsData.strengths.map((str, i) => (
                    <li key={i} className="text-xs text-gray-700 bg-green-50/60 border border-green-200/60 p-2 rounded-lg">
                      {str}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {atsData.recommendations && atsData.recommendations.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-500" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {atsData.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-gray-700 bg-amber-50/60 border border-amber-200/60 p-2 rounded-lg">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl">
            <Sparkles size={24} className="mx-auto text-amber-500 mb-2" />
            <p className="text-xs text-gray-600 font-medium">Click "Run ATS Analysis" above to score your resume formatting and parseability.</p>
          </div>
        )}
      </div>

      {/* 2. Job Description Match Tool */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <Target size={15} className="text-gray-900" />
          <span>Match Target Job Description</span>
        </h3>

        <textarea
          rows={4}
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste job posting text here to analyze keyword match..."
          className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-black outline-none transition mb-3"
        />

        <button
          type="button"
          onClick={handleMatchJob}
          disabled={jobMatchLoading || !jobDesc.trim()}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {jobMatchLoading ? <RefreshCw size={14} className="animate-spin" /> : <Target size={14} />}
          <span>Analyze Job Description Match</span>
        </button>

        {jobMatchResult && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-gray-900">Analysis Results</h4>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{jobMatchResult}</p>
          </div>
        )}
      </div>

      {/* 3. Quick AI Generators */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <Wand2 size={15} className="text-gray-900" />
          <span>Quick AI Content Actions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={aiSummaryLoading}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-black bg-gray-50 hover:bg-white text-xs font-semibold text-gray-900 transition cursor-pointer disabled:opacity-50"
          >
            <span>Auto-Generate Summary</span>
            {aiSummaryLoading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} className="text-amber-500" />}
          </button>

          <button
            type="button"
            onClick={handleSuggestSkills}
            disabled={suggestSkillsLoading}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-black bg-gray-50 hover:bg-white text-xs font-semibold text-gray-900 transition cursor-pointer disabled:opacity-50"
          >
            <span>Suggest Relevant Skills</span>
            {suggestSkillsLoading ? <RefreshCw size={13} className="animate-spin" /> : <Wand2 size={13} className="text-gray-700" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIToolsPanel;
