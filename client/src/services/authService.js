import axios from "axios";
import {
  clearUserTransientSessions,
  migrateLegacyAssessments,
} from "../utils/userStorageScope";

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

// Login Step 1: Submit email & password (dispatches OTP code)
export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);

  // Only create authenticated session if token is provided directly
  if (response.data.success && response.data.token && !response.data.requiresOtp) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    try {
      migrateLegacyAssessments();
    } catch (e) {
      // Ignore migration error
    }
  }

  return response;
};

// Login Step 2: Verify 6-digit OTP code and issue authenticated session
export const verifyLoginOtp = async ({ email, sessionToken, otp }) => {
  const response = await API.post("/verify-otp", {
    email,
    sessionToken,
    otp,
  });

  if (response.data.success && response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    try {
      migrateLegacyAssessments();
    } catch (e) {
      // Ignore migration error
    }
  }

  return response;
};

// Resend Login OTP code with cooldown protection
export const resendLoginOtp = ({ email, sessionToken }) => {
  return API.post("/resend-otp", { email, sessionToken });
};

// Google Login (Server-Side Verified)
export const googleLoginUser = async (googlePayload) => {
  const response = await API.post("/google", googlePayload);

  if (response.data.success && response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    try {
      migrateLegacyAssessments();
    } catch (e) {
      // Ignore migration error
    }
  }

  return response;
};

// Forgot Password (Request Reset Link)
export const requestForgotPassword = (email) => {
  return API.post("/forgot-password", { email });
};

// Reset Password (Submit new password with resetToken)
export const resetPasswordWithToken = (resetToken, password) => {
  return API.post("/reset-password", {
    resetToken,
    password,
  });
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
  try {
    clearUserTransientSessions();
  } catch (e) {
    // Ignore cleanup error
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Resolves the appropriate post-login route based on server-verified user role.
 * - Admin users land directly on /admin (or requested /admin sub-route).
 * - Ordinary users land on /dashboard (or requested safe user route).
 * - Prevents open redirects and cross-role leakage.
 */
export const getPostLoginRedirect = (user, fromPath) => {
  const role = user?.role;

  if (role === "admin") {
    if (
      fromPath &&
      typeof fromPath === "string" &&
      fromPath.startsWith("/admin") &&
      !fromPath.startsWith("//")
    ) {
      return fromPath;
    }
    return "/admin";
  }

  if (
    fromPath &&
    typeof fromPath === "string" &&
    fromPath.startsWith("/") &&
    !fromPath.startsWith("//") &&
    !fromPath.startsWith("/admin") &&
    fromPath !== "/" &&
    fromPath !== "/login" &&
    fromPath !== "/signup"
  ) {
    return fromPath;
  }

  return "/dashboard";
};
