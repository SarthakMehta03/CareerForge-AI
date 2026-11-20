function Divider({ text = "OR" }) {
  return (
    <div className="flex items-center my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-gray-300 dark:to-gray-700"></div>

      <span className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {text}
      </span>

      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 dark:via-gray-700 to-gray-300 dark:to-gray-700"></div>
    </div>
  );
}

export default Divider;
