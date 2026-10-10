import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/auth/Navbar";
import InputField from "../components/auth/InputField";
import Button from "../components/auth/Button";
import PasswordStrength from "../components/auth/PasswordStrength";
import PasswordMatch from "../components/auth/PasswordMatch";
import { resetPasswordWithToken } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPasswordWithToken(token, password);
      toast.success(res.data.message || "Password reset successfully!");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link may be expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <div className="flex justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Create a strong password for your account
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
                {error}
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
                placeholder="Re-enter new password"
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
                text="Reset Password"
                type="submit"
                loading={loading}
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-xs text-gray-500 hover:text-black hover:underline cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <div className="py-6 text-center text-xs text-gray-400">
        © CareerForge-AI. All rights reserved.
      </div>
    </div>
  );
}

export default ResetPassword;
