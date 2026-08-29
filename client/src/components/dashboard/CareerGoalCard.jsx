import { motion } from "framer-motion";
import { Target, ArrowRight } from "lucide-react";

function CareerGoalCard() {
  const matchScore = 87;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center">
            <Target size={21} className="text-white" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Current Career Goal
            </p>

            <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
              MERN Stack Developer
            </h2>
          </div>
        </div>

        {/* Match Score */}
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {matchScore}%
          </p>

          <p className="text-xs text-gray-500">
            Match
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-5">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Key Skills
        </p>

        <div className="flex flex-wrap gap-2">
          {["React.js", "Node.js", "MongoDB", "Express.js"].map(
            (skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-medium text-gray-700"
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
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all"
      >
        View Career Path
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

export default CareerGoalCard;