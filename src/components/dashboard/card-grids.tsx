import React from "react";
import { EvervaultCard, Icon } from "./vault-card";
import { Button } from "../ui/button";
import {
  ChevronRight,
  LucideChartColumn,
  MessageSquare,
  Rocket,
  Sparkles,
} from "lucide-react";

const CardGrids: React.FC = () => {
  const categories = [
    {
      title: "Ideation",
      icon: Sparkles,
      subcategories: [
        {
          title: "Idea Forge",
          desc: "Generate viral video ideas tailored to your niche",
          url: "/youtube/idea-generator",
          app: "youtube",
        },
        {
          title: "Reel Spark",
          desc: "Create engaging reel concepts that capture attention",
          url: "/instagram/idea-generator",
          app: "instagram",
        },
        {
          title: "Thread Mind",
          desc: "Generate viral ideas for twitter",
          url: "/twitter/idea-generator",
          app: "twitter",
        },
        {
          title: "Pro Mind",
          desc: "Generate professional posts for linkedin",
          url: "/linkedin/idea-generator",
          app: "linkedin",
        },
      ],
    },
    {
      title: "Content",
      icon: MessageSquare,
      subcategories: [
        {
          title: "Script Craft",
          desc: "Create engaging video scripts with AI",
          url: "/youtube/script-generator",
          app: "youtube",
        },
        {
          title: "Caption Craft",
          desc: "Generate engaging captions for your posts",
          url: "/instagram/caption-generator",
          app: "instagram",
        },
        {
          title: "Thread Craft",
          desc: "Create viral thread ideas for twitter with AI",
          url: "/twitter/thread-generator",
          app: "twitter",
        },
        {
          title: "Pro Craft",
          desc: "Create professional post ideas for linkedin",
          url: "/linkedin/post-generator",
          app: "linkedin",
        },
        {
          title: "Thumbnail Pro",
          desc: "Generate AI powered thumbnails for your videos",
          url: "/youtube/thumbnail-generator",
          app: "youtube",
        },
        {
          title: "Thumbnail Gen",
          desc: "Create stunning thumbnails from text description",
          url: "/youtube/thumbnail-generator",
          app: "youtube",
        },
      ],
    },
    {
      title: "Engagement",
      icon: Sparkles,
      subcategories: [
        {
          title: "Comment Pro",
          desc: "Automate engaging responses to comments on your posts",
          url: "/instagram/comment-automation",
          app: "instagram",
        },
        {
          title: "Comment Pro",
          desc: "Automate engaging responses to comments on your posts",
          url: "/facebook/comment-automation",
          app: "facebook",
        },
      ],
    },
    {
      title: "Analytics",
      icon: LucideChartColumn,
      subcategories: [
        {
          title: "Seo Pro",
          desc: "Optimize your content for better visibility",
          url: "/seo_pro",
          app: "youtube",
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 gap-8 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
      {categories.map((category) =>
        category.subcategories.map((subcategory) => (
          <div
            key={subcategory.title}
            className="border bg-transparent backdrop-blur-sm group/card flex flex-row gap-3 w-[400px] h-[200px] mx-auto p-2 relative rounded-xl"
          >
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-primary" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-primary" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-primary" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-primary" />

            <EvervaultCard
              icon={category.icon}
              app={subcategory.app}
              className="group-hover/card:scale-90 transition-all ease-in-out duration-300"
            />
            <div className="w-full mt-3 flex flex-col gap-3">
              <h1 className="text-2xl font-semibold text-black dark:text-white">
                {subcategory.title}
              </h1>
              <a href={subcategory.url}>
                <Button
                  size={"sm"}
                  className="w-max pr-6 flex items-center gap-2 justify-start text-white"
                  // onClick={() => (window.location.href = subcategory.url)}
                >
                  <span>Launch</span>
                  <ChevronRight className="w-4 h-4 group-hover/card:translate-x-3 transition-all ease-in-out duration-300" />
                </Button>
              </a>
              <p className="w-full mt-2 text-sm text-muted-foreground">
                {subcategory.desc}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CardGrids;
