import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Tool, platformConfig } from '@/lib/config/tools';
import { Platform } from '@/lib/types';
import { MagicCard } from '../ui/magic-card';
import { useTheme } from 'next-themes';


interface ToolGridProps {
  tools: Tool[];
  activePlatform: Platform;
  onToolLaunch: (tool: Tool, platform: Platform) => void;
}

export function ToolGrid({ tools, activePlatform, onToolLaunch }: ToolGridProps) {
  const { theme } = useTheme();

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, index) => (
        <MagicCard
          key={index}
          className={cn(
            "cursor-pointer shadow-2xl shadow-primary/10 group relative overflow-hidden bg-primary/50  border-white/50 flex flex-col",
            tool.comingSoon && "opacity-80"
          )}
          gradientColor={theme === "dark" ? "#000" : "#D9D9D9"}
        >
          {/* {tool.comingSoon && (
            <div className="absolute right-3 top-3 md:right-4 md:top-4">
              <span className="text-sm text-muted-foreground">Coming Soon</span>
            </div>
          )} */}

          <div className="flex-1 grid grid-cols-2 gap-5 p-4 md:p-6">
            <div className="rounded-lg group-hover:rounded-3xl w-40 h-full flex bg-zinc-100 p-2 md:p-3 flex-shrink-0 transition-all duration-500 ease-in-out">
              <tool.icon className="size-full p-6 group-hover:p-3 text-primary/70 transition-all duration-300 ease-in-out " />
            </div>
            <div className="flex flex-col items-start gap-3 md:gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-base md:text-lg font-black truncate">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tool.description}</p>

                {activePlatform === 'all' && tool.platforms.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {tool.platforms.map((p) => {
                      const config = platformConfig[p];
                      return (
                        <div
                          key={p}
                          className={cn(
                            "rounded-sm p-2",
                            p === 'youtube' && "bg-red-100 dark:bg-red-950/50",
                            p === 'instagram' && "bg-pink-100 dark:bg-pink-950/50",
                            p === 'twitter' && "bg-blue-100 dark:bg-blue-950/50",
                            p === 'linkedin' && "bg-blue-100/50 dark:bg-blue-950/50"
                          )}
                        >
                          <config.icon className={`size-5 ${config.color}`} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <Button
                className={cn(
                  "w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors",
                  tool.comingSoon && "bg-muted hover:bg-muted text-muted-foreground hover:text-muted-foreground"
                )}
                disabled={tool.comingSoon}
                onClick={() => onToolLaunch(tool, activePlatform)}
              >
                {tool.comingSoon ? 'Coming Soon' : 'Launch Tool'}
              </Button>
            </div>
          </div>

        </MagicCard>
      ))}
    </div>
  );
} 