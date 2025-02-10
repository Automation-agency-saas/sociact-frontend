"use client";

import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingModalProps {
  progress?: number;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function LoadingModal({
  progress = 0,
  message = "Generating ideas...",
  icon = <Lightbulb className="w-12 h-12 text-primary animate-pulse" />,
  className,
}: LoadingModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className={cn("bg-background rounded-lg shadow-lg p-8", className)}>
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                {icon}
              </div>
              <div className="absolute inset-0">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle
                    className="text-primary/20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (progress / 100) * 264}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-primary">{message}</p>
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 