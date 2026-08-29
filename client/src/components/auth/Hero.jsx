import { Rocket } from "lucide-react";

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Logo */}
      <div className="bg-black rounded-xl p-2.5 shadow-md">
        <Rocket className="w-7 h-7 text-white" />
      </div>

      {/* Heading */}
      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        CareerForge-AI
      </h1>

      {/* Subtitle */}
      <p className="mt-1 text-sm text-gray-500">
        Ace your next interview with AI-powered prep
      </p>
    </div>
  );
}

export default Hero;