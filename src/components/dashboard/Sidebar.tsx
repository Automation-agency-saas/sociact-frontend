import { Zap, LogOut, Sparkles, FileText, MessageSquare, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Platform, Category } from '@/lib/types';
import { ModeToggle } from '../mode-toggle';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useAuth } from '@/lib/context/AuthContext';

interface SidebarProps {
  user: any;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeCategory: Category | null;
  toggleCategory: (category: Category) => void;
  handleDashboardClick: () => void;
}

const categoryIcons = {
  ideation: Sparkles,
  content: FileText,
  engagement: MessageSquare,
  analytics: BarChart3,
};

export function Sidebar({
  user,
  sidebarOpen,
  activeCategory,
  toggleCategory,
  handleDashboardClick,
}: SidebarProps) {
  const { signOut } = useAuth();
  const categories: Category[] = ['ideation', 'content', 'engagement', 'analytics'];

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card/50 backdrop-blur-xl transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div
          className="flex justify-between items-center gap-3 p-6 py-4 cursor-pointer hover:bg-primary/5"
          onClick={handleDashboardClick}
        >
          <div className="flex gap-3 justify-center items-center">
            <Zap className="size-10 text-primary bg-primary/10 p-2 rounded-lg" />
            <div>
              <h2 className="text-xl font-bold">Sociact</h2>
              <p className="text-xs">Dashboard</p>
            </div>
          </div>
          <ModeToggle />
        </div>
        <Separator />

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            return (
              <Button
                key={category}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 capitalize text-base font-medium hover:bg-primary/10 hover:text-primary py-6",
                  activeCategory === category && "bg-primary/10 text-primary"
                )}
                onClick={() => toggleCategory(category)}
              >
                <Icon className="h-5 w-5" />
                {category}
              </Button>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between hover:bg-primary/30 p-2 rounded-lg">
            <a href="/profile"
              className="flex gap-3"
            >
              <Avatar className=''>
                <AvatarImage src={user?.picture} />
                <AvatarFallback>
                  {user?.name?.[0]}
                </AvatarFallback>
                {user?.name?.[0]}

              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium capitalize">{user?.name || 'A Name'}</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'mail@sociact.com'}</p>
              </div>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/10 hover:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}