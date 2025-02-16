import React from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ArrowDownAZ,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { tools, platformConfig } from "@/lib/config/tools";

const NavSidebar: React.FC = () => {
  const [selectedApp, setSelectedApp] = React.useState<string | null>(null);
  const location = useLocation();

  // Transform tools into platform-based structure
  const appContent = Object.entries(platformConfig)
    .filter(([key]) => key !== 'all')
    .reduce((acc, [platform, config]) => ({
      ...acc,
      [config.name]: {
        icon: config.icon,
        features: tools
          .filter(tool => tool.platforms.includes(platform as any))
          .map(tool => ({
            title: tool.title,
            desc: tool.description,
            url: tool.url,
            comingSoon: tool.comingSoon,
          }))
      }
    }), {} as Record<string, { icon: any, features: any[] }>);

  const apps = ["All", ...Object.keys(appContent)];

  const renderAppIcon = (app: string | null) => {
    if (!app || app === "All") return <ArrowDownAZ className="w-4 h-4" />;
    const AppIcon = appContent[app].icon;
    return <AppIcon className="w-4 h-4" />;
  };

  const filteredApps = selectedApp ? [selectedApp] : Object.keys(appContent);

  const getSocialGradient = (app: string) => {
    switch (app) {
      case 'YouTube':
        return 'from-[#FF0000] to-[#CC0000]';
      case 'Instagram':
        return 'from-[#833AB4] to-[#C13584]';
      case 'Twitter':
        return 'from-[#1DA1F2] to-[#0D8ECD]';
      case 'LinkedIn':
        return 'from-[#0077B5] to-[#00669C]';
      default:
        return 'from-purple-600 to-purple-800';
    }
  };

  const getTextGradient = (app: string) => {
    switch (app) {
      case 'YouTube':
        return 'from-[#FF0000] via-[#FF4444] to-[#FF0000]';
      case 'Instagram':
        return 'from-[#833AB4] via-[#C13584] to-[#833AB4]';
      case 'Twitter':
        return 'from-[#1DA1F2] via-[#4DB5F5] to-[#1DA1F2]';
      case 'LinkedIn':
        return 'from-[#0077B5] via-[#0091D5] to-[#0077B5]';
      default:
        return 'from-purple-600 via-purple-500 to-purple-600';
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Apps</SidebarGroupLabel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex items-center justify-start gap-2 px-2 my-2",
              "bg-gradient-to-r from-purple-500/10 to-transparent",
              "hover:from-purple-500/20 hover:to-purple-500/5",
              "border-purple-500/20 hover:border-purple-500/30",
              "transition-all duration-300"
            )}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {renderAppIcon(selectedApp)}
            </motion.div>
            <span className="group-data-[collapsible=icon]:hidden">
              {selectedApp ? `Filter : ${selectedApp}` : "Filter : All"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          className="min-w-max grid grid-cols-2 gap-1 p-2 bg-black/95 border-purple-500/20"
        >
          {apps.map((app) => (
            <DropdownMenuItem
              key={app}
              onSelect={() => setSelectedApp(app === "All" ? null : app)}
              className={cn(
                "w-max p-1",
                "hover:bg-gradient-to-r",
                app !== "All" && `hover:${getSocialGradient(app)}/20`
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-1"
              >
                {renderAppIcon(app)}
              </motion.div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <SidebarMenu>
        {filteredApps.map((app) => (
          <Collapsible
            defaultOpen={true}
            key={app}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip={app}
                  className={cn(
                    "transition-all duration-300",
                    "hover:bg-gradient-to-r",
                    `hover:${getSocialGradient(app)}/20`,
                    "relative overflow-hidden group/button"
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "p-1 rounded",
                      "bg-gradient-to-r",
                      getSocialGradient(app),
                      "opacity-80 group-hover/button:opacity-100"
                    )}
                  >
                    {renderAppIcon(app)}
                  </motion.div>
                  <span className={cn(
                    "font-semibold bg-gradient-to-r bg-clip-text text-transparent",
                    "animate-text-gradient bg-[size:200%]",
                    getTextGradient(app)
                  )}>
                    {app}
                  </span>
                  <ChevronRight className={cn(
                    "ml-auto transition-all duration-300",
                    "text-gray-400 group-hover/button:text-white",
                    "group-data-[state=open]/collapsible:rotate-90"
                  )} />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {appContent[app].features.map((feature) => (
                    <SidebarMenuSubItem key={feature.title}>
                      <SidebarMenuSubButton
                        className={cn(
                          "relative overflow-hidden group/feature",
                          "transition-all duration-300",
                          "hover:bg-gradient-to-r",
                          `hover:${getSocialGradient(app)}/20`,
                          feature.comingSoon && "cursor-not-allowed opacity-70"
                        )}
                        asChild
                      >
                        {feature.comingSoon ? (
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "transition-colors duration-300",
                              "text-gray-400"
                            )}>
                              {feature.title}
                            </span>
                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                              Coming Soon
                            </span>
                          </div>
                        ) : (
                          <Link to={feature.url}>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover/feature:opacity-10"
                              style={{
                                backgroundImage: `linear-gradient(to right, ${
                                  app === 'YouTube' ? '#FF0000' :
                                  app === 'Instagram' ? '#833AB4' :
                                  app === 'Twitter' ? '#1DA1F2' :
                                  app === 'LinkedIn' ? '#0077B5' :
                                  '#6B46C1'
                                }, transparent)`
                              }}
                            />
                            <span className={cn(
                              "transition-colors duration-300",
                              location.pathname === feature.url
                                ? "text-white font-medium"
                                : "text-gray-400 group-hover/feature:text-white"
                            )}>
                              {feature.title}
                            </span>
                          </Link>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavSidebar;
