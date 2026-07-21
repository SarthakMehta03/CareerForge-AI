function Divider({ text = "OR" }) {
  return (
    <div className="flex items-center my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300"></div>

      <span className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
        {text}
      </span>

      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300"></div>
    </div>
  );
}

export default Divider;