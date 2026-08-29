import {
  Home,
  LayoutDashboard,
  Briefcase,
  BookOpen,
  User,
  Rocket,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Navbar() {
  const navItems = [
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
      name: "Interviews",
      path: "/interviews",
      icon: Briefcase,
    },
    {
      name: "Resources",
      path: "/resources",
      icon: BookOpen,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <div className="bg-black p-2 rounded-lg">
            <Rocket className="text-white w-5 h-5" />
          </div>

          <h1 className="text-2xl font-bold">
            CareerForge-AI
          </h1>
        </NavLink>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-gray-600">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 cursor-pointer transition ${
                      isActive
                        ? "text-black border-b-2 border-black pb-1"
                        : "hover:text-black"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;