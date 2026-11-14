import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import InputField from "./InputField";
import Button from "./Button";
import GoogleButton from "./GoogleButton";
import Divider from "./Divider";
import PasswordStrength from "./PasswordStrength";
import PasswordMatch from "./PasswordMatch";
import EmailValidation from "./EmailValidation";

import { registerUser, resendVerificationEmail, verifyEmailCode } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function SignupCard() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registeredData, setRegisteredData] = useState(null); // { email, emailSent }
  const [otpCode, setOtpCode] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resending, setResending] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.agree) {
      setError("Please accept the Terms of Service.");
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Verification code sent to your Gmail!");

      setRegisteredData({
        email: formData.email,
        emailSent: res.data?.emailSent,
      });

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setVerifyingCode(true);
      const res = await verifyEmailCode(registeredData.email, otpCode.trim());
      toast.success("Account verified successfully! Welcome to CareerForge-AI.");
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired verification code.");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResend = async () => {
    if (!registeredData?.email) return;

    try {
      setResending(true);
      const res = await resendVerificationEmail(registeredData.email);
      toast.success(res.data?.message || "Verification code resent! Check your Gmail.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend verification code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex justify-center px-4 pb-3">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm bg-white rounded-xl shadow-md border border-gray-200 px-6 py-6"
      >
        {/* ── VIEW A: REGISTRATION SUCCESSFUL → ENTER 6-DIGIT CODE OR CLICK EMAIL LINK ── */}
        {registeredData ? (
          <div className="text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Mail size={28} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">Check Your Gmail</h2>
              <p className="mt-1 text-xs text-gray-500">
                We sent a 6-digit code and activation link to:
              </p>
              <p className="text-sm font-bold text-gray-900 mt-0.5 break-all">
                {registeredData.email}
              </p>
            </div>

            {/* ── 6-Digit OTP Code Verification Form (Works directly from phone/laptop!) ── */}
            <form onSubmit={handleVerifyOtp} className="space-y-2 text-left pt-1">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <KeyRound size={13} className="text-indigo-600" />
                <span>Enter 6-Digit Code from your Gmail:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full tracking-widest text-center text-xl font-mono font-bold py-2 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={verifyingCode || otpCode.length !== 6}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-40 cursor-pointer shrink-0"
                >
                  {verifyingCode ? "Verifying..." : "Verify Code"}
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                💡 Check your phone's Gmail app, type the 6 digits above, and verify instantly!
              </p>
            </form>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <p className="text-xs text-gray-500">
                Or if checking Gmail on this computer, you can also click the button inside the email.
              </p>

              {/* Resend Link Button */}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw size={12} className={resending ? "animate-spin text-indigo-600" : ""} />
                <span>{resending ? "Resending code..." : "Didn't receive email? Resend code"}</span>
              </button>
            </div>

            <div className="pt-1">
              <Link
                to="/login"
                className="text-xs font-semibold text-gray-600 hover:text-black hover:underline"
              >
                ← Back to Log In
              </Link>
            </div>
          </div>
        ) : (
          /* ── VIEW B: SIGNUP FORM ── */
          <>
            {/* Heading */}
            <h2 className="text-xl font-bold text-center text-gray-900">
              Create Your Account
            </h2>

            <p className="mt-0.5 text-center text-xs text-gray-500">
              Start your journey to career success
            </p>

            <form className="mt-4" onSubmit={handleSubmit}>
              {/* Error */}
              {error && (
                <div className="mb-2 rounded-md bg-red-50 border border-red-200 px-2 py-1.5 text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <InputField
                name="fullName"
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />

              {/* Email */}
              <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your Gmail address"
                value={formData.email}
                onChange={handleChange}
              />

              <EmailValidation email={formData.email} />

              {/* Password */}
              <InputField
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              <PasswordStrength password={formData.password} />

              {/* Confirm Password */}
              <InputField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <PasswordMatch
                password={formData.password}
                confirmPassword={formData.confirmPassword}
              />

              {/* Terms */}
              <div className="flex items-center gap-2 mt-1 mb-2">
                <input
                  type="checkbox"
                  name="agree"
                  id="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 accent-black cursor-pointer"
                />

                <label htmlFor="agree" className="text-[11px] text-gray-600 cursor-pointer">
                  I agree to the Terms of Service & Privacy Policy
                </label>
              </div>

              {/* Create Account */}
              <Button
                text="Create Account"
                type="submit"
                loading={loading}
              />

              {/* Divider */}
              <Divider />

              {/* Google */}
              <GoogleButton />

              {/* Login */}
              <p className="text-center text-[11px] text-gray-500 mt-2">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="font-semibold text-gray-900 cursor-pointer hover:underline"
                >
                  Log In
                </span>
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default SignupCard;
