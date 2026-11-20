import { BrandLogo } from "../common/BrandLogo";

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Logo */}
      <BrandLogo className="w-14 h-14" />

      {/* Heading */}
      <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
        CareerForge-AI
      </h1>

      {/* Subtitle */}
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Ace your next interview with AI-powered prep
      </p>
    </div>
  );
}

export default Hero;
