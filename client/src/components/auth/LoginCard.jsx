import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

import InputField from "./InputField";
import Button from "./Button";
import Divider from "./Divider";
import GoogleButton from "./GoogleButton";
import ForgotPasswordModal from "./ForgotPasswordModal";

import {
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
  getPostLoginRedirect,
} from "../../services/authService";

function LoginCard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Step: "credentials" | "otp"
  const [step, setStep] = useState("credentials");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [devHint, setDevHint] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const otpInputRef = useRef(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Focus OTP input when switching to OTP step
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (devHint) setDevHint("");
  };

  // Step 1: Submit email & password -> Trigger email OTP
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDevHint("");

    const cleanEmail = formData.email.trim();
    if (!cleanEmail || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({
        email: cleanEmail,
        password: formData.password,
      });

      if (res.data.requiresOtp) {
        setSessionToken(res.data.sessionToken);
        setMaskedEmail(res.data.maskedEmail || cleanEmail);
        setCooldown(res.data.cooldown || 60);
        setStep("otp");
        setOtp("");
        toast.success(res.data.message || "Verification code sent to your email.");
      } else if (res.data.token) {
        // Direct session fallback (e.g. if OTP bypassed by server policy)
        toast.success("Login Successful!");
        const fromPath = location.state?.from?.pathname || location.state?.from;
        const targetRoute = getPostLoginRedirect(res.data.user, fromPath);
        navigate(targetRoute, { replace: true });
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || "Invalid email or password.";
      setError(serverMsg);

      if (err.response?.data?.devHint) {
        setDevHint(err.response.data.devHint);
      }

      if (err.response?.data?.retryAfter) {
        setCooldown(err.response.data.retryAfter);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP -> Create authenticated session
  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setDevHint("");

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyLoginOtp({
        email: formData.email.trim().toLowerCase(),
        sessionToken,
        otp: cleanOtp,
      });

      toast.success(res.data.message || "Login Successful!");
      const fromPath = location.state?.from?.pathname || location.state?.from;
      const targetRoute = getPostLoginRedirect(res.data.user, fromPath);
      navigate(targetRoute, { replace: true });
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || "Failed to verify code. Please try again.";
      setError(serverMsg);

      if (err.response?.data?.isExhausted || err.response?.data?.isExpired) {
        setOtp("");
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP code with cooldown check
  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setError("");
    setDevHint("");

    try {
      setResending(true);
      const res = await resendLoginOtp({
        email: formData.email.trim().toLowerCase(),
        sessionToken,
      });

      if (res.data.sessionToken) {
        setSessionToken(res.data.sessionToken);
      }
      setCooldown(res.data.cooldown || 60);
      setOtp("");
      toast.success(res.data.message || "A new verification code has been sent.");
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || "Unable to resend verification code.";
      setError(serverMsg);

      if (err.response?.data?.devHint) {
        setDevHint(err.response.data.devHint);
      }

      if (err.response?.data?.retryAfter) {
        setCooldown(err.response.data.retryAfter);
      }
    } finally {
      setResending(false);
    }
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setOtp("");
    setError("");
    setDevHint("");
  };

  const handleOtpChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, ""); // Only digits allowed
    if (rawVal.length <= 6) {
      setOtp(rawVal);
      if (error) setError("");
    }
  };

  return (
    <div className="flex justify-center px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 transition-colors duration-150"
      >
        <AnimatePresence mode="wait">
          {step === "credentials" ? (
            <motion.div
              key="step-credentials"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
                Welcome Back
              </h2>

              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Sign in to continue your career & interview preparation
              </p>

              <form className="mt-8" onSubmit={handleCredentialSubmit}>
                {error && (
                  <div className="mb-4 rounded-lg bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 p-3 text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {devHint && (
                  <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-3 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                    <strong className="block font-semibold mb-1">Configuration Required:</strong>
                    {devHint}
                  </div>
                )}

                <InputField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  disabled={loading}
                  onChange={handleChange}
                />

                <InputField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  disabled={loading}
                  onChange={handleChange}
                />

                <div className="flex justify-end mb-5">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  text="Continue to Sign In"
                  type="submit"
                  loading={loading}
                  disabled={loading}
                />

                <Divider />

                {/* Continue with Google Option */}
                <GoogleButton />

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/signup")}
                    className="font-semibold text-black dark:text-white cursor-pointer hover:underline"
                  >
                    Sign Up
                  </span>
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/60">
                  <ShieldCheck size={28} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
                Two-Factor Verification
              </h2>

              <p className="mt-2 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Enter the 6-digit verification code sent to:
                <br />
                <strong className="text-gray-800 dark:text-gray-200">{maskedEmail}</strong>
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleOtpSubmit}>
                {error && (
                  <div className="rounded-lg bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 p-3 text-red-700 dark:text-red-400 text-xs sm:text-sm">
                    {error}
                  </div>
                )}

                {devHint && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-3 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                    <strong className="block font-semibold mb-1">Configuration Required:</strong>
                    {devHint}
                  </div>
                )}

                <div>
                  <label className="block mb-2 text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    ref={otpInputRef}
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={loading}
                    className="
                      w-full
                      h-12
                      text-center
                      font-mono
                      text-2xl
                      tracking-[0.35em]
                      font-bold
                      rounded-lg
                      border
                      border-gray-300
                      dark:border-gray-700
                      bg-gray-50
                      dark:bg-gray-800
                      px-4
                      text-gray-900
                      dark:text-white
                      outline-none
                      transition
                      focus:bg-white
                      dark:focus:bg-gray-900
                      focus:border-blue-500
                      dark:focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-200
                      dark:focus:ring-blue-900/50
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  />
                  <p className="mt-1.5 text-center text-xs text-gray-400 dark:text-gray-500">
                    Code expires in 10 minutes
                  </p>
                </div>

                <Button
                  text="Verify & Sign In"
                  type="submit"
                  loading={loading}
                  disabled={loading || otp.length !== 6}
                />

                <div className="pt-2 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resending || loading}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer font-medium transition-colors"
                  >
                    <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
                    {cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : resending
                      ? "Sending new code..."
                      : "Resend Code"}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToCredentials}
                    className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors"
                  >
                    <ArrowLeft size={13} />
                    Back to email & password
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
}

export default LoginCard;
