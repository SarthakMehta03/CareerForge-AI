import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getCurrentUser } from "../../services/authService";

function DashboardHeader() {
  const user = getCurrentUser();

  const userName = user?.name || "Student";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      {/* Welcome Section */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}
          </h1>

          
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your career progress.
        </p>
      </div>

      {/* AI Status */}
      <div className="flex items-center gap-2 w-fit px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm">
        <Sparkles size={17} className="text-black" />

        <div>
          <p className="text-xs text-gray-400">
            AI Career Assistant
          </p>

          <p className="text-sm font-semibold text-gray-900">
            Ready to help
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardHeader;