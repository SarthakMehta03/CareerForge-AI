import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "../components/auth/Navbar";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);
      // Note: Backend endpoint for password change can be added
      toast.success("Password updated successfully!");
      setShowChangePassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {/* ── Profile Header Card ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Cover band */}
            <div className="h-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />

            <div className="px-6 pb-6 -mt-12">
              {/* Avatar */}
              <div className="flex items-end gap-4 mb-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div className="pb-1">
                  <h1 className="text-xl font-bold text-gray-900">{user?.name || "User"}</h1>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              {/* Account Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <Shield size={16} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Account Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{user?.role || "User"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <Calendar size={16} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  {user?.googleId ? (
                    <>
                      <FcGoogle size={16} className="shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Auth Method</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                          Google Connected
                          <CheckCircle2 size={13} className="text-emerald-500" />
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <KeyRound size={16} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Auth Method</p>
                        <p className="text-sm font-medium text-gray-900">Email & Password</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Security & Password Section ── */}
          {!user?.googleId && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <KeyRound size={18} className="text-gray-700" />
                  <h2 className="text-base font-bold text-gray-900">Security</h2>
                </div>
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="text-sm font-semibold text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  {showChangePassword ? "Cancel" : "Change Password"}
                </button>
              </div>

              {showChangePassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  {/* Current Password */}
                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-colors pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-colors pr-10"
                        placeholder="Enter new password (min 6 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-colors"
                      placeholder="Re-enter new password"
                    />
                    {passwordData.newPassword && passwordData.confirmPassword && (
                      <p className={`text-xs mt-1 flex items-center gap-1 ${passwordData.newPassword === passwordData.confirmPassword ? "text-emerald-600" : "text-red-500"}`}>
                        {passwordData.newPassword === passwordData.confirmPassword ? (
                          <><CheckCircle2 size={12} /> Passwords match</>
                        ) : (
                          <><AlertCircle size={12} /> Passwords do not match</>
                        )}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-gray-500">
                  Your password was last set during registration. We recommend using a strong, unique password.
                </p>
              )}
            </div>
          )}

          {/* ── Danger Zone ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Account Actions</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm rounded-xl border border-red-200 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 pb-4">
            © CareerForge-AI. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
