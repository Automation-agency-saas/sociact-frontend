import React from "react";
import { EvervaultCard, Icon } from "./vault-card";
import { Button } from "../ui/button";
import { LucideChartColumn, MessageSquare, Sparkles } from "lucide-react";

const CardGrids: React.FC = () => {
  const categories = [
    {
      title: "Ideation",
      icon: Sparkles,
      subcategories: [
        {
          title: "idea_forge",
          desc: "Generate viral video ideas tailored to your niche",
          url: "/youtube/idea-generator",
          app: "youtube",
        },
        {
          title: "reel_spark",
          desc: "Create engaging reel concepts that capture attention",
          url: "/instagram/idea-generator",
          app: "instagram",
        },
        {
          title: "thread_mind",
          desc: "Generate viral ideas for twitter",
          url: "/twitter/idea-generator",
          app: "twitter",
        },
        {
          title: "pro_mind",
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
          title: "script_craft",
          desc: "Create engaging video scripts with AI",
          url: "/youtube/script-generator",
          app: "youtube",
        },
        {
          title: "caption_craft",
          desc: "Generate engaging captions for your posts",
          url: "/instagram/caption-generator",
          app: "instagram",
        },
        {
          title: "thread_craft",
          desc: "Create viral thread ideas for twitter with AI",
          url: "/twitter/thread-generator",
          app: "twitter",
        },
        {
          title: "pro_craft",
          desc: "Create professional post ideas for linkedin",
          url: "/linkedin/post-generator",
          app: "linkedin",
        },
        {
          title: "thumbnail_pro",
          desc: "Generate AI powered thumbnails for your videos",
          url: "/youtube/thumbnail-generator",
          app: "youtube",
        },
        {
          title: "thumbnail_gen",
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
          title: "comment_pro_insta",
          desc: "Automate engaging responses to comments on your instagram posts",
          url: "/instagram/comment-automation",
          app: "instagram",
        },
        {
          title: "comment_pro_fb",
          desc: "Automate engaging responses to comments on your facebook posts",
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
          title: "seo_pro",
          desc: "Optimize your content for better visibility",
          url: "/seo_pro",
          app: "youtube",
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) =>
        category.subcategories.map((subcategory) => (
          <div
            key={subcategory.title}
            className="border border-purple-500/30 flex flex-col items-center w-[400px] mx-auto p-3 relative rounded-xl"
          >
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-primary" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-primary" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-primary" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-primary" />

            <EvervaultCard icon={category.icon} app={subcategory.app} />
            <div className="w-full mt-2 flex flex-row items-center justify-between">
              <h1 className="text-xl font-bold text-purple-300">
                {subcategory.title}
              </h1>
              <Button
                size={"sm"}
                className=" text-white"
                onClick={() => (window.location.href = subcategory.url)}
              >
                Launch Tool
              </Button>
            </div>
            <p className="w-full mt-2 text-sm text-muted-foreground">
              {subcategory.desc}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default CardGrids;
