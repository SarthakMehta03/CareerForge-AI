import { FcGoogle } from "react-icons/fc";

function GoogleButton() {
  return (
    <button
      type="button"
      className="
        w-full
        flex
        items-center
        justify-center
        gap-3
        py-3.5
        rounded-xl
        border
        border-gray-200
        bg-white
        font-medium
        text-gray-700
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
        hover:border-gray-400
        hover:-translate-y-0.5
        active:translate-y-0
        active:scale-95
        "
    >
      <FcGoogle size={22} />

      <span>Continue with Google</span>
    </button>
  );
}

export default GoogleButton;