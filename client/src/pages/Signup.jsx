import Navbar from "../components/auth/Navbar";
import Hero from "../components/auth/Hero";
import SignupCard from "../components/auth/SignupCard";


function Signup() {
  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <Hero />

      <SignupCard />

    </div>
  );
}

export default Signup;