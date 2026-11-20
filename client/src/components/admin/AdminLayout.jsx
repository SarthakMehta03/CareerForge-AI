import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { logoutUser, getCurrentUser, fetchMe } from "../../services/authService";
import { getAdminOverview } from "../../services/adminService";
import ThemeToggle from "../common/ThemeToggle";

function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    aiService: "Operational",
    aiModel: "gemini-2.5-flash",
  });
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const location = useLocation();

  // Load fresh user & live telemetry
  useEffect(() => {
    fetchMe()
      .then((user) => {
        if (user) setCurrentUser(user);
      })
      .catch(() => {});

    getAdminOverview()
      .then((res) => {
        if (res.data?.success && res.data.systemStatus) {
          setSystemHealth({
            aiService: res.data.systemStatus.aiService || "Operational",
            aiModel: res.data.systemStatus.aiModel || "gemini-2.5-flash",
          });
        }
      })
      .catch(() => {});
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, mobileMenuOpen]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Signed out of administrative console");
    navigate("/login");
  };

  const navGroups = [
    {
      group: "Core",
      items: [
        {
          name: "Dashboard",
          path: "/admin",
          end: true,
          icon: LayoutDashboard,
          badge: "Live",
          description: "Subsystem activity, accounts, and platform health",
        },
      ],
    },
    {
      group: "Management",
      items: [
        {
          name: "User Accounts",
          path: "/admin/users",
          icon: Users,
          description: "User directory, role assignment, and access control",
        },
        {
          name: "Question Bank",
          path: "/admin/content",
          icon: BookOpen,
          description: "Curated technical interview and aptitude questions",
        },
      ],
    },
    {
      group: "Analytics & Activity",
      items: [
        {
          name: "CareerForge Activity",
          path: "/admin/activity",
          icon: BarChart3,
          description: "Resume, mock interview, and aptitude telemetry",
        },
      ],
    },
    {
      group: "System & Governance",
      items: [
        {
          name: "System & Audit",
          path: "/admin/monitoring",
          icon: ShieldCheck,
          description: "Platform health signals and security audit trail",
        },
        {
          name: "Platform Settings",
          path: "/admin/settings",
          icon: Settings,
          description: "Application configuration and administrator credentials",
        },
      ],
    },
  ];

  // Derive active navigation item for page title & description
  const allNavItems = navGroups.flatMap((g) => g.items);
  const currentNav = allNavItems.find((item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col antialiased text-slate-800 dark:text-slate-100 transition-colors duration-150">
      {/* =========================================================================
          PERSISTENT DESKTOP SIDEBAR (Full-height, high-contrast Slate/Indigo theme)
          ========================================================================= */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-slate-950 text-slate-300 border-r border-slate-800/80 z-30 flex-col justify-between">
        {/* Sidebar Top: Branding */}
        <div>
          <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white tracking-tight text-base leading-none">
                  CareerForge
                </span>
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mt-1">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links Grouped */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                          isActive
                            ? "bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-600/40"
                            : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon size={16} className="shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom: Admin Profile & Sign-out */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/70">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-white leading-tight truncate">
                  {currentUser?.name || "Administrator"}
                </p>
                <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 uppercase">
                  {currentUser?.role === "admin" ? "Super Admin" : "Staff"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-md transition"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE SLIDE-DOWN DRAWER
          ========================================================================= */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-slate-950 text-slate-300 h-full shadow-2xl p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Sparkles size={15} />
                  </div>
                  <span className="font-bold text-white text-sm">CareerForge Admin</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-4">
                {navGroups.map((group) => (
                  <div key={group.group} className="space-y-1">
                    <div className="px-2 text-[10px] font-bold text-slate-500 uppercase">
                      {group.group}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.end}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                              isActive
                                ? "bg-indigo-600 text-white font-semibold"
                                : "text-slate-400 hover:text-white hover:bg-slate-900"
                            }`
                          }
                        >
                          <Icon size={16} />
                          <span>{item.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-slate-900 rounded-lg"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          POLISHED ADMIN HEADER (Desktop & Mobile)
          Aligned with main content below via matching max-w-7xl and horizontal padding
          ========================================================================= */}
      <header className="lg:pl-64 sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 h-16 transition-colors duration-150">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left: Mobile hamburger & Clear Polished Page Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open navigation drawer"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {currentNav?.name || "Dashboard"}
              </h1>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {currentNav?.description || "CareerForge AI Administration"}
              </p>
            </div>
          </div>

          {/* Right: AI Readiness Pill & Administrator Profile & Theme Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle align="right" />

            {/* AI Subsystem Status Indicator */}
            <Link
              to="/admin/monitoring"
              className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-[11px] text-slate-600 dark:text-slate-300 transition"
              title="View system & service telemetry"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                AI Service: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{systemHealth.aiService}</strong>
              </span>
            </Link>

            {/* Administrator Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                to="/admin/settings?tab=profile"
                className="flex items-center gap-2 hover:opacity-85 transition"
                title="Administrator Profile"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {currentUser?.name ? currentUser.name.charAt(0) : "A"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {currentUser?.name || "Admin"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {currentUser?.email || "admin@careerforge.ai"}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTENT VIEWPORT
          Matching max-w-7xl and horizontal padding with header above
          ========================================================================= */}
      <main className="lg:pl-64 flex-1 min-w-0 bg-slate-50/70 dark:bg-slate-950">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
