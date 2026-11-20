import { motion } from "framer-motion";
import { Target, ArrowRight } from "lucide-react";

function CareerGoalCard() {
  const matchScore = 87;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-900 dark:bg-blue-500/15 dark:border dark:border-blue-500/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Target size={21} className="text-white dark:text-blue-400" />
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current Career Goal
            </p>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-0.5">
              MERN Stack Developer
            </h2>
          </div>
        </div>

        {/* Match Score */}
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-200">
            {matchScore}%
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Match
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Key Skills
        </p>

        <div className="flex flex-wrap gap-2">
          {["React.js", "Node.js", "MongoDB", "Express.js"].map(
            (skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#1c2234] border border-transparent hover:border-gray-400 dark:hover:border-blue-500/40 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-blue-500/20 hover:text-white dark:hover:text-blue-300 hover:scale-105 transition-all duration-200 cursor-pointer shadow-2xs"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-blue-400 hover:text-black dark:hover:text-blue-300 transition-colors cursor-pointer"
      >
        <span>View Career Path</span>
        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
      </button>
    </motion.div>
  );
}

export default CareerGoalCard;
