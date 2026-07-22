import Navbar from "../components/auth/Navbar";
import Hero from "../components/auth/Hero";
import LoginCard from "../components/auth/LoginCard";

function Login() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <LoginCard />
    </div>
  );
}

export default Login;