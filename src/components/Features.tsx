import { Badge } from "./ui/badge";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI-Powered Content Creation",
    description:
      "Our advanced AI understands your niche and audience, generating trending video ideas, engaging scripts, and eye-catching thumbnails that drive views.",
    image: "/features/ai-content.png",
  },
  {
    title: "Smart Automation",
    description:
      "Automate your entire workflow from scheduling posts to engaging with comments. Our AI ensures your content goes live at the perfect time for maximum impact.",
    image: "/features/automation.png",
  },
  {
    title: "Cross-Platform Management",
    description:
      "Manage all your social media accounts from one dashboard. Post, monitor, and analyze your content across YouTube, Instagram, TikTok, and more.",
    image: "/features/cross-platform.png",
  },
];

const featureList = [
  "AI Video Ideas",
  "Script Generation",
  "Thumbnail Creation",
  "Comment Management",
  "Analytics Dashboard",
  "SEO Optimization",
  "Multi-Platform Support",
  "Engagement Tracking",
  "Content Calendar",
  "Performance Insights",
  "Audience Analytics",
  "Trend Detection",
];




export function Features() {
  return (
    
    
    <section id="features" className="container relative sm:py-24 py-6  overflow-hidden">


    <div className="relative z-10 text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
        Transform Your Social Media
        <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
          {" "}
          Workflow{" "}
        </span>
      </h2>
      <p className="text-lg text-muted-foreground max-w-[900px] mx-auto">
        Our AI-powered platform streamlines your content creation process,
        from ideation to analytics. Focus on creating while we handle the
        heavy lifting.
      </p>
    </div>

    <div className="relative w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <CardContainer className="inter-var" key={feature.title}>
            <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] 
                              dark:bg-black dark:border-white/[0.2] border-black/[0.1] 
                              w-full h-auto rounded-xl p-6 border
                              bg-gradient-to-b from-white to-gray-50/50
                              dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
              <CardItem
                translateZ="50"
                className="text-lg font-bold text-neutral-600 dark:text-white mb-4"
              >
                {feature.title}
              </CardItem>

              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm mt-4 dark:text-neutral-300 min-h-[80px]"
              >
                {feature.description}
              </CardItem>

              <CardItem translateZ="100" className="w-full mt-6">
                <img
                  src="https://media.istockphoto.com/id/1408387701/photo/social-media-marketing-digitally-generated-image-engagement.jpg?s=612x612&w=0&k=20&c=VVAxxwhrZZ7amcPYJr08LLZJTyoBVMN6gyzDk-4CXos="
                  className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt={feature.title}
                />
              </CardItem>

              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 
                          rounded-xl blur-xl opacity-0 group-hover/card:opacity-100 
                          transition-all duration-500 -z-10" />
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>

    <div className="relative z-10 flex flex-wrap justify-center gap-4 pt-8">

      {featureList.map((feature) => (
        <Badge
          key={feature}
          variant="secondary"
          className="text-sm px-4 py-2 bg-muted/60"
        >
          {feature}
        </Badge>
      ))}
    </div>
  </section>
  
  );
}
