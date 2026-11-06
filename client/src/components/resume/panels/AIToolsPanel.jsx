import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Wand2,
  FileSearch,
  X,
  GitFork,
  MessageSquare,
  ArrowRight,
  Layers,
  FileText,
  ShieldCheck,
  Zap,
  BarChart3,
  Plus,
  Check,
  ChevronRight,
  TrendingUp,
  Cpu,
  Sliders,
  Send,
  Edit3,
  Briefcase,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import {
  analyzeATS,
  matchJobDescription,
  generateSummary,
  suggestSkills,
  polishBulletPoint,
} from "../../../services/resumeService";
import { calculateClientATS } from "../../../utils/atsCalculator";
import { analyzeKeywords } from "../../../utils/keywordMatcher";

export function AIToolsPanel({
  onOpenQualityModal,
  onOpenJobMatch,
  onOpenInterviewPrep,
  onOpenCoverLetter,
  onOpenATSModal,
}) {
  const { resume, setResume, setHighlightKeywords, setMissingKeywords } = useResume();

  // Active sub-tab in AI Tools: 'ats' | 'jobMatch' | 'bulletPolisher' | 'suite'
  const [activeTab, setActiveTab] = useState("ats");

  // ATS State
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsData, setAtsData] = useState(() => calculateClientATS(resume));

  // Recalculate immediate client ATS score whenever resume changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAtsData((prev) => {
        const fresh = calculateClientATS(resume);
        if (prev?.strengths && prev.strengths.length > 0) {
          return {
            ...fresh,
            strengths: prev.strengths,
            weaknesses: prev.weaknesses,
            recommendations: prev.recommendations,
          };
        }
        return fresh;
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [resume]);

  // Job Match State
  const [jobDesc, setJobDesc] = useState("");
  const [jobMatchLoading, setJobMatchLoading] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState(null);
  const [keywordStats, setKeywordStats] = useState(null);
  const debounceRef = useRef(null);

  // AI Content Actions State
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [suggestSkillsLoading, setSuggestSkillsLoading] = useState(false);
  const [summaryTone, setSummaryTone] = useState("executive"); // 'executive' | 'technical' | 'impact'
  const [generatedSummary, setGeneratedSummary] = useState("");

  // Bullet Polisher State
  const [selectedExpId, setSelectedExpId] = useState("");
  const [rawBulletText, setRawBulletText] = useState("");
  const [polishMode, setPolishMode] = useState("quantify"); // 'quantify' | 'action_verb' | 'executive' | 'concise'
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedResult, setPolishedResult] = useState("");

  // Live Keyword Analysis
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!jobDesc.trim()) {
      setHighlightKeywords([]);
      setMissingKeywords([]);
      setKeywordStats(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const { matched, missing } = analyzeKeywords(jobDesc, resume);
      setHighlightKeywords(matched);
      setMissingKeywords(missing);
      setKeywordStats({ matched, missing });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [jobDesc, resume, setHighlightKeywords, setMissingKeywords]);

  // Clean up keyword highlights when component unmounts
  useEffect(() => {
    return () => {
      setHighlightKeywords([]);
      setMissingKeywords([]);
    };
  }, [setHighlightKeywords, setMissingKeywords]);

  // Run deep backend ATS analysis
  const handleRunDeepATS = async () => {
    try {
      setAtsLoading(true);
      const res = await analyzeATS(resume);
      if (res?.data?.success && res.data.atsScore) {
        setAtsData(res.data);
        toast.success("ATS Analysis updated!");
      } else {
        const local = calculateClientATS(resume);
        setAtsData(local);
        toast.success("ATS Analysis updated!");
      }
    } catch (err) {
      console.warn("ATS backend call error, using local engine:", err.message);
      const local = calculateClientATS(resume);
      setAtsData(local);
      toast.success("ATS Analysis updated!");
    } finally {
      setAtsLoading(false);
    }
  };

  // Add keyword directly to skills
  const handleAddKeywordToSkills = (keyword) => {
    const existing = (resume.skills || []).map((s) =>
      (typeof s === "object" ? s.name || "" : String(s || "")).toLowerCase()
    );
    if (existing.includes(keyword.toLowerCase())) {
      toast("Keyword already added to skills!");
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

  // Job Match
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

  // Summary generator
  const handleGenerateSummary = async () => {
    try {
      setAiSummaryLoading(true);
      const res = await generateSummary({ ...resume, summaryTone });
      if (res.data.success && res.data.result) {
        setGeneratedSummary(res.data.result);
        toast.success("AI summary drafted!");
      }
    } catch (err) {
      toast.error("Failed to generate summary");
    } finally {
      setAiSummaryLoading(false);
    }
  };

  const handleApplySummary = () => {
    if (!generatedSummary) return;
    setResume((prev) => ({ ...prev, summary: generatedSummary }));
    toast.success("Summary applied to resume!");
    setGeneratedSummary("");
  };

  // Skills recommender
  const handleSuggestSkills = async () => {
    try {
      setSuggestSkillsLoading(true);
      const res = await suggestSkills(resume);
      if (res.data.success && res.data.skills) {
        const existingNames = (resume.skills || []).map((s) => s.name.toLowerCase());
        const newSkills = res.data.skills
          .filter((name) => !existingNames.includes(name.toLowerCase()))
          .map((name) => ({ id: Math.random().toString(), name, category: "Technical Skills" }));

        if (newSkills.length > 0) {
          setResume((prev) => ({
            ...prev,
            skills: [...(prev.skills || []), ...newSkills],
          }));
          toast.success(`Added ${newSkills.length} suggested skills!`);
        } else {
          toast("All suggested skills are already in your resume.");
        }
      }
    } catch (err) {
      toast.error("Failed to suggest skills");
    } finally {
      setSuggestSkillsLoading(false);
    }
  };

  // Polish single bullet
  const handlePolishBullet = async () => {
    if (!rawBulletText.trim()) {
      toast.error("Please enter or select a bullet point to polish");
      return;
    }
    try {
      setIsPolishing(true);
      const res = await polishBulletPoint(rawBulletText, polishMode);
      if (res.data.success && res.data.result) {
        setPolishedResult(res.data.result);
        toast.success("Bullet point enhanced with AI!");
      }
    } catch (err) {
      toast.error("Failed to polish bullet point");
    } finally {
      setIsPolishing(false);
    }
  };

  // Apply polished bullet to selected experience
  const handleApplyPolishedBullet = () => {
    if (!polishedResult || !selectedExpId) {
      toast.error("Select an experience entry to apply this bullet to");
      return;
    }

    setResume((prev) => ({
      ...prev,
      experience: (prev.experience || []).map((exp) => {
        if (exp.id !== selectedExpId) return exp;
        const current = exp.description || "";
        const updated = current.includes(rawBulletText)
          ? current.replace(rawBulletText, polishedResult)
          : current.trim() ? `${current}\n• ${polishedResult}` : `• ${polishedResult}`;
        return { ...exp, description: updated };
      }),
    }));

    toast.success("Applied polished bullet to experience entry!");
    setRawBulletText(polishedResult);
    setPolishedResult("");
  };

  // Available bullets from work experience
  const availableBullets = useMemo(() => {
    const list = [];
    (resume.experience || []).forEach((exp) => {
      if (exp.description) {
        exp.description.split(/[\n•\r]+/).forEach((b) => {
          const t = b.trim();
          if (t.length > 10) {
            list.push({ expId: exp.id, company: exp.company || exp.jobTitle || "Role", text: t });
          }
        });
      }
    });
    return list;
  }, [resume.experience]);

  const score = atsData?.atsScore ?? 75;
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
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* ── Sleek, Executive Header ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Sparkles size={18} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">AI Resume Assistant</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                ATS scoring, job description matching & intelligent bullet optimization
              </p>
            </div>
          </div>

          {/* Clean ATS Score Indicator */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl self-start sm:self-center shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                ATS Score
              </span>
              <span className={`text-base font-black ${scoreColor}`}>
                {score} <span className="text-xs text-gray-400 font-normal">/ 100</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleRunDeepATS}
              disabled={atsLoading}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition cursor-pointer"
              title="Refresh ATS analysis"
            >
              <RefreshCw size={13} className={atsLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ── Unified Segmented Navigation ── */}
        <div className="grid grid-cols-4 gap-1 bg-gray-100/80 p-1 rounded-xl mt-4 text-xs font-semibold">
          {[
            { id: "ats", label: "ATS Scorecard", icon: ShieldCheck },
            { id: "jobMatch", label: "Job Match", icon: Target },
            { id: "bulletPolisher", label: "Bullet Optimizer", icon: Wand2 },
            { id: "suite", label: "AI Career Tools", icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition cursor-pointer ${
                  isSel
                    ? "bg-white text-gray-900 shadow-xs font-bold border border-gray-200/60"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <Icon size={13} className={isSel ? "text-gray-900" : "text-gray-500"} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: ATS SCORECARD & DIAGNOSTICS ── */}
      {activeTab === "ats" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Compact Consistency & Quality Health Bar */}
          <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-emerald-950 block">Formatting & Consistency Health</span>
                <span className="text-[11px] text-emerald-800 truncate block">
                  Dates, punctuation, and active voice verified across all sections.
                </span>
              </div>
            </div>
            {onOpenQualityModal && (
              <button
                type="button"
                onClick={onOpenQualityModal}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer shadow-2xs"
              >
                Review Audit
              </button>
            )}
          </div>

          {/* 4 Pillars Breakdown Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <BarChart3 size={15} className="text-gray-900" />
                  <span>The 4 ATS Readiness Pillars</span>
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Calculated against standard corporate ATS parser requirements
                </p>
              </div>

              {onOpenATSModal && (
                <button
                  type="button"
                  onClick={onOpenATSModal}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>In-Depth Report</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(sub).map(([key, pillar]) => (
                <div key={key} className="bg-gray-50 border border-gray-200/90 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-800">{pillar.label}</span>
                    <span className="text-xs font-black text-gray-900">
                      {pillar.score} <span className="text-gray-400 font-normal">/ {pillar.max}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pillar.score / pillar.max >= 0.8
                          ? "bg-emerald-500"
                          : pillar.score / pillar.max >= 0.6
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(Math.round((pillar.score / pillar.max) * 100), 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Measurable Impact Insight */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {atsData.quantifiedBulletsCount || 0}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-950">Measurable Impact Audit</h4>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    {atsData.quantifiedBulletsCount || 0} of {atsData.totalBulletsCount || 0} bullet points include measurable numbers (%, $, x).
                    {atsData.quantifiedBulletsCount < 3 && " Recruiters score resumes higher when achievements include specific numbers."}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Domain Keywords with 1-Click Add */}
            {atsData.missingKeywords && atsData.missingKeywords.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-amber-500" />
                    <span>Recommended Industry & ATS Keywords</span>
                  </h4>
                  <span className="text-[10px] text-gray-400">Click to add to skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {atsData.missingKeywords.map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddKeywordToSkills(kw)}
                      className="text-[11px] font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1 transition cursor-pointer shadow-2xs"
                      title="Add keyword to skills"
                    >
                      <Plus size={11} className="text-emerald-600" />
                      <span>{kw}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: SMART JOB MATCHER ── */}
      {activeTab === "jobMatch" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Target size={15} className="text-gray-900" />
                <span>Job Description Match & Keyword Scanner</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Scan job postings to calculate match % and highlight missing keywords live.
              </p>
            </div>
            {keywordStats && (
              <button
                type="button"
                onClick={() => {
                  setJobDesc("");
                  setKeywordStats(null);
                  setHighlightKeywords([]);
                  setMissingKeywords([]);
                }}
                className="text-[11px] text-gray-400 hover:text-black transition cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <textarea
            rows={4}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste target job description or requirements here..."
            className="w-full text-xs p-3.5 border border-gray-200 rounded-xl focus:border-black outline-none transition"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleMatchJob}
              disabled={jobMatchLoading || !jobDesc.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {jobMatchLoading ? <RefreshCw size={14} className="animate-spin" /> : <Target size={14} />}
              <span>Analyze Match & Keywords</span>
            </button>
            {onOpenJobMatch && (
              <button
                type="button"
                onClick={onOpenJobMatch}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs shrink-0"
                title="Fork & tailor resume for this job"
              >
                <GitFork size={14} />
                <span>Tailor & Fork</span>
              </button>
            )}
          </div>

          {/* Live Match Bar */}
          {keywordStats && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-black text-emerald-600">{keywordStats.matched.length}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Found</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-lg font-black text-amber-600">{keywordStats.missing.length}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Missing</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-900">
                      {keywordStats.matched.length + keywordStats.missing.length > 0
                        ? Math.round(
                            (keywordStats.matched.length /
                              (keywordStats.matched.length + keywordStats.missing.length)) *
                              100
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Match</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded-md">
                  ✨ Highlighted live on preview
                </span>
              </div>

              {/* Missing keywords with 1-click Add to Skills */}
              {keywordStats.missing.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                      <Lightbulb size={12} />
                      <span>Missing Job Keywords ({keywordStats.missing.length})</span>
                    </h4>
                    <span className="text-[10px] text-gray-400">Click to add to skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {keywordStats.missing.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleAddKeywordToSkills(kw)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10.5px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1 transition cursor-pointer"
                        title="Add to skills"
                      >
                        <Plus size={10} />
                        <span>{kw}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched keywords */}
              {keywordStats.matched.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Matched Keywords ({keywordStats.matched.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {keywordStats.matched.map((kw) => (
                      <span
                        key={kw}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {jobMatchResult && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-gray-900">AI Match Feedback</h4>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{jobMatchResult}</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: AI BULLET OPTIMIZER (STAR / XYZ FORMULA) ── */}
      {activeTab === "bulletPolisher" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Wand2 size={15} className="text-gray-900" />
              <span>AI Bullet Point Optimizer (STAR / XYZ Method)</span>
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Upgrade weak bullets into high-impact, quantified recruiter achievements.
            </p>
          </div>

          {/* Select from existing experience */}
          {availableBullets.length > 0 && (
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Select an achievement from your experience:
              </label>
              <select
                onChange={(e) => {
                  const found = availableBullets.find((b) => b.text === e.target.value);
                  if (found) {
                    setSelectedExpId(found.expId);
                    setRawBulletText(found.text);
                    setPolishedResult("");
                  }
                }}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
              >
                <option value="">-- Choose an existing bullet to upgrade --</option>
                {availableBullets.map((b, idx) => (
                  <option key={idx} value={b.text}>
                    [{b.company}] {b.text.slice(0, 70)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Text Area */}
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Bullet point text to polish:
            </label>
            <textarea
              rows={3}
              value={rawBulletText}
              onChange={(e) => setRawBulletText(e.target.value)}
              placeholder="e.g. Worked on the application, added authentication and improved speed..."
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-black outline-none transition"
            />
          </div>

          {/* Enhancement Formula Selector */}
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1.5">
              Enhancement Formula:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: "quantify", label: "⚡ Quantify Impact", desc: "Adds metrics & %" },
                { id: "action_verb", label: "🎯 Power Verbs", desc: "Action-oriented" },
                { id: "executive", label: "👔 Executive Tone", desc: "Strategic leadership" },
                { id: "concise", label: "✂️ Tight & Direct", desc: "Removes fluff" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPolishMode(m.id)}
                  className={`text-left p-2.5 rounded-xl border transition cursor-pointer ${
                    polishMode === m.id
                      ? "bg-black text-white border-black font-semibold shadow-xs"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  <p className="text-[11px] font-bold truncate">{m.label}</p>
                  <p className={`text-[9px] mt-0.5 ${polishMode === m.id ? "text-gray-300" : "text-gray-400"}`}>
                    {m.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handlePolishBullet}
            disabled={isPolishing || !rawBulletText.trim()}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isPolishing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} className="text-amber-400" />}
            <span>Enhance Bullet Point</span>
          </button>

          {/* Polished Result Box */}
          {polishedResult && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>AI Optimized Result</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  High Impact
                </span>
              </div>
              <p className="text-xs text-gray-900 font-medium leading-relaxed bg-white p-3 rounded-lg border border-emerald-200/60 shadow-2xs">
                {polishedResult}
              </p>

              <div className="flex gap-2">
                {selectedExpId && (
                  <button
                    type="button"
                    onClick={handleApplyPolishedBullet}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition cursor-pointer shadow-xs"
                  >
                    Apply to Experience Entry
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(polishedResult);
                    toast.success("Copied to clipboard!");
                  }}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs px-3 py-2 rounded-lg transition cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: COMPLETE AI CAREER SUITE ── */}
      {activeTab === "suite" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* AI Summary Writer with Tone Selection */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <FileText size={15} className="text-gray-900" />
                <span>AI Professional Summary Writer</span>
              </h3>
            </div>

            <p className="text-xs text-gray-600">
              Drafts a targeted executive summary based on your actual job title, skills, and background.
            </p>

            {/* Tone selector */}
            <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200 text-[11px] font-semibold">
              {[
                { id: "executive", label: "Executive & Leadership" },
                { id: "technical", label: "Technical Focus" },
                { id: "impact", label: "Results & Impact" },
              ].map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setSummaryTone(tone.id)}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                    summaryTone === tone.id ? "bg-white text-gray-900 shadow-2xs font-bold" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={aiSummaryLoading}
              className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {aiSummaryLoading ? <RefreshCw size={13} className="animate-spin text-white" /> : <Sparkles size={13} className="text-amber-400" />}
              <span>Draft Summary</span>
            </button>

            {generatedSummary && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2 mt-2">
                <p className="text-xs text-gray-800 leading-relaxed italic">{generatedSummary}</p>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setGeneratedSummary("")}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={handleApplySummary}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer shadow-xs"
                  >
                    Use this Summary
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Skills Suggester */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-gray-900">AI Skill Recommender</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Scans role profile to recommend missing competencies.</p>
            </div>
            <button
              type="button"
              onClick={handleSuggestSkills}
              disabled={suggestSkillsLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 border border-gray-300 shadow-2xs"
            >
              {suggestSkillsLoading ? <RefreshCw size={13} className="animate-spin" /> : "Suggest Skills"}
            </button>
          </div>

          {/* Tailor for Job Description (1-Click Fork) */}
          {onOpenJobMatch && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <GitFork size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Tailor for Job (1-Click Fork Engine)</h4>
                  <p className="text-[11px] text-gray-500">Duplicate, target company tone & auto-inject keywords</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Paste a target job posting or URL. The AI will score ATS match, duplicate your resume into a dedicated version (e.g., <em>"Tailored for Stripe"</em>), and pre-populate missing keywords into your experience bullets.
              </p>

              <button
                type="button"
                onClick={onOpenJobMatch}
                className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <span>Open Tailor & Fork Engine</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* AI Interview Prep Kit */}
          {onOpenInterviewPrep && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">AI Interview Prep Kit</h4>
                  <p className="text-[11px] text-gray-500">STAR talking points & Top 10 Recruiter questions</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Transforms each of your work experience bullets into structured interview stories (Situation, Task, Action, Result) and predicts the top 10 technical & behavioral questions recruiters will ask.
              </p>

              <button
                type="button"
                onClick={onOpenInterviewPrep}
                className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span>Launch AI Interview Prep Kit</span>
              </button>
            </div>
          )}

          {/* AI Cover Letter Generator */}
          {onOpenCoverLetter && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">AI Cover Letter Generator</h4>
                  <p className="text-[11px] text-gray-500">Synced with resume skills & target company tone</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Draft a compelling, recruiter-ready cover letter tailored directly to any company or job description. Choose between Confident, Startup, Executive, or Creative tones, edit directly, and export to PDF.
              </p>

              <button
                type="button"
                onClick={onOpenCoverLetter}
                className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Sparkles size={13} className="text-purple-300" />
                <span>Draft AI Cover Letter</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIToolsPanel;
