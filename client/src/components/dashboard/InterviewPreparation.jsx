import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Video,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

function InterviewPreparation() {
  const readiness = 72;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-900 dark:bg-blue-500/15 dark:border dark:border-blue-500/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Video size={21} className="text-white dark:text-blue-400" />
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Interview Preparation
            </p>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Interview Readiness
            </h2>
          </div>
        </div>

        <span className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-200">
          {readiness}%
        </span>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Overall readiness
          </span>

          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {readiness}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-gray-100 dark:bg-[#1c2234] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${readiness}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gray-900 dark:bg-blue-500 rounded-full"
          />
        </div>
      </div>

      {/* Preparation Areas */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        <div className="bg-gray-50 dark:bg-gray-800/70 border border-transparent hover:border-black dark:hover:border-white rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.03] transition-all duration-200 cursor-default">
          <CheckCircle2 size={16} className="text-gray-700 dark:text-gray-300 mb-2" />

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Technical
          </p>

          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            78%
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/70 border border-transparent hover:border-black dark:hover:border-white rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.03] transition-all duration-200 cursor-default">
          <CheckCircle2 size={16} className="text-gray-700 dark:text-gray-300 mb-2" />

          <p className="text-xs text-gray-500 dark:text-gray-400">
            HR
          </p>

          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            65%
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/70 border border-transparent hover:border-black dark:hover:border-white rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.03] transition-all duration-200 cursor-default">
          <Clock size={16} className="text-gray-700 dark:text-gray-300 mb-2" />

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mock Tests
          </p>

          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            8
          </p>
        </div>
      </div>

      {/* Next Action */}
      <div className="mt-5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-white hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-all duration-200">
        <p className="text-xs font-semibold text-gray-900 dark:text-white">
          Recommended
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Take an AI-powered mock interview to improve your readiness.
        </p>
      </div>

      {/* Button */}
      <Link
        to="/interviews"
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-gray-900 dark:text-gray-100
          hover:text-black dark:hover:text-white
          transition-colors
        "
      >
        <span>Start Mock Interview</span>
        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}

export default InterviewPreparation;
