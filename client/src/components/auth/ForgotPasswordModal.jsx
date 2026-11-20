import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import toast from "react-hot-toast";

import InputField from "./InputField";
import Button from "./Button";
import { requestForgotPassword } from "../../services/authService";

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [devHint, setDevHint] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading || cooldown > 0) return;

    setError("");
    setDevHint("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await requestForgotPassword(cleanEmail);
      toast.success(res.data?.message || "Reset link sent if account exists.");
      setSubmitted(true);
      setCooldown(60); // 60s cooldown between requests
    } catch (err) {
      const serverMessage =
        err.response?.data?.message || "Failed to request password reset link.";
      setError(serverMessage);

      // Helpful developer setup instructions returned by server in non-production
      if (err.response?.data?.devHint) {
        setDevHint(err.response.data.devHint);
      }

      // If server returned a rate limit or cooldown retry interval
      if (err.response?.data?.retryAfter) {
        setCooldown(err.response.data.retryAfter);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEmail("");
    setSubmitted(false);
    setError("");
    setDevHint("");
    setCooldown(0);
    onClose();
  };

  const handleDifferentEmail = () => {
    setSubmitted(false);
    setError("");
    setDevHint("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 transition-colors duration-150"
        >
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <IoClose size={22} />
          </button>

          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/60">
              <HiOutlineMail size={26} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center tracking-tight">
            Reset Password
          </h3>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 text-center">
            {submitted
              ? "Check your inbox for the password reset link."
              : "Enter your registered email to receive a password reset link."}
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 p-3 text-red-700 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          {devHint && (
            <div className="mt-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-3 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
              <strong className="block font-semibold mb-1">Configuration Required:</strong>
              {devHint}
            </div>
          )}

          {submitted ? (
            <div className="mt-6 space-y-4 text-center">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm">
                <p className="font-semibold text-emerald-950 dark:text-emerald-200 mb-1">
                  Email Dispatched
                </p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  If an account is associated with <strong>{email}</strong>, a secure password reset link has been sent. The link expires in 15 minutes.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  text={
                    cooldown > 0
                      ? `Resend Link in ${cooldown}s`
                      : "Resend Reset Link"
                  }
                  type="button"
                  loading={loading}
                  disabled={loading || cooldown > 0}
                  onClick={handleSubmit}
                />

                <button
                  type="button"
                  onClick={handleDifferentEmail}
                  className="w-full py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Use a different email address
                </button>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <Button
                  text="Close"
                  type="button"
                  onClick={handleModalClose}
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5">
              <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                disabled={loading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                  if (devHint) setDevHint("");
                }}
              />

              <div className="mt-6">
                <Button
                  text={
                    cooldown > 0
                      ? `Please wait ${cooldown}s`
                      : "Send Reset Link"
                  }
                  type="submit"
                  loading={loading}
                  disabled={loading || cooldown > 0}
                />
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ForgotPasswordModal;
