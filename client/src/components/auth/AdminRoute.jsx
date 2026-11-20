import { useState, useEffect } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { getToken, getCurrentUser, fetchMe, logoutUser } from "../../services/authService";

function AdminRoute({ children }) {
  const location = useLocation();
  const token = getToken();
  const cachedUser = getCurrentUser();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(Boolean(token && cachedUser?.role === "admin"));
  const [isAuthed, setIsAuthed] = useState(Boolean(token && cachedUser));

  useEffect(() => {
    if (!token || !cachedUser) {
      setIsAuthed(false);
      setIsAdmin(false);
      setIsVerifying(false);
      return;
    }

    fetchMe()
      .then((user) => {
        setIsAuthed(true);
        if (user && user.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => {
        setIsAuthed(false);
        setIsAdmin(false);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token]);

  // Loading state prevents brief flash of unauthorized content or wrong shell
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated user -> send to login with return route state
  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated non-admin user -> Deny access with a secure 403 Forbidden display
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">403 - Access Denied</h1>
          <p className="text-sm text-gray-600 mt-2">
            You are signed in as an ordinary user. Administrator privileges are required to access this portal.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              to="/dashboard"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Return to User Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                logoutUser();
                window.location.href = "/login";
              }}
              className="w-full py-2 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <LogOut size={14} />
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
