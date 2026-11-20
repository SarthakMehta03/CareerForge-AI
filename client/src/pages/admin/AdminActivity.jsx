import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Brain,
  Users,
  Briefcase,
  RefreshCw,
  Coins,
  ArrowUpRight,
  PieChart,
  Layers,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { getActivityReports } from "../../services/adminService";

function AdminActivity() {
  const [range, setRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'resumes' | 'interviews' | 'aptitude'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getActivityReports({ range });
      if (res.data?.success) {
        setReportData(res.data.data);
      }
    } catch (err) {
      console.error("Activity report error:", err);
      toast.error("Failed to load activity reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [range]);

  const ranges = [
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "90d", label: "Last 90 Days" },
    { id: "all", label: "All Time" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "resumes", label: "Resume Builder", icon: FileText },
    { id: "interviews", label: "Mock Interviews", icon: Briefcase },
    { id: "aptitude", label: "Aptitude Tests", icon: Brain },
  ];

  // Helper for pure CSS bar chart height calculation
  const getMaxVal = (arr, key) => {
    if (!arr || arr.length === 0) return 1;
    return Math.max(...arr.map((item) => item[key] || 0), 1);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PAGE HEADER & DATE RANGE FILTER
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CareerForge Activity</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified operational trends and module metrics derived across Resumes, Mock Interviews, and Aptitude tests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Range Selector */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            {ranges.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  range === r.id
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchReports}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Refresh Activity Data"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION (Subsystem Views)
          ========================================================================= */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          CONTENT BODY
          ========================================================================= */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
          ))}
        </div>
      ) : !reportData ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No activity telemetry recorded for this timeframe.
        </div>
      ) : (
        <div className="space-y-6">
          {/* ---------------------------------------------------------------------
              TAB 1: OVERVIEW (Unified summary)
              --------------------------------------------------------------------- */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">New Signups</span>
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {reportData.userSignupsTrend?.reduce((acc, curr) => acc + (curr.count || 0), 0) || 0}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">In selected {range} window</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Resumes Built</span>
                    <FileText size={16} className="text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {reportData.resumeCreationTrend?.reduce((acc, curr) => acc + (curr.count || 0), 0) || 0}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Across all templates</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Mock Interviews</span>
                    <Briefcase size={16} className="text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {reportData.interviewDailyTrend?.reduce((acc, curr) => acc + (curr.sessions || 0), 0) || 0}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Committed in credit ledger</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Aptitude Tests</span>
                    <Brain size={16} className="text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {reportData.aptitudeByCategory?.reduce((acc, curr) => acc + (curr.totalSessions || 0), 0) || 0}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Attempts across all topics</span>
                </div>
              </div>

              {/* Two Trend Graphs Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registrations Daily Trend */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Daily User Registrations
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {reportData.userSignupsTrend?.length || 0} active days
                    </span>
                  </div>

                  {reportData.userSignupsTrend?.length === 0 ? (
                    <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                      No registrations in this date range.
                    </div>
                  ) : (
                    <div className="h-44 flex items-end gap-1.5 pt-4">
                      {reportData.userSignupsTrend?.map((item) => {
                        const maxVal = getMaxVal(reportData.userSignupsTrend, "count");
                        const heightPct = Math.max(12, Math.round((item.count / maxVal) * 100));
                        return (
                          <div
                            key={item._id}
                            className="flex-1 flex flex-col items-center gap-1 group relative"
                          >
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 pointer-events-none">
                              {item._id}: {item.count} users
                            </div>
                            <div
                              style={{ height: `${heightPct}%` }}
                              className="w-full bg-blue-500/80 hover:bg-blue-600 rounded-t-sm transition-all"
                            />
                            <span className="text-[9px] text-slate-400 truncate max-w-[28px]">
                              {item._id.split("-").slice(1).join("/")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Resumes Daily Trend */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-emerald-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Daily Resume Creations
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {reportData.resumeCreationTrend?.length || 0} active days
                    </span>
                  </div>

                  {reportData.resumeCreationTrend?.length === 0 ? (
                    <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                      No resume creations in this date range.
                    </div>
                  ) : (
                    <div className="h-44 flex items-end gap-1.5 pt-4">
                      {reportData.resumeCreationTrend?.map((item) => {
                        const maxVal = getMaxVal(reportData.resumeCreationTrend, "count");
                        const heightPct = Math.max(12, Math.round((item.count / maxVal) * 100));
                        return (
                          <div
                            key={item._id}
                            className="flex-1 flex flex-col items-center gap-1 group relative"
                          >
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 pointer-events-none">
                              {item._id}: {item.count} resumes
                            </div>
                            <div
                              style={{ height: `${heightPct}%` }}
                              className="w-full bg-emerald-500/80 hover:bg-emerald-600 rounded-t-sm transition-all"
                            />
                            <span className="text-[9px] text-slate-400 truncate max-w-[28px]">
                              {item._id.split("-").slice(1).join("/")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 2: RESUMES MODULE
              --------------------------------------------------------------------- */}
          {activeTab === "resumes" && (
            <div className="space-y-6">
              {/* Privacy Notice Banner */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
                <Lock size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Candidate Privacy Policy Enforced
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Personal resume content, contact details, work history, and uploaded PDF documents are strictly confidential and encrypted to each student. The admin console aggregates aggregate volumes and template counts without exposing personal documents.
                  </p>
                </div>
              </div>

              {/* Template Popularity Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <PieChart size={16} className="text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Resume Template Distribution
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    Total: {reportData.resumeTemplates?.reduce((acc, curr) => acc + curr.count, 0) || 0}
                  </span>
                </div>

                {reportData.resumeTemplates?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No resume template records found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reportData.resumeTemplates?.map((tmpl) => {
                      const totalResumes =
                        reportData.resumeTemplates?.reduce((acc, curr) => acc + curr.count, 0) || 1;
                      const pct = Math.round((tmpl.count / totalResumes) * 100);
                      return (
                        <div key={tmpl._id || "default"} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-800 capitalize font-semibold">
                              {tmpl._id || "Standard Modern"}
                            </span>
                            <span className="text-slate-500">
                              {tmpl.count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 3: MOCK INTERVIEWS MODULE
              --------------------------------------------------------------------- */}
          {activeTab === "interviews" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Daily Mock Interview Activity (Ledger Backed)
                    </h3>
                  </div>
                  <Link
                    to="/admin/content?type=interview"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Manage Questions</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                {reportData.interviewDailyTrend?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No interview session commitments found in this date range.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Date</th>
                          <th className="py-2.5 px-4">Completed Sessions</th>
                          <th className="py-2.5 px-4">Credits Consumed</th>
                          <th className="py-2.5 px-4 text-right">Avg Cost / Session</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reportData.interviewDailyTrend?.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/60 transition">
                            <td className="py-2.5 px-4 font-medium text-slate-900">{item._id}</td>
                            <td className="py-2.5 px-4">
                              <span className="font-semibold text-slate-800">{item.sessions}</span> sessions
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="inline-flex items-center gap-1 text-indigo-600 font-bold">
                                <Coins size={12} />
                                {item.creditsCharged}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right text-slate-500">
                              {item.sessions > 0
                                ? (item.creditsCharged / item.sessions).toFixed(1)
                                : 0}{" "}
                              credits
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 4: APTITUDE TESTS MODULE
              --------------------------------------------------------------------- */}
          {activeTab === "aptitude" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Aptitude Test Performance By Category
                    </h3>
                  </div>
                  <Link
                    to="/admin/content?type=aptitude"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Manage MCQs</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                {reportData.aptitudeByCategory?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No aptitude session records found in this range.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[600px]">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Category</th>
                          <th className="py-2.5 px-4">Total Attempts</th>
                          <th className="py-2.5 px-4">Submitted</th>
                          <th className="py-2.5 px-4">Completion Rate</th>
                          <th className="py-2.5 px-4 text-right">Avg Accuracy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reportData.aptitudeByCategory?.map((cat) => {
                          const completionRate =
                            cat.totalSessions > 0
                              ? Math.round((cat.submittedSessions / cat.totalSessions) * 100)
                              : 0;
                          const avgAcc = Math.round(cat.avgAccuracy || 0);
                          return (
                            <tr key={cat._id || "General"} className="hover:bg-slate-50/60 transition">
                              <td className="py-2.5 px-4 font-bold text-slate-900 capitalize">
                                {cat._id || "Quantitative Aptitude"}
                              </td>
                              <td className="py-2.5 px-4 text-slate-700 font-medium">{cat.totalSessions}</td>
                              <td className="py-2.5 px-4 text-slate-700 font-medium">
                                {cat.submittedSessions}
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                                  {completionRate}%
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    avgAcc >= 70
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                      : avgAcc >= 40
                                      ? "bg-amber-50 text-amber-700 border border-amber-100"
                                      : "bg-red-50 text-red-700 border border-red-100"
                                  }`}
                                >
                                  {avgAcc}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminActivity;
