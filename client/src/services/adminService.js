import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Overview
export const getAdminOverview = () => API.get("/overview");

// User Management
export const getAdminUsers = (params) => API.get("/users", { params });
export const getAdminUserDetail = (id) => API.get(`/users/${id}`);
export const updateUserStatus = (id, status) => API.put(`/users/${id}/status`, { status });
export const updateUserRole = (id, role) => API.put(`/users/${id}/role`, { role });

// Shared Content Management
export const getSharedContent = (params) => API.get("/content", { params });
export const getSharedContentItem = (id) => API.get(`/content/${id}`);
export const createSharedContent = (data) => API.post("/content", data);
export const updateSharedContent = (id, data) => API.put(`/content/${id}`, data);
export const toggleArchiveContent = (id) => API.put(`/content/${id}/archive`);
export const deleteSharedContent = (id) => API.delete(`/content/${id}`);
export const seedSharedContent = () => API.post("/content/seed");

// Reports
export const getActivityReports = (params) => API.get("/reports/activity", { params });

// Audit Logs
export const getAuditLogs = (params) => API.get("/audit-logs", { params });

// System Settings
export const getSystemSettings = () => API.get("/settings");
export const updateSystemSettings = (data) => API.put("/settings", data);
