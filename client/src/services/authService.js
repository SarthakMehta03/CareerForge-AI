import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
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

// Get logged-in user
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

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};