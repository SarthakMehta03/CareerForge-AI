import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
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