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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome back, {userName}
          </h1>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's an overview of your career progress.
        </p>
      </div>

      {/* AI Status */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2.5 w-fit px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white shadow-sm hover:shadow-md transition-all duration-200 cursor-default group"
      >
        <Sparkles size={17} className="text-black dark:text-white group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />

        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            AI Career Assistant
          </p>

          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Ready to help
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DashboardHeader;
