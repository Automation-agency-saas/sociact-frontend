import React from "react";

const DashboardHero: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-md px-4">
      <h1 className="md:text-6xl text-3xl lg:text-7xl font-bold text-center dark:text-white text-black relative z-20 mb-4">
        Social Media Automation Tools
      </h1>
      <div className="w-full max-w-[65rem] h-8 relative">
        {/* Primary Gradients */}
        <div className="absolute inset-x-[10%] top-0 bg-gradient-to-r from-transparent via-purple-500/70 to-transparent h-[4px] w-[80%] blur-md animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute inset-x-[10%] top-0 bg-gradient-to-r from-transparent via-purple-600/50 to-transparent h-[1px] w-[80%] animate-[pulse_3s_ease-in-out_infinite]" />
        
        {/* Secondary Gradients */}
        <div className="absolute inset-x-[20%] top-0 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent h-[3px] w-[60%] blur-sm animate-[pulse_5s_ease-in-out_infinite]" />
        <div className="absolute inset-x-[20%] top-0 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent h-[2px] w-[60%] animate-[pulse_4.5s_ease-in-out_infinite]" />
        
        {/* Additional Accent Gradients */}
        <div className="absolute inset-x-[5%] top-1 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent h-[2px] w-[90%] blur-sm animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute inset-x-[15%] top-1.5 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent h-[1.5px] w-[70%] blur-md animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute inset-x-[12%] top-2 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent h-[2px] w-[76%] blur-sm animate-[pulse_5.5s_ease-in-out_infinite]" />

        {/* Shimmer Effects */}
        <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-white/10 to-transparent h-[1px] w-full animate-[shimmer_8s_linear_infinite]" />
        <div className="absolute inset-x-[10%] top-1 bg-gradient-to-r from-transparent via-white/5 to-transparent h-[1px] w-[80%] animate-[shimmer_6s_linear_infinite]" />

        {/* Radial Gradient Mask */}
        <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_30%,white)]"></div>
      </div>
    </div>
  );
};

export default DashboardHero;
