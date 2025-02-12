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
  FileText,
  Instagram,
  Linkedin,
  LucideChartColumn,
  MessageSquare,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";
import React from "react";

const NavSidebar: React.FC = () => {
  const [selectedApp, setSelectedApp] = React.useState<string | null>(null);

  const categories = [
    {
      title: "Ideation",
      icon: Sparkles,
      subcategories: [
        {
          title: "Idea Forge",
          desc: "Generate viral video ideas tailored to your niche",
          url: "/youtube/idea-generator",
          app: "Youtube",
        },
        {
          title: "Reel Spark",
          desc: "Create engaging reel concepts that capture attention",
          url: "/instagram/idea-generator",
          app: "Instagram",
        },
        {
          title: "Thread Mind",
          desc: "Generate viral ideas for twitter",
          url: "/twitter/idea-generator",
          app: "Twitter",
        },
        {
          title: "Pro Mind",
          desc: "Generate professional posts for linkedin",
          url: "/linkedin/idea-generator",
          app: "Linkedin",
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
          app: "Youtube",
        },
        {
          title: "Caption Craft",
          desc: "Generate engaging captions for your posts",
          url: "/instagram/caption-generator",
          app: "Instagram",
        },
        {
          title: "Thread Craft",
          desc: "Create viral thread ideas for twitter with AI",
          url: "/twitter/thread-generator",
          app: "Twitter",
        },
        {
          title: "Pro Craft",
          desc: "Create professional post ideas for linkedin",
          url: "/linkedin/post-generator",
          app: "Linkedin",
        },
        {
          title: "Thumbnail Pro",
          desc: "Generate AI powered thumbnails for your videos",
          url: "/youtube/thumbnail-generator",
          app: "Youtube",
        },
        {
          title: "Thumbnail Gen",
          desc: "Create stunning thumbnails from text description",
          url: "/youtube/thumbnail-generator",
          app: "Youtube",
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
          app: "Instagram",
        },
        {
          title: "Comment Pro",
          desc: "Automate engaging responses to comments on your posts",
          url: "/facebook/comment-automation",
          app: "Facebook",
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
          app: "Youtube",
        },
      ],
    },
  ];

  const apps = [
    "All",
    "Youtube",
    "Instagram",
    "Twitter",
    "Linkedin",
    "Facebook",
  ];
  const renderAppIcon = (app: string | null) => {
    switch (app) {
      case "Youtube":
        return <Youtube className=" w-4 h-4" />;
      case "Instagram":
        return <Instagram className=" w-4 h-4" />;
      case "Facebook":
        return <Facebook className=" w-4 h-4" />;
      case "Twitter":
        return <Twitter className=" w-4 h-4" />;
      case "Linkedin":
        return <Linkedin className=" w-4 h-4" />;
      default:
        return <ArrowDownAZ className="w-4 h-4" />;
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Categories</SidebarGroupLabel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 px-2 my-4"
          >
            <span>{renderAppIcon(selectedApp)}</span>
            <span className="group-data-[collapsible=icon]:hidden">
              {selectedApp ? `Filter : ${selectedApp}` : "Filter : All"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="min-w-max grid grid-cols-2">
          {apps.map((app) => (
            <DropdownMenuItem
              key={app}
              onSelect={() => setSelectedApp(app === "All" ? null : app)}
              className="w-max"
            >
              <Button size={"icon"} className="">
                {renderAppIcon(app)}
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <SidebarMenu>
        {categories.map((category) => (
          <Collapsible
            defaultOpen={true}
            key={category.title}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={category.title}>
                  {category.icon && <category.icon className="text-purple-400" />}
                  <span className="font-semibold">{category.title}</span>
                  <ChevronRight className="ml-auto text-purple-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {category.subcategories
                    ?.filter(
                      (subcategory) =>
                        !selectedApp || subcategory.app === selectedApp
                    )
                    .map((subcategory) => (
                      <SidebarMenuSubItem key={subcategory.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subcategory.url}>
                            <span className="text-muted-foreground">{subcategory.title}</span>
                          </a>
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
