
import React from "react";
import { Button } from "../ui/button";
import { ChevronRight, Sparkles, Facebook } from "lucide-react";
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
  // Create a flat array of all tools with their categories
  const allTools = toolCategories.flatMap(category => {
    const categoryTools = tools
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

    return categoryTools;
  });

  // Sort tools: non-coming-soon first, then coming-soon
  const sortedTools = [
    ...allTools.filter(tool => !tool.comingSoon),
    ...allTools.filter(tool => tool.comingSoon)
  ];

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 px-4 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTools.map((tool, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              key={`${tool.app}-${tool.title}-${index}`}
              className={cn(
                "group/card relative overflow-hidden",
                "bg-[#0A0A0A] rounded-3xl transition-all duration-500",
                "border border-white/5",
                "h-[280px] p-6 flex flex-col",
                "before:absolute before:inset-0",
                "before:bg-gradient-to-r before:from-transparent before:via-white/[0.05]",
                "before:to-transparent before:-translate-x-full",
                "group-hover/card:before:animate-shimmer",
                "after:absolute after:inset-0",
                "after:bg-gradient-to-br after:from-black/5 after:to-black/20",
                "after:opacity-0 group-hover/card:after:opacity-100",
                "after:transition-opacity after:duration-500",
                tool.comingSoon && "opacity-70"
              )}
            >
              {/* Animated gradient border */}
              <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -z-10 animate-gradient" />

              {/* Enhanced Social Media Icon with floating effect */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={cn(
                  "w-16 h-16 rounded-2xl overflow-hidden relative",
                  "bg-gradient-to-br shadow-lg",
                  "group-hover/card:animate-pulse-subtle",
                  "before:absolute before:inset-0",
                  "before:bg-gradient-to-br before:opacity-0",
                  "before:transition-opacity before:duration-300",
                  "group-hover/card:before:opacity-20",
                  getSocialGradient(tool.app)
                )}
              >
                <motion.div 
                  className="h-full w-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {getSocialIcon(tool.app)}
                </motion.div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              </motion.div>

              <div className="mt-6 flex-1">
                {/* Enhanced title with gradient text effect */}
                <motion.h2 
                  className={cn(
                    "text-xl font-bold mb-2",
                    "bg-gradient-to-r bg-clip-text text-transparent",
                    "animate-text-gradient bg-[size:200%]",
                    getTextGradient(tool.app)
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  {tool.title}
                </motion.h2>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover/card:text-gray-300 transition-colors duration-300">
                  {tool.desc}
                </p>
              </div>

              {tool.comingSoon ? (
                <div className="mt-6 w-full">
                  <div className={cn(
                    "w-full h-10 rounded-lg",
                    "bg-gradient-to-r",
                    getButtonGradient(tool.app),
                    "flex items-center justify-center",
                    "text-white font-medium",
                    "relative overflow-hidden",
                    "cursor-not-allowed"
                  )}>
                    <span className="flex items-center gap-2 relative z-10">
                      Coming Soon
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-6 w-full">
                  <Link 
                    to={tool.url}
                    className="block w-full"
                  >
                    <div 
                      className={cn(
                        "w-full h-10 rounded-lg",
                        "bg-gradient-to-r",
                        getButtonGradient(tool.app),
                        "flex items-center justify-center",
                        "text-white font-medium",
                        "relative overflow-hidden",
                        // "hover:scale-[1.02] transition-transform duration-200",
                        "cursor-pointer",         
                      )}
                    >
                      <span className="flex items-center gap-2 relative z-10">
                        Launch Tool
                        <ChevronRight className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardGrids;
