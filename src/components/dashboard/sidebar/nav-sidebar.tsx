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

const NavSidebar: React.FC = () => {
  const [selectedApp, setSelectedApp] = React.useState<string | null>(null);
  const location = useLocation();

  const appContent = {
    Youtube: {
      icon: Youtube,
      features: [
        {
          title: "Idea Forge",
          desc: "Generate viral video ideas tailored to your niche",
          url: "/youtube/idea-generator",
        },
        {
          title: "Script Craft",
          desc: "Create engaging video scripts with AI",
          url: "/youtube/script-generator",
        },
        {
          title: "Thumbnail Gen",
          desc: "Create stunning thumbnails from text description",
          url: "/youtube/thumbnail-generator",
        },
        {
          title: "Seo Pro",
          desc: "Optimize your content for better visibility",
          url: "/youtube/seo-optimizer",
        },
      ],
    },
    Instagram: {
      icon: Instagram,
      features: [
        {
          title: "Reel Spark",
          desc: "Create engaging reel concepts that capture attention",
          url: "/instagram/idea-generator",
        },
        {
          title: "Caption Craft",
          desc: "Generate engaging captions for your posts",
          url: "/instagram/caption-generator",
        },
        {
          title: "Comment Pro",
          desc: "Automate engaging responses to comments on your posts",
          url: "/instagram/comment-automation",
        },
      ],
    },
    Twitter: {
      icon: Twitter,
      features: [
        {
          title: "Thread Mind",
          desc: "Generate viral ideas for twitter",
          url: "/twitter/idea-generator",
        },
        {
          title: "Thread Craft",
          desc: "Create viral thread ideas for twitter with AI",
          url: "/twitter/thread-generator",
        },
      ],
    },
    Linkedin: {
      icon: Linkedin,
      features: [
        {
          title: "Pro Mind",
          desc: "Generate professional posts for linkedin",
          url: "/linkedin/idea-generator",
        },
        {
          title: "Pro Craft",
          desc: "Create professional post ideas for linkedin",
          url: "/linkedin/post-generator",
        },
      ],
    },
    Facebook: {
      icon: Facebook,
      features: [
        {
          title: "Comment Pro",
          desc: "Automate engaging responses to comments on your posts",
          url: "/facebook/comment-automation",
        },
      ],
    },
  };

  const apps = ["All", ...Object.keys(appContent)];

  const renderAppIcon = (app: string | null) => {
    if (!app || app === "All") return <ArrowDownAZ className="w-4 h-4" />;
    const AppIcon = appContent[app as keyof typeof appContent].icon;
    return <AppIcon className="w-4 h-4" />;
  };

  const filteredApps = selectedApp ? [selectedApp] : Object.keys(appContent);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Apps</SidebarGroupLabel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 px-2 my-2"
          >
            <span>{renderAppIcon(selectedApp)}</span>
            <span className="group-data-[collapsible=icon]:hidden">
              {selectedApp ? `Filter : ${selectedApp}` : "Filter : All"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          className="min-w-max grid grid-cols-2"
        >
          {apps.map((app) => (
            <DropdownMenuItem
              key={app}
              onSelect={() => setSelectedApp(app === "All" ? null : app)}
              className="w-max"
            >
              <Button size="icon">{renderAppIcon(app)}</Button>
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
                <SidebarMenuButton tooltip={app}>
                  <span className="text-purple-400">{renderAppIcon(app)}</span>
                  <span className="font-semibold">{app}</span>
                  <ChevronRight className="ml-auto text-purple-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {appContent[app as keyof typeof appContent].features.map(
                    (feature) => (
                      <SidebarMenuSubItem key={feature.title}>
                        <SidebarMenuSubButton
                          className="hover:bg-purple-400/20"
                          asChild
                        >
                          <Link to={feature.url}>
                            <span
                              className={cn(
                                "",
                                location.pathname === feature.url
                                  ? "text-purple-400"
                                  : "text-gray-500"
                              )}
                            >
                              {feature.title}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  )}
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
