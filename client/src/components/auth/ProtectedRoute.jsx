import { Navigate } from "react-router-dom";
import { getToken, getCurrentUser } from "../../services/authService";

function ProtectedRoute({ children }) {
  const token = getToken();
  const user = getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;