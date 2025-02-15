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
          desc: "Automate engaging responses to comments on your videos",
          url: "/youtube/comment-automation",
          app: "youtube",
        },
        {
          title: "Comment Pro",
          desc: "Automate engaging responses to comments on your tweets",
          url: "/twitter/comment-automation",
          app: "twitter",
        },
        {
          title: "Comment Pro",
          desc: "Automate engaging responses to comments on your LinkedIn posts",
          url: "/linkedin/comment-automation",
          app: "linkedin",
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
          url: "/youtube/seo-optimizer",
          app: "youtube",
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 mx-auto max-w-7xl">
      {categories.map((category) =>
        category.subcategories.map((subcategory) => (
          <div
            key={subcategory.title}
            className="border bg-transparent backdrop-blur-sm group/card flex flex-row gap-2 sm:gap-3 
                      w-full min-h-[120px] sm:min-h-[160px] lg:min-h-[200px]
                      p-3 sm:p-4 relative rounded-xl
                      transition-all duration-300 hover:shadow-lg"
          >
            <Icon className="absolute h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 -top-2 -left-2 text-primary" />
            <Icon className="absolute h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 -bottom-2 -left-2 text-primary" />
            <Icon className="absolute h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 -top-2 -right-2 text-primary" />
            <Icon className="absolute h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 -bottom-2 -right-2 text-primary" />

            <EvervaultCard
              icon={category.icon}
              app={subcategory.app}
              className="group-hover/card:scale-60   transition-all ease-in-out duration-300"
            />
            <div className="flex-1 flex flex-col gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white line-clamp-2">
                {subcategory.title}
              </h1>
              <a href={subcategory.url}>
                <Button
                  size={"sm"}
                  className="w-max pr-4 sm:pr-6 flex items-center gap-2 justify-start text-white text-sm sm:text-base"
                >
                  <span>Launch</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/card:translate-x-3 transition-all ease-in-out duration-300" />
                </Button>
              </a>
              <p className="w-full text-xs sm:text-sm text-muted-foreground line-clamp-2">
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
