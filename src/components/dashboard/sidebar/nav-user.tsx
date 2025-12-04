import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/context/AuthContext";
import { LogOut } from "lucide-react";

export function NavUser() {
  const { user, signOut } = useAuth();
  return (
    <SidebarMenu>
      <SidebarMenuItem className="w-full flex items-center gap-2 justify-between">
        <SidebarMenuButton
          size="lg"
          className="hover:bg-primary/10 hover:text-primary"
        >
          <a href="/profile/me" className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.picture} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left px-2">
              <p className="text-xs font-medium capitalize">
                {user?.name || "A Name"}
              </p>
              <p className="text-[8px] truncate  text-muted-foreground">
                {user?.email || "mail@Social Automation.com"}
              </p>
            </div>
          </a>
        </SidebarMenuButton>
        <Button
          size="icon"
          variant={"secondary"}
          className="hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:hidden"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
