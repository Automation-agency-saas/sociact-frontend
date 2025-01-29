"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { Section } from "./ui/section";
import { Mockup, MockupFrame } from "./ui/mockup";
import { useTheme } from "next-themes";
import Glow from "./ui/glow";
import { useEffect, useState } from "react";

export const Hero = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imageSrc, setImageSrc] = useState("/app-light.png");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setImageSrc(resolvedTheme === "dark" ? "/app-dark.png" : "/app-light.png");
    }
  }, [resolvedTheme, mounted]);

  return (
    <Section className="fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0">
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          <Badge variant="outline" className="animate-appear">
            <span className="text-muted-foreground">
              Try our new AI Content Generator!
            </span>
            <a href="#features" className="flex items-center gap-1">
              Learn more
              <ArrowRightIcon className="h-3 w-3" />
            </a>
          </Badge>
          
          <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-[#F596D3] to-[#D247BF] bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            Automate Your Social Media Success
          </h1>
          
          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-muted-foreground opacity-0 delay-100 sm:text-xl">
            Schedule posts, generate engaging content, and grow your audience across all platforms with our AI-powered automation tools.
          </p>
          
          <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
            <Button variant="default" size="lg" asChild>
              <a href="#pricing">Start Free Trial</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#demo">Watch Demo</a>
            </Button>
          </div>

          <div className="relative pt-12 w-full max-w-[1200px] mx-auto">
            <MockupFrame
              className="animate-appear opacity-0 delay-700 relative z-10"
              size="small"
            >
              <Mockup type="responsive">
                <img
                  src={imageSrc}
                  alt="Social Media Dashboard"
                  width={1248}
                  height={765}
                  className="w-full h-auto object-cover"
                />
              </Mockup>
            </MockupFrame>
            <Glow
              variant="top"
              className="absolute inset-0 -z-10 animate-appear-zoom opacity-0 delay-1000"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};
