import { useState } from "react";
import {
  Home,
  LayoutDashboard,
  FileText,
  Briefcase,
  Brain,
  User,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser, getCurrentUser } from "../../services/authService";
import ThemeToggle from "../common/ThemeToggle";
import { BrandLogo } from "../common/BrandLogo";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide the navigation bar on password reset screens for a clean, focused layout
  if (location.pathname.startsWith("/reset-password")) {
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const baseNavItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Resumes",
      path: "/resumes",
      icon: FileText,
    },
    {
      name: "Interviews",
      path: "/interviews",
      icon: Briefcase,
    },
    {
      name: "Aptitude",
      path: "/aptitude",
      icon: Brain,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const navItems = [
    ...baseNavItems,
    ...(isAdmin
      ? [
          {
            name: "Admin",
            path: "/admin",
            icon: Shield,
          },
        ]
      : []),
  ];

  return (
    <nav className="w-full bg-white dark:bg-[#0c0e14] shadow-xs border-b border-gray-200 dark:border-[#232a3d] transition-colors duration-150 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-black dark:focus:ring-white rounded-lg p-1">
          <BrandLogo className="w-9 h-9 sm:w-10 sm:h-10" />

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            CareerForge-AI
          </h1>
        </NavLink>

        {/* Right Section: Desktop Nav + ThemeToggle + Logout */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-gray-600 dark:text-gray-400">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-sm font-medium cursor-pointer transition ${
                        isActive
                          ? "text-black dark:text-blue-400 border-b-2 border-black dark:border-blue-400 pb-1 font-semibold"
                          : "hover:text-black dark:hover:text-white"
                      }`
                    }
                  >
                    <Icon size={17} />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <ThemeToggle align="right" />

            {/* Log Out Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#232a3d] bg-white dark:bg-[#141824] text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-xs font-semibold transition cursor-pointer shadow-2xs"
              title="Log Out"
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1c2234]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-[#232a3d] bg-white dark:bg-[#141824] px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-gray-100 dark:bg-blue-500/15 text-black dark:text-blue-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1c2234] hover:text-black dark:hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Account session</span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
