import { useEffect, useState } from "react";
import { Navigate, useSearchParams, Link } from "react-router-dom";
import { ShieldAlert, ArrowRight } from "lucide-react";
import Navbar from "../components/auth/Navbar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProfileCompletion from "../components/dashboard/ProfileCompletion";
import CareerGoalCard from "../components/dashboard/CareerGoalCard";
import ResumeScoreCard from "../components/dashboard/ResumeScoreCard";
import InterviewPreparation from "../components/dashboard/InterviewPreparation";
import AptitudePreparation from "../components/dashboard/AptitudePreparation";
import { getCurrentUser, fetchMe } from "../services/authService";

function Dashboard() {
  const [searchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const isPreviewMode = searchParams.get("view") === "user";

  useEffect(() => {
    fetchMe()
      .then((user) => {
        if (user) setCurrentUser(user);
      })
      .catch(() => {});
  }, []);

  const isAdmin = currentUser?.role === "admin";

  // If administrator arrives on /dashboard without explicit preview mode, redirect to admin home
  if (isAdmin && !isPreviewMode) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c0e14] text-gray-900 dark:text-gray-100 transition-colors duration-150">
      {/* Administrator Preview Notification Banner */}
      {isAdmin && isPreviewMode && (
        <div className="bg-indigo-900 text-white px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-300 shrink-0" />
            <span>
              <strong>Administrator Mode:</strong> You are previewing the user dashboard as{" "}
              <span className="font-semibold">{currentUser?.email}</span>.
            </span>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded shadow-xs transition"
          >
            <span>Return to Admin Portal</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <DashboardHeader />

        {/* Profile Completion */}
        <div className="mt-6">
          <ProfileCompletion />
        </div>

        {/* Career Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <CareerGoalCard />
          <ResumeScoreCard />
        </div>

        {/* Interview & Aptitude */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <InterviewPreparation />
          <AptitudePreparation />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
