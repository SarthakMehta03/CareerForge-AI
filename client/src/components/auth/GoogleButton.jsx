import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { googleLoginUser, getPostLoginRedirect } from "../../services/authService";

function GoogleButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await googleLoginUser({
        accessToken: tokenResponse.access_token,
        idToken: tokenResponse.id_token,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Google Sign-In Successful!");
        const fromPath = location.state?.from?.pathname || location.state?.from;
        const targetRoute = getPostLoginRedirect(res.data.user, fromPath);
        navigate(targetRoute, { replace: true });
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      toast.error(
        err.response?.data?.message || "Google authentication failed."
      );
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error("Google Login Failed:", error);
      toast.error("Google authentication process was cancelled or failed.");
    },
  });

  return (
    <button
      type="button"
      onClick={() => loginWithGoogle()}
      className="
        w-full
        h-10
        flex
        items-center
        justify-center
        gap-2.5
        rounded-xl
        border
        border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-gray-800
        font-medium
        text-xs
        sm:text-sm
        text-gray-700
        dark:text-gray-200
        shadow-2xs
        transition-all
        duration-200
        hover:shadow-md
        hover:border-gray-400
        dark:hover:border-gray-500
        dark:hover:bg-gray-750
        active:scale-95
        cursor-pointer
      "
    >
      <FcGoogle size={18} />
      <span>Continue with Google</span>
    </button>
  );
}

export default GoogleButton;
