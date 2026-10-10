import { useState } from "react";
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
  const [resetSuccess, setResetSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await requestForgotPassword(email);
      setResetSuccess(res.data);
      if (res.data.emailSent) {
        toast.success("Email sent to your inbox!");
      } else {
        toast.success("Password reset link generated!");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEmail("");
    setResetSuccess(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8"
        >
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <IoClose size={22} />
          </button>

          <h3 className="text-2xl font-bold text-gray-900 text-center">
            Reset Password
          </h3>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Enter your email address to receive a password reset link.
          </p>

          {resetSuccess ? (
            <div className="mt-6 space-y-4 text-center">
              {resetSuccess.emailSent ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
                  <div className="flex items-center justify-center gap-2 font-semibold mb-1 text-green-900">
                    <HiOutlineMail size={22} />
                    <span>Email Sent Successfully!</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    We've sent a password reset email to <strong>{email}</strong>. Please check your inbox and click the link inside.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm text-left">
                  <p className="font-semibold mb-1 text-amber-950">Link Generated (Development Mode):</p>
                  <p className="text-xs text-amber-800 mb-2">
                    Add SMTP details to <code className="bg-amber-100 px-1 py-0.5 rounded">server/.env</code> to send real emails to your inbox. You can test directly using the link below:
                  </p>
                  <p className="text-xs break-all bg-white p-2.5 rounded border border-amber-300 font-mono select-all">
                    {resetSuccess.resetUrl}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(resetSuccess.resetUrl);
                    toast.success("Copied link to clipboard!");
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
                >
                  Copy Reset Link
                </button>
                <a
                  href={resetSuccess.resetUrl}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg bg-black text-white hover:bg-gray-800 text-center transition-colors"
                >
                  Open Link Now
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6">
              <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="mt-6">
                <Button
                  text="Send Reset Link"
                  type="submit"
                  loading={loading}
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
