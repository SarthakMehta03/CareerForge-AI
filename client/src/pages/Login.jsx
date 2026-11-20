import { Navigate } from "react-router-dom";
import Navbar from "../components/auth/Navbar";
import Hero from "../components/auth/Hero";
import LoginCard from "../components/auth/LoginCard";
import { getToken, getCurrentUser } from "../services/authService";

function Login() {
  const token = getToken();
  const user = getCurrentUser();

  if (token && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-150">
      <Navbar />
      <Hero />
      <LoginCard />
    </div>
  );
}

export default Login;
