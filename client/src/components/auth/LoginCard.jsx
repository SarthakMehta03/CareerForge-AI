import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, RefreshCw } from "lucide-react";

import InputField from "./InputField";
import Button from "./Button";
import Divider from "./Divider";
import GoogleButton from "./GoogleButton";
import ForgotPasswordModal from "./ForgotPasswordModal";

import { useAuth } from "../../context/AuthContext";
import { resendVerificationEmail } from "../../services/authService";

function LoginCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    try {
      setResending(true);
      const res = await resendVerificationEmail(unverifiedEmail);
      toast.success(res.data?.message || "Verification email resent! Check your Gmail.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUnverifiedEmail("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await login(formData);
      toast.success("Login Successful");

      // Redirect to where user came from, or dashboard
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.data?.isUnverified) {
        setUnverifiedEmail(err.response.data.email || formData.email);
        setError(err.response.data.message || "Please verify your email before logging in.");
      } else {
        setError(
          err.response?.data?.message || "Invalid email or password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
      >
        <h2 className="text-3xl font-bold text-center">
          Welcome Back
        </h2>

        <p className="mt-2 text-center text-gray-500">
          Sign in to continue building your career
        </p>

        <form className="mt-8" onSubmit={handleSubmit}>
          {error && (
            <div className={`mb-4 rounded-xl p-3 text-sm border ${
              unverifiedEmail
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              <p>{error}</p>
              {unverifiedEmail && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
                  <span>{resending ? "Sending link..." : "Resend Verification Email"}</span>
                </button>
              )}
            </div>
          )}

          <InputField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="flex justify-end mb-5">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-sm text-gray-600 hover:text-black hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            text="Log In"
            type="submit"
            loading={loading}
          />

          <Divider />

          <GoogleButton />

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="font-semibold text-black cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </form>
      </motion.div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
}

export default LoginCard;
