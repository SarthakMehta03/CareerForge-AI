import { FcGoogle } from "react-icons/fc";

function GoogleButton() {
  return (
    <button
      type="button"
      className="
        w-full
        h-9
        flex
        items-center
        justify-center
        gap-2
        rounded-md
        border
        border-gray-200
        bg-white
        font-medium
        text-xs
        text-gray-700
        shadow-sm
        transition-all
        duration-200
        hover:shadow-md
        hover:border-gray-400
        active:scale-95
      "
    >
      <FcGoogle size={17} />

      <span>Continue with Google</span>
    </button>
  );
}

export default GoogleButton;