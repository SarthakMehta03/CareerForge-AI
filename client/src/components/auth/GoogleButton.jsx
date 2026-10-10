import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { googleLoginUser } from "../../services/authService";

function GoogleButton() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const userInfoRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );
      const userInfo = await userInfoRes.json();

      if (!userInfo.email) {
        toast.error("Failed to retrieve Google profile information.");
        return;
      }

      const res = await googleLoginUser({ userInfo });

      if (res.data.success) {
        toast.success("Google Login Successful!");
        navigate("/dashboard");
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
        cursor-pointer
      "
    >
      <FcGoogle size={17} />
      <span>Continue with Google</span>
    </button>
  );
}

export default GoogleButton;