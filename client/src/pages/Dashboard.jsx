import Navbar from "../components/auth/Navbar";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProfileCompletion from "../components/dashboard/ProfileCompletion";
import CareerGoalCard from "../components/dashboard/CareerGoalCard";
import ResumeScoreCard from "../components/dashboard/ResumeScoreCard";
import InterviewPreparation from "../components/dashboard/InterviewPreparation";
import AptitudePreparation from "../components/dashboard/AptitudePreparation";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
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