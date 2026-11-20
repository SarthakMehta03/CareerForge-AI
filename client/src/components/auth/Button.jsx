import { Loader2 } from "lucide-react";

function Button({
  text,
  type = "button",
  loading = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="
        w-full
        h-9
        bg-gray-900
        dark:bg-blue-600
        text-white
        dark:text-white
        text-xs
        rounded-md
        font-semibold
        flex
        items-center
        justify-center
        gap-2
        transition-all
        duration-200
        hover:bg-black
        dark:hover:bg-blue-500
        active:scale-95
        disabled:opacity-60
        disabled:cursor-not-allowed
        cursor-pointer
        shadow-xs
      "
    >
      {loading && (
        <Loader2
          size={15}
          className="animate-spin text-white dark:text-gray-950"
        />
      )}

      {loading ? "Please wait..." : text}
    </button>
  );
}

export default Button;
