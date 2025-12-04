import { ModeToggle } from "@/components/mode-toggle";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Zap } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const SidebarHead: React.FC = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="w-full py-2 flex items-center gap-2 justify-between">
        <div className="w-full flex gap-3 justify-center items-center">
          <motion.a 
            href="/home"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-sm opacity-75" />
              <Zap className="size-10 group-data-[collapsible=icon]:size-8 text-white bg-black p-2 rounded-lg relative" />
            </div>
          </motion.a>
          <div className="group-data-[collapsible=icon]:hidden w-full flex items-center justify-between">
            <div>
              <motion.h2 
                className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Social Automation
              </motion.h2>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
            {/* <ModeToggle />{" "} */}
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarHead;
