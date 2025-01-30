import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { SearchInput } from './Search';
import { PlatformSelector } from './Platform';
import { Platform } from '@/lib/types';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  onSearch: (query: string) => void;
  activePlatform: Platform;
  setActivePlatform: (platform: Platform) => void;
}

export function Header({
  setSidebarOpen,
  onSearch,
  activePlatform,
  setActivePlatform
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-4 py-3">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className=""
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <SearchInput onSearch={onSearch} />
      </div>
      <PlatformSelector
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
      />
    </div>
  );
}