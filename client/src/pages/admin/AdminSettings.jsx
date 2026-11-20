import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Coins,
  Shield,
  Save,
  Info,
  Sliders,
  User,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { getSystemSettings, updateSystemSettings } from "../../services/adminService";
import { getCurrentUser, fetchMe } from "../../services/authService";

function AdminSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "profile" ? "profile" : "settings";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [settings, setSettings] = useState({
    dailyCreditAllowance: 100,
    creditCostPerQuestion: 2,
    allowRegistration: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Synchronize tab change with searchParams
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const fetchSettings = () => {
    setLoading(true);
    getSystemSettings()
      .then((res) => {
        if (res.data?.success) {
          setSettings(res.data.settings);
        }
      })
      .catch((err) => {
        console.error("Fetch settings error:", err);
        toast.error("Failed to load system settings");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getSystemSettings()
      .then((res) => {
        if (isMounted && res.data?.success) {
          setSettings(res.data.settings);
        }
      })
      .catch((err) => {
        console.error("Fetch settings error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    fetchMe()
      .then((user) => {
        if (isMounted && user) setCurrentUser(user);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSubmit = async () => {
    try {
      setSaving(true);
      await updateSystemSettings({
        dailyCreditAllowance: parseInt(settings.dailyCreditAllowance, 10),
        creditCostPerQuestion: parseInt(settings.creditCostPerQuestion, 10),
        allowRegistration: Boolean(settings.allowRegistration),
        maintenanceMode: Boolean(settings.maintenanceMode),
      });
      toast.success("System settings updated and audited.");
      setShowConfirm(false);
      fetchSettings();
    } catch (err) {
      console.error("Save settings error:", err);
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure application-level allowances, question pricing, and inspect administrator credentials.
        </p>
      </div>

      {/* =========================================================================
          TAB NAVIGATION
          ========================================================================= */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => handleTabChange("settings")}
          className={`flex items-center gap-2 pb-3 border-b-2 transition ${
            activeTab === "settings"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sliders size={15} />
          <span>Application Settings</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("profile")}
          className={`flex items-center gap-2 pb-3 border-b-2 transition ${
            activeTab === "profile"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <User size={15} />
          <span>Administrator Profile & Access</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: APPLICATION SETTINGS
          ========================================================================= */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-100 rounded w-1/4" />
              <div className="h-24 bg-slate-100 rounded" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              {/* Credit Allowances Section */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Coins size={16} className="text-indigo-600" />
                  <span>Credit Engine Parameters</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Govern the free daily allowance and credit burn rate per mock interview or aptitude question.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Daily Free Credit Allowance
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      value={settings.dailyCreditAllowance}
                      onChange={(e) =>
                        setSettings({ ...settings, dailyCreditAllowance: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 font-medium"
                    />
                    <span className="text-[11px] text-slate-400 block">
                      Credits replenished daily at 00:00 UTC (10 - 1000).
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Credit Cost per Question
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={settings.creditCostPerQuestion}
                      onChange={(e) =>
                        setSettings({ ...settings, creditCostPerQuestion: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 font-medium"
                    />
                    <span className="text-[11px] text-slate-400 block">
                      Deducted per question generated by Gemini AI (1 - 50).
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield size={16} className="text-emerald-600" />
                  <span>Platform Gateways & Status</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control user registration access and maintenance mode status.
                </p>

                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Allow Public User Registrations
                      </span>
                      <span className="text-[11px] text-slate-500">
                        When disabled, new signups via email and Google OAuth are rejected.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowRegistration}
                        onChange={(e) =>
                          setSettings({ ...settings, allowRegistration: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Platform Maintenance Mode
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Puts public interface in maintenance window while preserving admin access.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) =>
                          setSettings({ ...settings, maintenanceMode: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Secrets Safety Box */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Environment Secrets Protection:</strong> Secrets including <code className="font-mono text-[11px] bg-amber-100 px-1 rounded">GEMINI_API_KEY</code>, <code className="font-mono text-[11px] bg-amber-100 px-1 rounded">JWT_SECRET</code>, and database access credentials are exclusively loaded from environment variables and can never be altered or leaked through browser endpoints.
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Save System Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: ADMINISTRATOR PROFILE & ACCESS
          ========================================================================= */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md shadow-indigo-600/20">
              {currentUser?.name ? currentUser.name.charAt(0) : "A"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{currentUser?.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentUser?.role === "admin" ? "Super Admin" : "Staff"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Administrator ID</span>
              <p className="font-mono text-slate-800 font-bold">{currentUser?.id || currentUser?._id}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Authentication Session</span>
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Active Bearer JWT Session
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Login Provider</span>
              <p className="text-slate-800 font-semibold capitalize">
                {currentUser?.googleId ? "Google OAuth 2.0" : "Standard Email & Password"}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Role Governance</span>
              <p className="text-slate-800 font-semibold">
                Protected by Last-Active-Admin Safeguard
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Administrator account and role privileges are managed through active server sessions.</span>
            <span className="font-semibold text-slate-700">Protected Account</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIRMATION MODAL BEFORE APPLYING SYSTEM SETTINGS
          ========================================================================= */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !saving && setShowConfirm(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Confirm System Settings Update
                </h3>
                <span className="text-xs text-slate-500">
                  This mutation will be recorded in the security audit trail.
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to apply these system configuration parameters? The new credit allowance ({settings.dailyCreditAllowance}) and per-question pricing ({settings.creditCostPerQuestion}) will immediately take effect across all active users.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={saving}
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveSubmit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving && <RefreshCw size={13} className="animate-spin" />}
                <span>Confirm & Apply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;
