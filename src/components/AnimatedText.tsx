import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
interface AnimatedGradientTextProps {
  text: string;
}
export function AnimatedGradientTextDemo({ text }: AnimatedGradientTextProps) {
  return (
    <div className="z-10 flex min-h-36 items-center justify-center">
      <AnimatedGradientText>
       
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          {text}
        </span>
        {" "}
        🎉 
      </AnimatedGradientText>
    </div>
  );
}
