import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, RotateCcw, Share2 } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/auth/Navbar";
import TestSummary from "../components/aptitude/TestSummary";
import TopicPerformance from "../components/aptitude/TopicPerformance";
import IncorrectQuestions from "../components/aptitude/IncorrectQuestions";

import { getResultById, getAptitudeHistory } from "../services/aptitudeService";

function AptitudeResult() {
  const { attemptId } = useParams();

  // Load result by ID if provided, otherwise latest in user's history
  const result = useMemo(() => {
    if (attemptId) {
      return getResultById(attemptId);
    }
    const history = getAptitudeHistory();
    return history[0] || null;
  }, [attemptId]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0c0e14] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-150">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Assessment Result Not Found or Access Denied
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            The requested assessment record could not be found in your active account history, or belongs to another user.
          </p>
          <div className="pt-2">
            <Link
              to="/aptitude"
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white font-semibold text-xs inline-flex items-center gap-2 transition shadow-xs cursor-pointer"
            >
              Return to Aptitude Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Result URL copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c0e14] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/aptitude"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black dark:hover:text-blue-400 transition"
          >
            <ChevronLeft size={16} />
            Back to Aptitude Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Share2 size={13} />
              Share
            </button>

            <Link
              to="/aptitude/test"
              className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <RotateCcw size={13} />
              Take Another Test
            </Link>
          </div>
        </div>

        {/* Header Title Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Score Report
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 font-medium">
                {new Date(result.completedAt).toLocaleDateString()} at {new Date(result.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              {result.title || "Aptitude Assessment Report"}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
              {result.totalQuestions} Questions
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 capitalize">
              {result.difficulty} Level
            </span>
          </div>
        </div>

        {/* 1. Overall Score Summary */}
        <TestSummary result={result} />

        {/* 2. Topic and Difficulty Performance Tables */}
        <TopicPerformance
          topicPerformance={result.topicPerformance}
          difficultyPerformance={result.difficultyPerformance}
        />

        {/* 3. Detailed Question Review & Solutions */}
        <IncorrectQuestions evaluatedQuestions={result.evaluatedQuestions} />
      </main>
    </div>
  );
}

export default AptitudeResult;
