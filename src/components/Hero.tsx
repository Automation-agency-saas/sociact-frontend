"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { Section } from "./ui/section";
import { Mockup, MockupFrame } from "./ui/mockup";
import { useTheme } from "next-themes";
import Glow from "./ui/glow";
import { useEffect, useState } from "react";
import { HeroParallax } from "./ui/hero-parallax";
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

  const products = [
    {
      title: "Youtube Script Generator",
      link: "https://gomoonbeam.com",
      thumbnail:
        "https://res.cloudinary.com/dvuohzc5b/image/upload/v1738858669/ttuucrk3khby891ayw8r.png",
    },
   
    {
      title: "Youtube Idea Generator",
      link: "https://userogue.com",
      thumbnail:
      "https://res.cloudinary.com/dvuohzc5b/image/upload/v1738858670/b1rvszglsbaq0p3ax1ei.png"

    },
    {
      title: "Youtube SEO Optimizer",
      link: "https://userogue.com",
      thumbnail:
      "https://res.cloudinary.com/dvuohzc5b/image/upload/v1738858671/uapkkbafwhmxdcfqy1bc.png"

    },
    {
      title: "Youtube Thumbnail Generator",
      link: "https://cursor.so",
      thumbnail:
      "https://res.cloudinary.com/dvuohzc5b/image/upload/v1738858692/ickrevf0vx2wb1h2wk2f.png"
    },
   
  ];

  return (
    <Section className="fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0">
      <HeroParallax products={products} />
    </Section>
  );
};
