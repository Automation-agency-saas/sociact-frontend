import { useState } from 'react';
import { Button } from '../ui/button';
import { X, ChevronDown, LayoutDashboard, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tool, Category, Platform } from '@/lib/config/tools';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toolsByCategory: Record<Category, Tool[]>;
  activePlatform: Platform;
  activeCategory: Category | null;
  showAllTools: boolean;
  expandedCategories: Record<Category, boolean>;
  handleDashboardClick: () => void;
  toggleCategory: (category: Category) => void;
  handleToolLaunch: (tool: Tool, platform: Platform) => void;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  toolsByCategory,
  activePlatform,
  activeCategory,
  showAllTools,
  expandedCategories,
  handleDashboardClick,
  toggleCategory,
  handleToolLaunch,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card/50 backdrop-blur-xl transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Mobile close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 md:hidden"
        onClick={() => setSidebarOpen(false)}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 p-6">
          <div className="rounded-lg bg-primary/10 p-2">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Sociact</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sm font-medium hover:bg-primary/10 hover:text-primary",
              showAllTools && "bg-primary/10 text-primary"
            )}
            onClick={handleDashboardClick}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>

          {/* Tool Categories */}
          {Object.entries(toolsByCategory).map(([category, tools]) => {
            const platformTools = activePlatform === 'all' 
              ? tools 
              : tools.filter(tool => tool.platforms.includes(activePlatform));
            
            if (platformTools.length === 0) return null;

            return (
              <div key={category} className="space-y-1 pt-2">
                <button
                  onClick={() => toggleCategory(category as Category)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'hover:bg-primary/10 hover:text-primary',
                    activeCategory === category && !showAllTools ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  )}
                >
                  <span className="capitalize">{category}</span>
                  <ChevronDown className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    expandedCategories[category as Category] ? 'rotate-180' : ''
                  )} />
                </button>
                {expandedCategories[category as Category] && (
                  <div className="ml-3 space-y-1 border-l-2 border-border pl-3">
                    {platformTools.map((tool) => (
                      <Button
                        key={tool.name}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 font-normal hover:bg-primary/5 hover:text-primary"
                        onClick={() => handleToolLaunch(tool, activePlatform)}
                      >
                        <tool.icon className="h-4 w-4" />
                        {tool.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 