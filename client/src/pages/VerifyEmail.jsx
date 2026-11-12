import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Mail, RefreshCw, Rocket } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/auth/Navbar";
import { verifyEmailToken, resendVerificationEmail } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const hasCalledRef = React.useRef(false);

  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;

    async function handleVerify() {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided in URL.");
        return;
      }

      try {
        const res = await verifyEmailToken(token);
        setStatus("success");
        setMessage(res.data?.message || "Email verified successfully!");
        if (res.data?.user) {
          updateUser(res.data.user);
        }
        // Redirect to dashboard after 3.5 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 3500);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "This verification link is invalid or has expired. Please request a new verification email."
        );
      }
    }

    handleVerify();
  }, [token, navigate, updateUser]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setResending(true);
      const res = await resendVerificationEmail(resendEmail);
      toast.success(res.data?.message || "Verification email sent! Check your inbox.");
      setResendEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center"
        >
          {/* Logo Brand Header */}
          <div className="flex justify-center mb-5">
            <div className="bg-black p-2.5 rounded-xl shadow-sm">
              <Rocket className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* ── VERIFYING STATE ── */}
          {status === "verifying" && (
            <div className="space-y-4 py-4">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
              <h2 className="text-xl font-bold text-gray-900">Verifying your Gmail...</h2>
              <p className="text-sm text-gray-500">
                Please wait a moment while we activate your CareerForge-AI account.
              </p>
            </div>
          )}

          {/* ── SUCCESS STATE ── */}
          {status === "success" && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                {message}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={16} />
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Automatically redirecting you in a few seconds...
                </p>
              </div>
            </div>
          )}

          {/* ── ERROR STATE ── */}
          {status === "error" && (
            <div className="space-y-5">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <XCircle size={36} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Resend Verification Form */}
              <div className="pt-3 border-t border-gray-100 text-left">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Need a new verification link?
                </p>
                <form onSubmit={handleResend} className="space-y-2">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="Enter your Gmail address"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:border-black focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
                    <span>{resending ? "Sending..." : "Resend Verification Email"}</span>
                  </button>
                </form>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-gray-600 hover:text-black hover:underline"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
        © CareerForge-AI. All rights reserved.
      </footer>
    </div>
  );
}

export default VerifyEmail;
