import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import InputField from "./InputField";
import Button from "./Button";
import Divider from "./Divider";
import GoogleButton from "./GoogleButton";
import ForgotPasswordModal from "./ForgotPasswordModal";

import { loginUser } from "../../services/authService";

function LoginCard() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(formData);

      localStorage.setItem("token", res.data.token);

      toast.success("Login Successful");

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
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
          Login to continue your interview preparation
        </p>

        <form className="mt-8" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-red-700 text-sm">
              {error}
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