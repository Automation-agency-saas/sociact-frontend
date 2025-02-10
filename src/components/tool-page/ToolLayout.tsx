"use client";

import { useState } from "react";
import { ShootingStars } from "../ui/shooting-stars";
import { StarsBackground } from "../ui/stars-background";
import { cn } from "@/lib/utils";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { useAuth } from "@/lib/context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Category } from "@/lib/types";

interface ToolLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolLayout({ children, className }: ToolLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const handleDashboardClick = () => {
    navigate("/home");
  };

  const toggleCategory = (category: Category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <div className="relative min-h-screen w-full bg-black/10">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <StarsBackground 
            starDensity={0.003}
            allStarsTwinkle={true}
            twinkleProbability={0.9}
            className="opacity-70"
          />
        </div>
        <div className="absolute inset-0 z-10">
          <ShootingStars 
            minDelay={1500}
            maxDelay={3000}
            starColor="#ffffff"
            trailColor="var(--primary)"
            className="opacity-90"
            starWidth={25}
            starHeight={2}
          />
        </div>
      </div>

      {/* Layout Structure */}
      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeCategory={activeCategory}
          toggleCategory={toggleCategory}
          handleDashboardClick={handleDashboardClick}
        />

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 max-w-screen-xl mx-auto",
          sidebarOpen ? "md:ml-16" : "md:ml-34"
        )}>
          <div className={cn("container mx-auto py-2 px-4", className)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 