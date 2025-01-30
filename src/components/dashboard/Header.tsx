import { Button } from '../ui/button';
import { ModeToggle } from '../mode-toggle';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { PlusCircle } from 'lucide-react';
import { Platform } from '@/lib/config/tools';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { platformConfig } from '@/lib/config/tools';

interface HeaderProps {
  user: any;
  activePlatform: Platform;
  setActivePlatform: (platform: Platform) => void;
}

export function Header({ user, activePlatform, setActivePlatform }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="hidden md:block">
          <Tabs value={activePlatform} onValueChange={(value) => setActivePlatform(value as Platform)}>
            <TabsList className="h-10 grid grid-cols-5 w-[500px]">
              {Object.entries(platformConfig).map(([key, config]) => (
                <TabsTrigger 
                  key={key}
                  value={key as Platform} 
                  className="gap-2 data-[state=active]:bg-primary/10"
                >
                  <config.icon className={`h-4 w-4 ${config.color}`} />
                  <span>{config.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="default" size="icon" className="h-8 w-8">
              <PlusCircle className="h-4 w-4" />
            </Button>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user?.picture} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="default" size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Post
            </Button>
            <ModeToggle />
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.picture} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
} 