"use client";

import { SparklesCore } from "./sparkles";
import { cn } from "@/lib/utils";

interface ToolTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export function ToolTitle({ title, description, className }: ToolTitleProps) {
  return (
    <div className={cn("relative w-full overflow-hidden py-12", className)}>
      {/* Title Content */}
      <div className="relative z-20 text-center space-y-2">
        <h1 className="text-4xl md:text-5xl lg:text-6xl pb-3 font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 via-primary to-neutral-200">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-lg">{description}</p>
        )}
      </div>

      {/* Sparkles Container */}
      {/* <div className="w-full h-40 relative mt-4">
   
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent h-px w-1/4" />

        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={100}
          className="w-full h-full"
          particleColor="var(--primary)"
        />

        <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div> */}
    </div>
  );
}
