import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  BookOpen,
  User,
  Rocket,
  LogOut,
  ChevronDown,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  // Navigation items (only shown when authenticated)
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Resumes", path: "/resumes", icon: FileText },
    { name: "Interviews", path: "/interviews", icon: Briefcase },
    { name: "Resources", path: "/resources", icon: BookOpen },
  ];

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 shrink-0">
            <div className="bg-black p-1.5 rounded-lg">
              <Rocket className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">CareerForge-AI</h1>
          </NavLink>

          {isAuthenticated ? (
            <>
              {/* Desktop Navigation */}
              <ul className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-gray-100 text-black"
                              : "text-gray-600 hover:text-black hover:bg-gray-50"
                          }`
                        }
                      >
                        <Icon size={16} />
                        {item.name}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              {/* Desktop Profile Dropdown */}
              <div className="hidden md:flex items-center gap-3">
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-tight truncate max-w-[120px]">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[11px] text-gray-400 leading-tight truncate max-w-[120px]">
                        {user?.email || ""}
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <NavLink
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={15} className="text-gray-400" />
                        Profile & Settings
                      </NavLink>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          ) : (
            /* ── Logged-Out State: CTA Buttons ── */
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="text-sm font-semibold text-gray-700 hover:text-black transition-colors px-3 py-2"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="text-sm font-bold text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-xl transition-colors"
              >
                Get Started
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu (Authenticated Only) */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}

            {/* Mobile Profile & Logout */}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <NavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <Settings size={18} />
                Profile & Settings
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>

            {/* Mobile User Info */}
            <div className="flex items-center gap-3 px-3 pt-2 border-t border-gray-100 mt-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                  {getInitials(user?.name)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
