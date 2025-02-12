import React from "react";
import { EvervaultCard, Icon } from "./vault-card";
import { Button } from "../ui/button";
import { tools, categories } from "../../lib/config/tools";

const CardGrids: React.FC = () => {
  // Group tools by category
  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {Object.entries(toolsByCategory).map(([category, categoryTools]) =>
        categoryTools.map((tool) => (
          <div
            key={tool.title}
            className="border border-purple-500/30 flex flex-col items-center w-[400px] mx-auto p-3 relative rounded-xl"
          >
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-primary" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-primary" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-primary" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-primary" />

            <EvervaultCard 
              icon={categories.find(cat => cat.title.toLowerCase() === category)?.icon || tool.icon} 
              app={tool.platforms[0]} 
            />
            <div className="w-full mt-2 flex flex-row items-center justify-between">
              <h1 className="text-xl font-bold text-purple-300">
                {tool.title}
              </h1>
              <Button
                size={"sm"}
                className="text-white"
                onClick={() => (window.location.href = tool.url)}
              >
                Launch Tool
              </Button>
            </div>
            <p className="w-full mt-2 text-sm text-muted-foreground">
              {tool.description}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default CardGrids;
