import { Home, LayoutDashboard, Briefcase, BookOpen, User, Rocket } from "lucide-react";

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-black p-2 rounded-lg">
            <Rocket className="text-white w-5 h-5" />
          </div>

          <h1 className="text-2xl font-bold">
            CareerForge-AI
          </h1>
        </div>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-gray-600">

          <li className="flex items-center gap-2 cursor-pointer hover:text-black transition">
            <Home size={18} />
            Home
          </li>

          <li className="flex items-center gap-2 cursor-pointer hover:text-black transition">
            <LayoutDashboard size={18} />
            Dashboard
          </li>

          <li className="flex items-center gap-2 cursor-pointer hover:text-black transition">
            <Briefcase size={18} />
            Interviews
          </li>

          <li className="flex items-center gap-2 cursor-pointer hover:text-black transition">
            <BookOpen size={18} />
            Resources
          </li>

          <li className="flex items-center gap-2 cursor-pointer text-black border-b-2 border-black pb-1">
            <User size={18} />
            Profile
          </li>

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;