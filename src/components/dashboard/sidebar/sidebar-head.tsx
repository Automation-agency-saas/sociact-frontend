import { ModeToggle } from "@/components/mode-toggle";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Zap } from "lucide-react";
import React from "react";

const SidebarHead:React.FC = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="w-full py-2 flex items-center gap-2 justify-between">
        <div className="w-full flex gap-3 justify-center items-center">
          <a href="/home">
            <Zap className="size-10 group-data-[collapsible=icon]:size-8 text-primary bg-primary/10 p-2 rounded-lg" />
          </a>
          <div className="group-data-[collapsible=icon]:hidden w-full flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Sociact</h2>
              <p className="text-xs">Dashboard</p>
            </div>
            {/* <ModeToggle />{" "} */}
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarHead;
