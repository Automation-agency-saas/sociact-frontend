import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  ChevronRight,
  FileText,
  LucideChartColumn,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { title } from "process";
import React from "react";

const NavSidebar = () => {
  const categories = [
    {
      title: "Ideation",
      icon: Sparkles,
      subcategories: [
        {
          title: "idea_forge",
          url: "/idea_forge",
        },
        {
          title: "reel_spark",
          url: "/reel_spark",
        },
        {
          title: "thread_mind",
          url: "/thread_mind",
        },
        {
          title: "pro_mind",
          url: "/pro_mind",
        },
      ],
    },
    {
      title: "Content",
      icon: MessageSquare,
      subcategories: [
        {
          title: "script_craft",
          url: "/script_craft",
        },
        {
          title: "caption_craft",
          url: "/caption_craft",
        },
        {
          title: "thread_craft",
          url: "/thread_craft",
        },
        {
          title: "pro_craft",
          url: "/pro_craft",
        },
      ],
    },
    {
      title: "Engagement",
      icon: Sparkles,
      subcategories: [
        {
          title: "idea_forge",
          url: "/idea_forge",
        },
        {
          title: "idea_forge",
          url: "/idea_forge",
        },
        {
          title: "idea_forge",
          url: "/idea_forge",
        },
        {
          title: "idea_forge",
          url: "/idea_forge",
        },
      ],
    },
    {
      title: "Analytics",
      icon: LucideChartColumn,
      subcategories: [
        {
          title: "idea_forge",
          url: "/idea_forge",
        },
        {
          title: "idea_forge",
          url: "/idea_forge",
        },
        {
          title: "idea_forge",
          url: "/idea_forge",
        },
        {
          title: "idea_forge",
          url: "/idea_forge",
        },
      ],
    },
  ];
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Categories</SidebarGroupLabel>
      <SidebarMenu>
        {categories.map((category) => (
          <Collapsible
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
                  {category.subcategories?.map((subcategory) => (
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
