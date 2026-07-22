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
        bg-black
        text-white
        py-3
        rounded-xl
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
          size={18}
          className="animate-spin"
        />
      )}

      {loading ? "Please wait..." : text}
    </button>
  );
}

export default Button;