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
import { motion } from "framer-motion";
import { tools, platformConfig } from "@/lib/config/tools";
import { cn } from "@/lib/utils";

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

  const items = Object.entries(platformConfig)
    .filter(([key]) => key !== 'all')
    .map(([platform, config]) => ({
      heading: config.name,
      icon: config.icon,
      commands: tools
        .filter(tool => tool.platforms.includes(platform as any))
        .map(tool => ({
          title: tool.title,
          url: tool.url,
          comingSoon: tool.comingSoon,
        }))
    }));

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-purple-400 font-medium">Search</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setOpen(true)} 
              tooltip="Search"
              className="hover:bg-purple-400/20 transition-all duration-300 group/search"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="mr-2 h-4 w-4 text-purple-400" />
              </motion.div>
              <span className="group-hover/search:text-purple-400 transition-colors">Search</span>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-purple-400/20 bg-purple-400/10 px-1.5 font-mono text-[10px] font-medium text-purple-400 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." className="border-purple-400/20" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {items.map((item) => (
            <CommandGroup
              key={item.heading}
              heading={
                <span className="flex items-center gap-2 text-purple-400">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-purple-400/10 p-1 rounded"
                  >
                    <item.icon className="mr-2" />
                  </motion.div>
                  {item.heading}
                </span>
              }
            >
              {item.commands.map((command) => (
                <CommandItem 
                  className={cn(
                    "text-sm hover:bg-purple-400/20 group/command",
                    command.comingSoon && "opacity-70 cursor-not-allowed"
                  )} 
                  key={command.title}
                >
                  {command.comingSoon ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="group-hover/command:text-purple-400 transition-colors">
                        {command.title}
                      </span>
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  ) : (
                    <a href={command.url} className="flex items-center gap-2 w-full">
                      <span className="group-hover/command:text-purple-400 transition-colors">
                        {command.title}
                      </span>
                    </a>
                  )}
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
