import {
  Clock,
  Target,
  FileCheck,
  CheckCircle,
} from "lucide-react";

const VALUE_PILLARS = [
  {
    icon: Clock,
    title: "Practice at Your Own Pace",
    description:
      "Review foundational formulas, practice topic-wise questions, and test yourself on your own schedule.",
  },
  {
    icon: Target,
    title: "Improve Problem-Solving Skills",
    description:
      "Master quantitative, logical, and verbal concepts essential for campus placement aptitude assessments.",
  },
  {
    icon: CheckCircle,
    title: "Prepare for Technical & HR Interviews",
    description:
      "Engage in structured interview sessions with AI-generated questions tailored to your target job role.",
  },
  {
    icon: FileCheck,
    title: "Build a Professional Resume",
    description:
      "Structure your education, projects, skills, and experience with clean, ATS-optimized resume templates.",
  },
];

function ValueProposition() {
  return (
    <section
      id="value-proposition"
      aria-labelledby="value-prop-heading"
      className="py-12 sm:py-16 bg-gray-50/70 dark:bg-[#10131d]/70 border-b border-gray-200 dark:border-[#232a3d] transition-colors duration-150"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2
            id="value-prop-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Engineered for Placement Success
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            A cohesive environment designed to build core competencies step-by-step
            without distraction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PILLARS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-[#141824] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#232a3d] shadow-2xs hover:border-gray-400 dark:hover:border-blue-500/40 transition-colors flex flex-col h-full"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-blue-500/15 border border-transparent dark:border-blue-500/20 flex items-center justify-center text-gray-900 dark:text-blue-400 mb-4 shrink-0">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-auto">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ValueProposition;
