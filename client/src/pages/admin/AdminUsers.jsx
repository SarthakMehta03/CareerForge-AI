import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  UserCheck,
  UserX,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Brain,
  Coins,
  Briefcase,
  RefreshCw,
  ArrowUpDown,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdminUsers,
  getAdminUserDetail,
  updateUserStatus,
  updateUserRole,
} from "../../services/adminService";
import { getCurrentUser } from "../../services/authService";

function AdminUsers() {
  const currentAdmin = getCurrentUser();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters & Search & Sort
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("-createdAt");

  // Selected User Modal / Detail View
  const [detailUser, setDetailUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Confirmation Modals State
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'suspend' | 'reactivate' | 'role', user, newRole }
  const [isMutating, setIsMutating] = useState(false);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort: sortField,
      };

      const res = await getAdminUsers(params);
      if (res.data?.success) {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(1);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, roleFilter, statusFilter, sortField]);

  const openUserDetail = async (user) => {
    try {
      setLoadingDetail(true);
      setDetailUser(user);
      const res = await getAdminUserDetail(user._id);
      if (res.data?.success) {
        setDetailUser(res.data.user);
      }
    } catch (err) {
      console.error("User detail error:", err);
      toast.error("Failed to load full user details");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!confirmAction || isMutating) return;

    try {
      setIsMutating(true);
      const { type, user, newRole } = confirmAction;

      if (type === "suspend") {
        await updateUserStatus(user._id, "suspended");
        toast.success(`User ${user.email} suspended.`);
      } else if (type === "reactivate") {
        await updateUserStatus(user._id, "active");
        toast.success(`User ${user.email} reactivated.`);
      } else if (type === "role") {
        await updateUserRole(user._id, newRole);
        toast.success(`User ${user.email} role changed to '${newRole}'.`);
      }

      setConfirmAction(null);
      fetchUsers(pagination.page);
      if (detailUser && detailUser._id === user._id) {
        openUserDetail(user);
      }
    } catch (err) {
      console.error("Mutation error:", err);
      const msg = err.response?.data?.message || "Action failed";
      toast.error(msg);
    } finally {
      setIsMutating(false);
    }
  };

  const isSelf = (userId) => {
    return currentAdmin?.id === userId || currentAdmin?._id === userId;
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified user registry · Manage accounts, assign administrative privileges, and govern account access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUsers(pagination.page)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* =========================================================================
          SEARCH & FILTERS CONTROL BAR
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Shield size={14} className="text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:border-indigo-600 font-medium"
            >
              <option value="all">All Roles</option>
              <option value="user">Regular User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter size={14} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:border-indigo-600 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="suspended">Suspended Accounts</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown size={14} className="text-slate-400" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:border-indigo-600 font-medium"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="email">Email (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          USERS DATA TABLE
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-slate-300 mb-2" size={36} />
            <h3 className="text-sm font-bold text-slate-800">No users match the criteria</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or clearing role/status filters.
            </p>
            {(search || roleFilter !== "all" || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Auth Provider</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const selfUser = isSelf(u._id);
                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-slate-50/70 transition group"
                    >
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {u.name ? u.name.charAt(0) : "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {selfUser && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 text-[11px] block">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Shield size={11} />
                            Administrator
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                            User
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {u.status === "suspended" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        )}
                      </td>

                      {/* Provider */}
                      <td className="py-3 px-4">
                        {u.googleId ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            Google OAuth
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            <Lock size={10} className="text-slate-400" />
                            Email / Password
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Inspect Detail */}
                          <button
                            type="button"
                            onClick={() => openUserDetail(u)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Inspect User Profile & Stats"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Role Toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmAction({
                                type: "role",
                                user: u,
                                newRole: u.role === "admin" ? "user" : "admin",
                              })
                            }
                            className={`p-1.5 rounded-lg transition ${
                              u.role === "admin"
                                ? "text-indigo-600 hover:bg-indigo-50"
                                : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            }`}
                            title={u.role === "admin" ? "Demote to User" : "Elevate to Admin"}
                          >
                            <Shield size={15} />
                          </button>

                          {/* Status Toggle (Suspend / Reactivate) */}
                          {u.status === "suspended" ? (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmAction({
                                  type: "reactivate",
                                  user: u,
                                })
                              }
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="Reactivate Account"
                            >
                              <UserCheck size={15} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmAction({
                                  type: "suspend",
                                  user: u,
                                })
                              }
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Suspend Account"
                            >
                              <UserX size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{users.length}</strong> of{" "}
            <strong className="text-slate-800">{pagination.total}</strong> accounts (Page{" "}
            {pagination.page} of {pagination.totalPages})
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => fetchUsers(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 font-semibold text-slate-700">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchUsers(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SAFE USER DETAILS MODAL (No Passwords or Secrets)
          ========================================================================= */}
      {detailUser && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDetailUser(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                  {detailUser.name ? detailUser.name.charAt(0) : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{detailUser.name}</h3>
                  <p className="text-xs text-slate-400">{detailUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-8 space-y-3">
                <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
                <div className="h-16 bg-slate-100 rounded animate-pulse" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status and Role Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      detailUser.role === "admin"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {detailUser.role === "admin" ? "Administrator" : "Regular User"}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      detailUser.status === "suspended"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {detailUser.status === "suspended" ? "Account Suspended" : "Account Active"}
                  </span>

                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                    {detailUser.isGoogleUser ? "Google Auth" : "Email & Password"}
                  </span>
                </div>

                {/* Real Subsystem Activity Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <FileText size={11} className="text-emerald-600" /> Resumes
                    </span>
                    <span className="text-xl font-bold text-slate-900 block mt-1">
                      {detailUser.activity?.resumesCount ?? 0}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Briefcase size={11} className="text-indigo-600" /> Interviews
                    </span>
                    <span className="text-xl font-bold text-slate-900 block mt-1">
                      {detailUser.activity?.interviewSessionsCount ?? 0}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Brain size={11} className="text-amber-600" /> Aptitude
                    </span>
                    <span className="text-xl font-bold text-slate-900 block mt-1">
                      {detailUser.activity?.aptitudeAttemptsCount ?? 0}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Coins size={11} className="text-blue-600" /> Credits
                    </span>
                    <span className="text-xl font-bold text-slate-900 block mt-1">
                      {detailUser.activity?.creditBalance ?? 0}
                    </span>
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account ID:</span>
                    <span className="font-mono text-slate-700 text-[11px]">{detailUser._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created At:</span>
                    <span className="text-slate-700 font-medium">
                      {new Date(detailUser.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {detailUser.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="text-slate-700 font-medium">{detailUser.phone}</span>
                    </div>
                  )}
                  {detailUser.bio && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500 block mb-0.5">Bio:</span>
                      <p className="text-slate-700 italic">{detailUser.bio}</p>
                    </div>
                  )}
                </div>

                {/* Security Note */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
                  <Lock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Sensitive fields (password hashes, reset tokens) are strictly excluded from all admin responses.
                  </span>
                </div>

                {/* Action buttons inside modal */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmAction({
                        type: "role",
                        user: detailUser,
                        newRole: detailUser.role === "admin" ? "user" : "admin",
                      });
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
                  >
                    {detailUser.role === "admin" ? "Demote to User" : "Elevate to Admin"}
                  </button>

                  {detailUser.status === "suspended" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmAction({
                          type: "reactivate",
                          user: detailUser,
                        });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Reactivate Account
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmAction({
                          type: "suspend",
                          user: detailUser,
                        });
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Suspend Account
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          CONSEQUENTIAL ACTION CONFIRMATION MODAL
          ========================================================================= */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !isMutating && setConfirmAction(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  confirmAction.type === "suspend"
                    ? "bg-red-100 text-red-600"
                    : confirmAction.type === "reactivate"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-indigo-100 text-indigo-600"
                }`}
              >
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {confirmAction.type === "suspend" && "Confirm Account Suspension"}
                  {confirmAction.type === "reactivate" && "Confirm Account Reactivation"}
                  {confirmAction.type === "role" && "Confirm Role Modification"}
                </h3>
                <span className="text-xs text-slate-500">
                  Target: {confirmAction.user?.email}
                </span>
              </div>
            </div>

            {/* Self-Protection Alert */}
            {isSelf(confirmAction.user?._id) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-start gap-2">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <span>
                  Warning: You are modifying your own account! If you demote or suspend yourself, you will immediately lose administrator privileges.
                </span>
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmAction.type === "suspend" &&
                "Suspending this account will immediately revoke all JWT session tokens and prevent the user from logging in or using CareerForge AI features."}
              {confirmAction.type === "reactivate" &&
                "Reactivating this account will restore standard access immediately."}
              {confirmAction.type === "role" &&
                `Are you sure you want to change this account's role to '${confirmAction.newRole}'? This changes backend permissions across the API.`}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isMutating}
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isMutating}
                onClick={handleConfirmSubmit}
                className={`px-4 py-2 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5 ${
                  confirmAction.type === "suspend"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmAction.type === "reactivate"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isMutating && <RefreshCw size={13} className="animate-spin" />}
                <span>
                  {confirmAction.type === "suspend" && "Confirm Suspension"}
                  {confirmAction.type === "reactivate" && "Confirm Reactivation"}
                  {confirmAction.type === "role" && "Confirm Role Change"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
