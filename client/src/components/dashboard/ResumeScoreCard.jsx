import { motion } from "framer-motion";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ResumeScoreCard() {
  const navigate = useNavigate();
  const resumeScore = 78;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 group"
      onClick={() => navigate("/resumes")}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-900 dark:bg-blue-500/15 dark:border dark:border-blue-500/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <FileText size={21} className="text-white dark:text-blue-400" />
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI Resume Analysis
            </p>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resume Score
            </h2>
          </div>
        </div>

        <Sparkles size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-blue-400 group-hover:rotate-12 group-hover:scale-110 transition-all duration-200" />
      </div>

      {/* Score */}
      <div className="flex items-center gap-6 mt-5">
        {/* Circular Score */}
        <div className="relative w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-100 dark:text-gray-800"
            />

            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * resumeScore) / 100}
              className="text-gray-900 dark:text-blue-500"
            />
          </svg>

          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {resumeScore}
          </span>
        </div>

        {/* Score Description */}
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Good Resume
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your resume is performing well.
          </p>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Target: 85+
          </p>
        </div>
      </div>

      {/* Analysis Stats */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        <div className="bg-gray-50 dark:bg-gray-800/70 border border-transparent hover:border-black dark:hover:border-white rounded-lg p-2 text-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-200 cursor-default">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            82%
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            ATS Match
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/70 border border-transparent hover:border-black dark:hover:border-white rounded-lg p-2 text-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-200 cursor-default">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            76%
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            Skills Match
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/70 border border-transparent hover:border-black dark:hover:border-white rounded-lg p-2 text-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-200 cursor-default">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            80%
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            Content
          </p>
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors"
      >
        <span>Analyze Resume</span>
        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
      </button>
    </motion.div>
  );
}

export default ResumeScoreCard;
