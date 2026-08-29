import { motion } from "framer-motion";
import {
  Brain,
  ArrowRight,
  Calculator,
  Lightbulb,
  BookOpen,
} from "lucide-react";

function AptitudePreparation() {
  const overallScore = 68;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center">
            <Brain size={21} className="text-white" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Aptitude Preparation
            </p>

            <h2 className="text-lg font-semibold text-gray-900">
              Aptitude Progress
            </h2>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {overallScore}%
          </p>

          <p className="text-xs text-gray-500">
            Overall
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            Overall progress
          </span>

          <span className="text-xs font-semibold text-gray-900">
            {overallScore}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-black rounded-full"
          />
        </div>
      </div>

      {/* Aptitude Categories */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        {/* Quantitative */}
        <div className="bg-gray-50 rounded-xl p-3">
          <Calculator
            size={16}
            className="text-gray-700 mb-2"
          />

          <p className="text-xs text-gray-500">
            Quantitative
          </p>

          <p className="text-sm font-bold text-gray-900 mt-1">
            72%
          </p>
        </div>

        {/* Logical */}
        <div className="bg-gray-50 rounded-xl p-3">
          <Lightbulb
            size={16}
            className="text-gray-700 mb-2"
          />

          <p className="text-xs text-gray-500">
            Logical
          </p>

          <p className="text-sm font-bold text-gray-900 mt-1">
            65%
          </p>
        </div>

        {/* Verbal */}
        <div className="bg-gray-50 rounded-xl p-3">
          <BookOpen
            size={16}
            className="text-gray-700 mb-2"
          />

          <p className="text-xs text-gray-500">
            Verbal
          </p>

          <p className="text-sm font-bold text-gray-900 mt-1">
            68%
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-gray-100">
        <p className="text-xs font-semibold text-gray-900">
          Recommended Practice
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Focus on logical reasoning and quantitative aptitude to improve
          your overall score.
        </p>
      </div>

      {/* Action */}
      <button
        type="button"
        className="
          mt-5
          flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-gray-900
          hover:gap-3
          transition-all
        "
      >
        Start Aptitude Practice
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

export default AptitudePreparation;