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

  const apps = [
    "All",
    "youtube",
    "instagram",
    "twitter",
    "linkedin",
    "facebook",
  ];
  const renderAppIcon = (app: string | null) => {
    switch (app) {
      case "youtube":
        return <Youtube className=" w-4 h-4" />;
      case "instagram":
        return <Instagram className=" w-4 h-4" />;
      case "facebook":
        return <Facebook className=" w-4 h-4" />;
      case "twitter":
        return <Twitter className=" w-4 h-4" />;
      case "linkedin":
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
              {selectedApp ? `Filter by ${selectedApp}` : "Filter by App"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          {apps.map((app) => (
            <DropdownMenuItem
              key={app}
              onSelect={() => setSelectedApp(app === "All" ? null : app)}
            >
              {app}
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
                  {category.icon && <category.icon />}
                  <span>{category.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                            <span>{subcategory.title}</span>
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
