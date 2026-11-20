import { useState } from "react";
import { useParams, useNavigate, useSearchParams, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import InputField from "../components/auth/InputField";
import Button from "../components/auth/Button";
import PasswordStrength from "../components/auth/PasswordStrength";
import PasswordMatch from "../components/auth/PasswordMatch";
import ThemeToggle from "../components/common/ThemeToggle";
import { BrandLogo } from "../components/common/BrandLogo";
import { resetPasswordWithToken } from "../services/authService";

function ResetPassword() {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryToken = searchParams.get("token") || "";
  const initialToken = paramToken || queryToken || "";

  const [resetToken, setResetToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const activeToken = (paramToken || resetToken || "").trim();

    if (!activeToken) {
      setError("Reset token is missing. Please check your reset link or enter your token.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPasswordWithToken(activeToken, password);

      toast.success(res.data?.message || "Password reset successfully! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link or token may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-between transition-colors duration-150 relative">
      {/* Top right Theme Toggle for focused layout */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16">
        {/* Brand Logo & App Name Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <NavLink
            to="/"
            className="inline-flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-black dark:focus:ring-white rounded-lg p-1.5 transition-transform hover:scale-[1.02]"
          >
            <BrandLogo className="w-10 h-10 sm:w-11 sm:h-11" />
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              CareerForge-AI
            </span>
          </NavLink>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 transition-colors duration-150"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
            Enter New Password
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Create a strong new password for your account
          </p>

          {error && (
            <div className="mt-6 rounded-lg bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 p-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            {!paramToken && !queryToken && (
              <div>
                <InputField
                  name="resetToken"
                  label="Reset Token"
                  type="text"
                  placeholder="Paste your reset token from email"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                />
              </div>
            )}

            <div>
              <InputField
                name="password"
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordStrength password={password} />
            </div>

            <div>
              <InputField
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <PasswordMatch
                password={password}
                confirmPassword={confirmPassword}
              />
            </div>

            <div className="pt-2">
              <Button
                text="Update Password"
                type="submit"
                loading={loading}
              />
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-3">
              Remember your password?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-semibold text-black dark:text-white cursor-pointer hover:underline"
              >
                Log In
              </span>
            </p>
          </form>
        </motion.div>
      </div>

      <div className="py-4 text-center text-xs text-gray-400 dark:text-gray-600">
        © CareerForge-AI. All rights reserved.
      </div>
    </div>
  );
}

export default ResetPassword;
