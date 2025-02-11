import React from "react";

const DashboardHero: React.FC = () => {
  return (
    <div className="h-[30vh]">
      <img
        src="/dash-hero.webp"
        alt="hero"
        className="w-full h-full object-cover opacity-30"
      />
    </div>
  );
};

export default DashboardHero;
