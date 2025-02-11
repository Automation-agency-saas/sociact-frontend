import { ShootingStars } from "../ui/shooting-stars";
import { StarsBackground } from "../ui/stars-background";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../dashboard/sidebar/app-sidebar";
import { Separator } from "../ui/separator";

interface ToolLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolLayout({ children, className }: ToolLayoutProps) {
  return (
    <div className="relative w-full ">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <StarsBackground
            starDensity={0.003}
            allStarsTwinkle={true}
            twinkleProbability={0.9}
            className="opacity-70"
          />
        </div>
        <div className="absolute inset-0 z-10">
          <ShootingStars
            minDelay={1500}
            maxDelay={3000}
            starColor="#ffffff"
            trailColor="var(--primary)"
            className="opacity-90"
            starWidth={25}
            starHeight={2}
          />
        </div>
      </div>

      {/* Layout Structure */}

      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="fixed max-md:right-2 -ml-1 z-[999]" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
          {/* Main Content */}
          <main className="px-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
