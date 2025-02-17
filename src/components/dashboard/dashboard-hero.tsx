import React from "react";
import { Sparkles } from "lucide-react";
const DashboardHero: React.FC = () => {
  return (
    <div className="relative w-full h-[300px]">
    <div className="absolute inset-0">
      <img 
        src="https://res.cloudinary.com/dvuohzc5b/image/upload/v1739815634/tmp0u5zi0rr_squzhs.jpg"
        alt="Header background" 
        className="w-full h-full object-cover opacity-60"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/10 to-[#0A0A0A]" />
    </div>

    {/* Hero Content */}
    <div className="relative z-10 max-w-7xl mx-auto px-4">
      <div className="text-center pt-20">
        <div className="inline-flex items-center bg-purple-900/40 px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
          <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
          <span className="text-purple-200">AI Powered Tools to Help You</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 text-shadow-lg">
          Sociact: Social Media Automation
        </h1>
        <p className="text-gray-200 text-xl text-shadow">
          Your AI companion from Content Creation to Publishing
        </p>
      </div>
    </div>
  </div>

  );
};

export default DashboardHero;
