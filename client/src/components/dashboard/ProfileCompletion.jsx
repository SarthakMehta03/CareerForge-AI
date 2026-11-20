import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserRound, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProfile } from "../../services/profileService";

function ProfileCompletion() {
  const [completion, setCompletion] = useState(82);

  useEffect(() => {
    let isMounted = true;
    getProfile()
      .then((data) => {
        if (isMounted && data?.completion?.percentage !== undefined) {
          setCompletion(data.completion.percentage);
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic completion:", err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gray-900 dark:bg-blue-500/15 dark:border dark:border-blue-500/25 flex items-center justify-center group-hover:scale-105 group-hover:shadow-sm transition-transform duration-200">
            <UserRound size={21} className="text-white dark:text-blue-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Completion
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Complete your profile for better AI recommendations.
            </p>
          </div>
        </div>

        {/* Percentage */}
        <span className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-200">
          {completion}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="w-full h-2.5 bg-gray-100 dark:bg-[#1c2234] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gray-900 dark:bg-blue-500 rounded-full"
          />
        </div>
      </div>

      {/* Action */}
      <Link
        to="/profile"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors"
      >
        <span>Complete Profile</span>
        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}

export default ProfileCompletion;
