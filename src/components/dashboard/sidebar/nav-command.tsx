import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Facebook,
  Instagram,
  Linkedin,
  Search,
  Twitter,
  Youtube,
} from "lucide-react";

const NavCommand: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const items = [
    {
      heading: "Instagram",
      icon: Instagram,
      commands: ["Reelspark", "CaptionCraft", "CommentPro"],
    },
    {
      heading: "Youtube",
      icon: Youtube,
      commands: [
        "IdeaForge",
        "ScriptCraft",
        "ThumbnailPro",
        "ThumbnailGen",
        "SEOPro",
      ],
    },
    {
      heading: "Twitter",
      icon: Twitter,
      commands: ["ThreadMind", "ThreadCraft"],
    },
    {
      heading: "Linkedin",
      icon: Linkedin,
      commands: ["ProMind", "ProCraft"],
    },
    {
      heading: "Facebook",
      icon: Facebook,
      commands: ["CommentPro"],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Search</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setOpen(true)} tooltip="Search">
              <Search className="mr-2 h-4 w-4" />
              <span>Search</span>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {items.map((item) => (
            <CommandGroup
              key={item.heading}
              heading={
                <span className="flex items-center gap-2">
                  <item.icon className="mr-2" />
                </span>
              }
            >
              {item.commands.map((command) => (
                <CommandItem className="text-sm" key={command}>
                  {command}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </SidebarGroup>
  );
};

export default NavCommand;
