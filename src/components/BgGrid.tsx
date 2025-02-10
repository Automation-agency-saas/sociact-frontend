"use client";

import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { ReactNode } from "react";

interface PageWithGridBackgroundProps {
  children: ReactNode;
}

export function BgGrid({ children }: PageWithGridBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Interactive Grid Pattern as Full Page Background */}
      <InteractiveGridPattern
        className={cn(
          "absolute inset-0 h-full w-full",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />

      {/* Page content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
