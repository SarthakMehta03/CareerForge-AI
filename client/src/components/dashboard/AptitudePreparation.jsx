import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  ArrowRight,
  Calculator,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { getAptitudeDashboardData } from "../../services/aptitudeService";

function AptitudePreparation() {
  const data = getAptitudeDashboardData();
  const overallScore = data.hasHistory ? data.overallAccuracy : 0;
  const quantScore = data.categoryAccuracy?.quantitative || 0;
  const logicalScore = data.categoryAccuracy?.logical || 0;
  const verbalScore = data.categoryAccuracy?.verbal || 0;

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
            <Brain size={21} className="text-white dark:text-blue-400" />
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Aptitude Preparation
            </p>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Aptitude Progress
            </h2>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-200">
            {overallScore}%
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Overall
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Overall progress
          </span>

          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {overallScore}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-gray-100 dark:bg-[#1c2234] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gray-900 dark:bg-blue-500 rounded-full"
          />
        </div>
      </div>

      {/* Aptitude Categories */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        {/* Quantitative */}
        <div className="bg-gray-50 dark:bg-gray-800/70 border border-transparent hover:border-black dark:hover:border-white rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.03] transition-all duration-200 cursor-default">
          <Calculator
            size={16}
            className="text-gray-700 dark:text-gray-300 mb-2"
          />

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Quantitative
          </p>

          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {quantScore}%
          </p>
        </div>

        {/* Logical */}
        <div className="bg-gray-50 dark:bg-gray-800/70 border border-transparent hover:border-black dark:hover:border-white rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.03] transition-all duration-200 cursor-default">
          <Lightbulb
            size={16}
            className="text-gray-700 dark:text-gray-300 mb-2"
          />

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Logical
          </p>

          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {logicalScore}%
          </p>
        </div>

        {/* Verbal */}
        <div className="bg-gray-50 dark:bg-gray-800/70 border border-transparent hover:border-black dark:hover:border-white rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.03] transition-all duration-200 cursor-default">
          <BookOpen
            size={16}
            className="text-gray-700 dark:text-gray-300 mb-2"
          />

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Verbal
          </p>

          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {verbalScore}%
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-white hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-all duration-200">
        <p className="text-xs font-semibold text-gray-900 dark:text-white">
          Recommended Practice
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {data.hasHistory
            ? "Practice recommended topics to improve your speed and overall accuracy rate."
            : "Explore quantitative, logical reasoning, and verbal topics to prepare for placement drives."}
        </p>
      </div>

      {/* Action */}
      <Link
        to="/aptitude"
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
        <span>Start Aptitude Practice</span>
        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}

export default AptitudePreparation;
