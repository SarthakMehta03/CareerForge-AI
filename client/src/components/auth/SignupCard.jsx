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
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
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
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Create Your Account
        </h2>

        <p className="mt-2 text-center text-gray-500">
          Start your journey to interview success
        </p>

        <form className="mt-8" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-red-700">
              {error}
            </div>
          )}

          <InputField
            name="fullName"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <InputField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <EmailValidation email={formData.email} />

          <InputField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <PasswordStrength password={formData.password} />

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

          <div className="flex items-center gap-3 my-5">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="w-4 h-4"
            />

            <label className="text-sm text-gray-600">
              I agree to the Terms of Service
            </label>
          </div>

          <Button
            text="Create Account"
            type="submit"
            loading={loading}
          />

          <Divider />

          <GoogleButton />

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-semibold text-black cursor-pointer hover:underline"
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