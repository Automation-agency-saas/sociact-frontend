import React from "react";
import { Button } from "../ui/button";
import { ChevronRight, Sparkles, Facebook, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarsBackground } from "../ui/stars-background";
import { 
  Youtube, 
  Instagram, 
  Twitter, 
  Linkedin 
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { tools, categories as toolCategories } from "@/lib/config/tools";

const getSocialIcon = (app: string) => {
  switch (app) {
    case 'youtube':
      return <Youtube className="w-8 h-8 text-white" />;
    case 'instagram':
      return <Instagram className="w-8 h-8 text-white" />;
    case 'twitter':
      return <Twitter className="w-8 h-8 text-white" />;
    case 'linkedin':
      return <Linkedin className="w-8 h-8 text-white" />;
    case 'facebook':
      return <Facebook className="w-8 h-8 text-white" />;
    default:
      return <Sparkles className="w-8 h-8 text-white" />;
  }
};

const getSocialGradient = (app: string) => {
  switch (app) {
    case 'youtube':
      return 'from-[#FF0000] to-[#CC0000]';
    case 'instagram':
      return 'from-[#833AB4] to-[#C13584]';
    case 'twitter':
      return 'from-[#1DA1F2] to-[#0D8ECD]';
    case 'linkedin':
      return 'from-[#0077B5] to-[#00669C]';
    case 'facebook':
      return 'from-[#1877F2] to-[#166DE5]';
    default:
      return 'from-purple-600 to-purple-800';
  }
};

const getButtonGradient = (app: string) => {
  switch (app) {
    case 'youtube':
      return 'from-[#FF0000]/90 to-[#CC0000]/90 hover:from-[#FF0000] hover:to-[#CC0000]';
    case 'instagram':
      return 'from-[#833AB4]/90 to-[#C13584]/90 hover:from-[#833AB4] hover:to-[#C13584]';
    case 'twitter':
      return 'from-[#1DA1F2]/90 to-[#0D8ECD]/90 hover:from-[#1DA1F2] hover:to-[#0D8ECD]';
    case 'linkedin':
      return 'from-[#0077B5]/90 to-[#00669C]/90 hover:from-[#0077B5] hover:to-[#00669C]';
    case 'facebook':
      return 'from-[#1877F2]/20 to-[#166DE5]/20 hover:from-[#1877F2]/30 hover:to-[#166DE5]/30';
    default:
      return 'from-purple-600/90 to-purple-800/90 hover:from-purple-600 hover:to-purple-800';
  }
};

const getTextGradient = (app: string) => {
  switch (app) {
    case 'youtube':
      return 'from-[#FF0000] via-[#FF4444] to-[#FF0000]';
    case 'instagram':
      return 'from-[#833AB4] via-[#C13584] to-[#833AB4]';
    case 'twitter':
      return 'from-[#1DA1F2] via-[#4DB5F5] to-[#1DA1F2]';
    case 'linkedin':
      return 'from-[#0077B5] via-[#0091D5] to-[#0077B5]';
    case 'facebook':
      return 'from-[#1877F2] via-[#4893F5] to-[#1877F2]';
    default:
      return 'from-purple-600 via-purple-500 to-purple-600';
  }
};

const CardGrids: React.FC = () => {
  // Create a flat array of all tools with their platforms
  const allTools = toolCategories.flatMap(category => {
    return tools
      .filter(tool => tool.category.toLowerCase() === category.title.toLowerCase())
      .map(tool => ({
        title: tool.title,
        desc: tool.description,
        url: tool.url,
        app: tool.platforms[0],
        comingSoon: tool.comingSoon,
        category: category.title,
        categoryIcon: category.icon
      }));
  });

  // Sort tools by platform
  const groupedByPlatform = allTools.reduce((acc, tool) => {
    const platform = tool.app.toLowerCase();
    if (!acc[platform]) {
      acc[platform] = [];
    }
    acc[platform].push(tool);
    return acc;
  }, {} as Record<string, typeof allTools>);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      <div className="relative z-10 px-4 mx-auto max-w-7xl">
        {/* Tools Sections by Platform */}
        {Object.entries(groupedByPlatform).map(([platform, tools]) => (
          <div key={platform} className="mb-12">
            <div className="bg-purple-900/20 p-4 rounded-2xl mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white capitalize">
                {platform} Tools
              </h2>
              <ChevronDown className="w-6 h-6 text-purple-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={`${tool.app}-${tool.title}-${index}`}
                  className="flex bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden h-48"
                >
                  {/* Image Section */}
                  <div className="w-1/2 relative overflow-hidden">
                    <img
                      src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-QSTiahdKODtBSzMaIxXzFqzQCzLpBPqevQ&s`}
                      alt={tool.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="w-1/2 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getSocialIcon(tool.app)}
                        <h3 className="text-xl font-bold text-white">
                          {tool.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 mb-4 text-sm">
                        {tool.desc}
                      </p>
                    </div>

                    <Link to={tool.url}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "w-full py-2 px-4 rounded-xl",
                          'bg-gradient-to-r',
                          getButtonGradient(tool.app),
                          "text-white font-semibold",
                          "flex items-center justify-center gap-2",
                          "transition-all duration-300"
                        )}
                      >
                        <Sparkles className="w-5 h-5" />
                        Launch Tool 
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGrids;
