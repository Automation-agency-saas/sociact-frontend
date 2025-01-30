import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Tool, Platform, platformConfig } from '@/lib/config/tools';

interface ToolGridProps {
  tools: Tool[];
  activePlatform: Platform;
  onToolLaunch: (tool: Tool, platform: Platform) => void;
}

export function ToolGrid({ tools, activePlatform, onToolLaunch }: ToolGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, index) => (
        <Card 
          key={index} 
          className={cn(
            "group relative overflow-hidden bg-card/50 border-0 flex flex-col",
            tool.comingSoon && "opacity-80"
          )}
        >
          {tool.comingSoon && (
            <div className="absolute right-3 top-3 md:right-4 md:top-4">
              <span className="text-sm text-muted-foreground">Coming Soon</span>
            </div>
          )}

          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="rounded-xl bg-primary/10 p-2 md:p-3 shrink-0">
                <tool.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base md:text-lg font-semibold truncate">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tool.description}</p>
                
                {activePlatform === 'all' && tool.platforms.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {tool.platforms.map((p) => {
                      const config = platformConfig[p];
                      return (
                        <div 
                          key={p} 
                          className={cn(
                            "rounded-md p-1",
                            p === 'youtube' && "bg-red-100 dark:bg-red-950/50",
                            p === 'instagram' && "bg-pink-100 dark:bg-pink-950/50",
                            p === 'twitter' && "bg-blue-100 dark:bg-blue-950/50",
                            p === 'linkedin' && "bg-blue-100/50 dark:bg-blue-950/50"
                          )}
                        >
                          <config.icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 md:p-2 pt-0">
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
        </Card>
      ))}
    </div>
  );
} 