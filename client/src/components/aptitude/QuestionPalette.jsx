import { Check, Bookmark } from "lucide-react";

function QuestionPalette({
  questions = [],
  currentIndex = 0,
  answers = {},
  markedForReview = {},
  onSelectQuestion,
}) {
  const getQuestionState = (index, questionId) => {
    const isCurrent = index === currentIndex;
    const isAnswered = answers[questionId] !== undefined && answers[questionId] !== null;
    const isMarked = !!markedForReview[questionId];

    if (isAnswered && isMarked) {
      return {
        label: "Answered & Marked",
        badge: "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800/60",
        icon: <Bookmark size={11} className="fill-purple-600 dark:fill-purple-400 text-purple-600 dark:text-purple-400" />,
        aria: `Question ${index + 1}: Answered and marked for review`,
      };
    }
    if (isMarked) {
      return {
        label: "Marked for Review",
        badge: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/60",
        icon: <Bookmark size={11} className="text-amber-700 dark:text-amber-400" />,
        aria: `Question ${index + 1}: Marked for review, unanswered`,
      };
    }
    if (isAnswered) {
      return {
        label: "Answered",
        badge: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60",
        icon: <Check size={11} className="stroke-[2.5]" />,
        aria: `Question ${index + 1}: Answered`,
      };
    }
    return {
      label: "Unanswered",
      badge: "bg-gray-100 dark:bg-[#1c2234] text-gray-700 dark:text-gray-400 border-gray-200 dark:border-[#232a3d]",
      icon: null,
      aria: `Question ${index + 1}: Unanswered`,
    };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Question Palette
        </h4>
        <span className="text-[11px] text-gray-500">
          {Object.keys(answers).length} / {questions.length} answered
        </span>
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {questions.map((q, idx) => {
          const state = getQuestionState(idx, q.id);
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              aria-label={state.aria}
              className={`
                relative h-10 rounded-xl font-bold text-xs flex items-center justify-center transition border
                ${isCurrent ? "ring-2 ring-black dark:ring-blue-500 ring-offset-1 dark:ring-offset-[#141824] border-black dark:border-blue-500" : ""}
                ${state.badge}
                hover:opacity-85 active:scale-95
              `}
            >
              <span>{idx + 1}</span>
              {state.icon && (
                <span className="absolute top-1 right-1">
                  {state.icon}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend with explicit accessible text labels and icons */}
      <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-[#232a3d] space-y-2 text-[11px] text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
            <Check size={11} className="stroke-[2.5]" />
          </span>
          <span>Answered</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 flex items-center justify-center text-amber-800 dark:text-amber-300">
            <Bookmark size={11} />
          </span>
          <span>Marked for Review</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800/60 flex items-center justify-center text-purple-800 dark:text-purple-300">
            <Bookmark size={11} className="fill-purple-600 dark:fill-purple-400 text-purple-600 dark:text-purple-400" />
          </span>
          <span>Answered & Marked</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-[#1c2234] border border-gray-200 dark:border-[#232a3d] flex items-center justify-center text-gray-700 dark:text-gray-400">
            -
          </span>
          <span>Unanswered</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-white dark:bg-[#141824] border-2 border-black dark:border-blue-400 flex items-center justify-center text-black dark:text-blue-400 font-bold">
            •
          </span>
          <span>Current Question</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionPalette;
