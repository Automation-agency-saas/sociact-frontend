import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tools, Tool } from "../lib/config/tools";
import { Platform, Category } from "../lib/types";
import { ToolLayout } from "@/components/tool-page/ToolLayout";
import DashboardHero from "@/components/dashboard/dashboard-hero";
import CardGrids from "@/components/dashboard/card-grids";

export default function Home() {
  const navigate = useNavigate();
  const [activePlatform, setActivePlatform] = useState<Platform>("all");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on category, platform, and search
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = !activeCategory || tool.category === activeCategory;
    const matchesPlatform =
      activePlatform === "all" || tool.platforms.includes(activePlatform);
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPlatform && matchesSearch;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDashboardClick = () => {
    setActiveCategory(null);
    setActivePlatform("all");
    setSearchQuery("");
  };

  const toggleCategory = (category: Category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleToolLaunch = (tool: Tool, platform: Platform) => {
    // Ideation tools
    if (tool.name === "IdeaForge") {
      navigate("/youtube/idea-generator");
    } else if (tool.name === "ReelSpark") {
      navigate("/instagram/idea-generator");
    } else if (tool.name === "ThreadMind") {
      navigate("/twitter/idea-generator");
    } else if (tool.name === "ProMind") {
      navigate("/linkedin/idea-generator");
    }

    // Content creation tools
    else if (tool.name === "ScriptCraft") {
      navigate("/youtube/script-generator");
    } else if (tool.name === "CaptionCraft") {
      navigate("/instagram/caption-generator");
    } else if (tool.name === "ThreadCraft") {
      navigate("/twitter/thread-generator");
    } else if (tool.name === "ProCraft") {
      navigate("/linkedin/post-generator");
    }

    // Analytics and SEO tools
    else if (tool.name === "SEOPro") {
      navigate("/youtube/seo-optimizer");
    }

    // Engagement tools
    else if (tool.name === "CommentPro - Instagram") {
      navigate("/instagram/comment-automation");
    } else if (tool.name === "CommentPro - Facebook") {
      navigate("/facebook/comment-automation");
    }

    // Thumbnail tools
    else if (tool.name === "ThumbnailPro" || tool.name === "ThumbnailGen") {
      navigate("/youtube/thumbnail-generator");
    }
  };

  return (
    <ToolLayout>
      {/* <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSearch={handleSearch}
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
      /> */}
      {/* <ToolGrid
        tools={filteredTools}
        activePlatform={activePlatform}
        onToolLaunch={handleToolLaunch}
      /> */}
      <DashboardHero />
      <CardGrids />
    </ToolLayout>
  );
}
