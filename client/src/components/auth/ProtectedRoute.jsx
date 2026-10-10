import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getToken, getCurrentUser, fetchMe } from "../../services/authService";

function ProtectedRoute({ children }) {
  const token = getToken();
  const user = getCurrentUser();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(Boolean(token && user));

  useEffect(() => {
    if (!token || !user) {
      setIsValid(false);
      setIsVerifying(false);
      return;
    }

    fetchMe()
      .then(() => {
        setIsValid(true);
      })
      .catch(() => {
        setIsValid(false);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;