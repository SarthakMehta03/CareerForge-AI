import { Rocket } from "lucide-react";

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Logo */}
      <div className="bg-black rounded-2xl p-4 shadow-md">
        <Rocket className="w-8 h-8 text-white" />
      </div>

      {/* Heading */}
      <h1 className="mt-5 text-5xl font-bold text-gray-900">
        CareerForge-AI
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-lg text-gray-500">
        Ace your next interview with AI-powered prep
      </p>
    </div>
  );
}

export default Hero;