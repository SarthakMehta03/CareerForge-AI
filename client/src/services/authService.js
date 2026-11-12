import axios from "axios";

const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BASE_URL = RAW_API_URL.endsWith("/auth") ? RAW_API_URL : `${RAW_API_URL.replace(/\/$/, "")}/auth`;

const API = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to add Authorization Bearer token to headers automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register
export const registerUser = (userData) => {
  return API.post("/register", userData);
};

// Login
export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);

  // Save authentication data
  if (response.data.success) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response;
};

// Google Login
export const googleLoginUser = async (googlePayload) => {
  const response = await API.post("/google", googlePayload);

  if (response.data.success) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response;
};

// Forgot Password
export const requestForgotPassword = (email) => {
  return API.post("/forgot-password", { email });
};

// Reset Password
export const resetPasswordWithToken = (resetToken, password) => {
  return API.post("/reset-password", { resetToken, password });
};

// Verify Email Token
export const verifyEmailToken = async (token) => {
  const response = await API.get(`/verify-email/${token}`);
  if (response.data.success && response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response;
};

// Verify Email with 6-Digit Code (from phone/email)
export const verifyEmailCode = async (email, code) => {
  const response = await API.post("/verify-code", { email, code });
  if (response.data.success && response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response;
};

// Resend Verification Email
export const resendVerificationEmail = (email) => {
  return API.post("/resend-verification", { email });
};

// Get logged-in user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    return null;
  }
};

// Verify/fetch current user from backend using JWT
export const fetchMe = async () => {
  try {
    const response = await API.get("/me");
    if (response.data.success && response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    }
  } catch (error) {
    // If token invalid/expired, clean up local storage
    logoutUser();
    throw error;
  }
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};