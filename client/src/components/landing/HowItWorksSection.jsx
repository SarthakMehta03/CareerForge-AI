import {
  UserCircle2,
  BrainCircuit,
  FileCheck2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    number: "01",
    title: "Set Up Your Profile",
    description:
      "Enter your educational background, core technical skills, verified projects, and career preferences to establish your personalized placement foundation.",
    icon: UserCircle2,
    route: "/profile",
    actionLabel: "View Profile Setup",
  },
  {
    number: "02",
    title: "Practice and Prepare",
    description:
      "Work through quantitative, logical, and verbal aptitude topics, and simulate technical & HR interview rounds with structured instant feedback.",
    icon: BrainCircuit,
    route: "/aptitude",
    actionLabel: "Explore Preparation Tools",
  },
  {
    number: "03",
    title: "Build Your Resume",
    description:
      "Select an industry-standard template, compose your achievements with guided sections, preview live changes, and export an ATS-friendly PDF.",
    icon: FileCheck2,
    route: "/resumes",
    actionLabel: "See Resume Options",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50/60 dark:bg-[#10131d]/60 border-b border-gray-200 dark:border-[#232a3d] transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#141824] border border-gray-200 dark:border-[#232a3d] text-xs font-semibold text-gray-800 dark:text-gray-200 mb-3 shadow-2xs">
            <span>Simple 3-Step Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            How CareerForge-AI Works
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            A clear, structured path from initial setup to placement readiness.
          </p>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white dark:bg-[#141824] rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-[#232a3d] shadow-2xs hover:border-gray-400 dark:hover:border-blue-500/40 transition-colors flex flex-col justify-between h-full"
              >
                <div className="flex-1 flex flex-col">
                  {/* Step Header: Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-300 dark:text-[#232a3d] font-mono">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-blue-500/15 border border-transparent dark:border-blue-500/20 flex items-center justify-center text-gray-900 dark:text-blue-400">
                      <Icon size={22} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-[#232a3d]">
                  <Link
                    to={step.route}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-blue-400 hover:text-black dark:hover:text-blue-300 group transition-colors"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
