import { Loader2 } from "lucide-react";

function Button({
  text,
  type = "button",
  loading = false,
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className="
        w-full
        h-9
        bg-black
        text-white
        text-xs
        rounded-md
        font-semibold
        flex
        items-center
        justify-center
        gap-2
        transition-all
        duration-200
        hover:bg-gray-900
        active:scale-95
        disabled:opacity-60
        disabled:cursor-not-allowed
      "
    >
      {loading && (
        <Loader2
          size={15}
          className="animate-spin"
        />
      )}

      {loading ? "Please wait..." : text}
    </button>
  );
}

export default Button;