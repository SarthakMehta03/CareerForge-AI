import { Navigate } from "react-router-dom";
import Navbar from "../components/auth/Navbar";
import Hero from "../components/auth/Hero";
import SignupCard from "../components/auth/SignupCard";
import { getToken, getCurrentUser } from "../services/authService";

function Signup() {
  const token = getToken();
  const user = getCurrentUser();

  if (token && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-150">
      <Navbar />
      <Hero />
      <SignupCard />
    </div>
  );
}

export default Signup;
