import { motion } from "framer-motion";
import { UserRound, ArrowRight } from "lucide-react";

function ProfileCompletion() {
  const completion = 82;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center">
            <UserRound size={21} className="text-white" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Completion
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Complete your profile for better AI recommendations.
            </p>
          </div>
        </div>

        {/* Percentage */}
        <span className="text-2xl font-bold text-gray-900">
          {completion}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-black rounded-full"
          />
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all"
      >
        Complete Profile
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

export default ProfileCompletion;