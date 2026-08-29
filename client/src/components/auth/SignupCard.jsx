import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import InputField from "./InputField";
import Button from "./Button";
import GoogleButton from "./GoogleButton";
import Divider from "./Divider";
import PasswordStrength from "./PasswordStrength";
import PasswordMatch from "./PasswordMatch";
import EmailValidation from "./EmailValidation";

import { registerUser } from "../../services/authService";

function SignupCard() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      await registerUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Registration Successful");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 pb-3">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="
          w-full
          max-w-sm
          bg-white
          rounded-xl
          shadow-md
          border
          border-gray-200
          px-6
          py-4
        "
      >
        {/* Heading */}
        <h2 className="text-xl font-bold text-center text-gray-900">
          Create Your Account
        </h2>

        <p className="mt-0.5 text-center text-xs text-gray-500">
          Start your journey to interview success
        </p>

        <form className="mt-4" onSubmit={handleSubmit}>
          {/* Error */}
          {error && (
            <div className="mb-2 rounded-md bg-red-50 border border-red-200 px-2 py-1 text-xs text-red-600">
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
            placeholder="Enter your email"
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
              checked={formData.agree}
              onChange={handleChange}
              className="w-3.5 h-3.5 accent-black"
            />

            <label className="text-[11px] text-gray-600">
              I agree to the Terms of Service
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
      </motion.div>
    </div>
  );
}

export default SignupCard;