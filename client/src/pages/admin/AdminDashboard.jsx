import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  Briefcase,
  Brain,
  ShieldCheck,
  Server,
  Activity,
  AlertTriangle,
  RefreshCw,
  Clock,
  ArrowUpRight,
  BookOpen,
  Sparkles,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAdminOverview } from "../../services/adminService";
import { getCurrentUser } from "../../services/authService";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = getCurrentUser();

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminOverview();
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError(err.response?.data?.message || "Failed to load admin metrics.");
      toast.error("Could not load administrative overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 p-4 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
          <div className="lg:col-span-2 h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-xl mx-auto my-8">
        <AlertTriangle className="mx-auto text-red-500 mb-3" size={36} />
        <h3 className="text-base font-bold text-red-900">Error Loading Admin Data</h3>
        <p className="text-xs text-red-600 mt-1">{error || "Please verify backend server status."}</p>
        <button
          type="button"
          onClick={fetchOverview}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { metrics, recentAuditLogs = [], systemStatus = {} } = data;

  const statCards = [
    {
      title: "Total Accounts",
      value: (metrics.users?.total || 0).toLocaleString(),
      subtext: `${metrics.users?.active || 0} active · ${metrics.users?.suspended || 0} suspended`,
      badge: `+${metrics.users?.newLast7Days || 0} this week`,
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      link: "/admin/users",
    },
    {
      title: "Resumes Built",
      value: (metrics.resumes?.total || 0).toLocaleString(),
      subtext: `+${metrics.resumes?.newLast7Days || 0} last 7d · ${metrics.resumes?.avgAtsScore || 0}% avg ATS`,
      badge: "Real time",
      icon: FileText,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      link: "/admin/activity",
    },
    {
      title: "Interview Practice",
      value: (metrics.interviews?.totalSessions || 0).toLocaleString(),
      subtext: `+${metrics.interviews?.sessionsLast7Days || 0} completed last 7d`,
      badge: "Ledger-backed",
      icon: Briefcase,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      link: "/admin/activity",
    },
    {
      title: "Aptitude Tests",
      value: (metrics.aptitude?.completedSessions || 0).toLocaleString(),
      subtext: `${metrics.aptitude?.avgAccuracy || 0}% avg accuracy score`,
      badge: `${metrics.aptitude?.totalSessions || 0} total`,
      icon: Brain,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      link: "/admin/activity",
    },
    {
      title: "Question Bank",
      value: (metrics.content?.activeQuestions || 0).toLocaleString(),
      subtext: "Curated interview & aptitude questions",
      badge: "Active",
      icon: BookOpen,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      link: "/admin/content",
    },
    {
      title: "Gemini AI Engine",
      value: systemStatus.aiService || "Operational",
      subtext: `${systemStatus.aiModel || "gemini-2.5-flash"}`,
      badge: "Free-tier ready",
      icon: Sparkles,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      link: "/admin/monitoring",
    },
  ];

  const quickActions = [
    {
      title: "User Accounts",
      description: "Search accounts, grant administrative privileges, and manage suspensions",
      icon: Users,
      link: "/admin/users",
      color: "text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      title: "Question Bank",
      description: "Create, edit, preview, and archive interview questions & aptitude MCQs",
      icon: BookOpen,
      link: "/admin/content",
      color: "text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white",
    },
    {
      title: "Subsystem Activity",
      description: "Inspect resume templates, mock interview counts, and test accuracy",
      icon: Activity,
      link: "/admin/activity",
      color: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white",
    },
    {
      title: "System & Audit",
      description: "Inspect platform readiness, AI model telemetry, and immutable security audit log",
      icon: ShieldCheck,
      link: "/admin/monitoring",
      color: "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white",
    },
    {
      title: "Platform Settings",
      description: "Adjust daily credit allowances, question pricing, and registration modes",
      icon: Sliders,
      link: "/admin/settings",
      color: "text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white",
    },
  ];

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PURPOSE-BUILT CAREERFORGE AI DASHBOARD HERO BANNER
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              CareerForge AI · Operations Console
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Welcome back, {currentUser?.name || "Administrator"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Administrative overview · Real-time platform metrics and governance across Resume Builder, Mock Interview, and Aptitude subsystems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] font-medium text-slate-400">AI Service Status</span>
            <span className="text-xs font-semibold text-slate-800 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {systemStatus.aiService || "Operational"} ({systemStatus.aiModel || "gemini-2.5-flash"})
            </span>
          </div>

          <button
            type="button"
            onClick={fetchOverview}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
            title="Refresh dashboard metrics"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          KEY SUBSYSTEM METRIC CARDS (High Information Density)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                    {card.title}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${card.color} transition-transform group-hover:scale-110`}>
                    <Icon size={14} />
                  </div>
                </div>

                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {card.value}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">{card.subtext}</span>
                <ArrowUpRight size={13} className="text-slate-400 group-hover:text-indigo-600 transition shrink-0 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* =========================================================================
          FOCUSED ADMINISTRATIVE WORKFLOWS
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Administrative Workflows
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Administrative actions and governance workflows with role enforcement and audit recording.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            5 Connected Sections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.title}
                to={act.link}
                className="group p-4 rounded-xl border border-slate-200/90 hover:border-indigo-400 hover:bg-slate-50/70 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border border-slate-100 transition-colors shrink-0 ${act.color}`}>
                      <Icon size={18} />
                    </div>
                    <ArrowUpRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {act.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {act.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          LOWER ROW: SUBSYSTEM READINESS & RECENT AUDIT ACTIVITY
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subsystem Telemetry Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Server size={16} className="text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Platform Readiness & Signals
                </h3>
              </div>
              <Link
                to="/admin/monitoring"
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Telemetry &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Gemini AI Service</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {systemStatus.aiService || "Operational"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Active AI Model</span>
                <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {systemStatus.aiModel || "gemini-2.5-flash"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Environment</span>
                <span className="font-semibold text-slate-700 capitalize text-xs">
                  {systemStatus.nodeEnv || "development"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Server Process Uptime</span>
                <span className="font-medium text-slate-700 flex items-center gap-1 text-xs">
                  <Clock size={12} className="text-slate-400" />
                  {Math.floor((systemStatus.uptimeSeconds || 0) / 60)} mins
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
            <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>JWT + RequireAdmin route enforcement active</span>
            </div>
          </div>
        </div>

        {/* Recent Security & Administrative Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Administrative Actions
                </h3>
              </div>
              <Link
                to="/admin/monitoring?tab=audit"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View all logs &rarr;
              </Link>
            </div>

            {recentAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No administrative actions recorded in audit log yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Action</th>
                      <th className="py-2.5 px-4">Administrator</th>
                      <th className="py-2.5 px-4">Target Type</th>
                      <th className="py-2.5 px-4">Outcome</th>
                      <th className="py-2.5 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentAuditLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/60 transition">
                        <td className="py-2.5 px-4">
                          <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          <span className="font-semibold block leading-tight">{log.adminName}</span>
                          <span className="text-slate-400 text-[10px] truncate max-w-[150px] block">
                            {log.adminEmail}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 font-medium">
                          {log.targetType}
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.outcome === "SUCCESS"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}
                          >
                            {log.outcome}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                          {new Date(log.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 px-5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Audit trail records are immutable and scrubbed of passwords & secrets.</span>
            <Link
              to="/admin/monitoring?tab=audit"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Inspect JSON metadata &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
