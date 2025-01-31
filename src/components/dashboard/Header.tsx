import { Menu, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { SearchInput } from "./Search"
import { PlatformSelector } from "./Platform"
import type { Platform } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onSearch: (query: string) => void
  activePlatform: Platform
  setActivePlatform: (platform: Platform) => void
}

export function Header({ sidebarOpen, setSidebarOpen, onSearch, activePlatform, setActivePlatform }: HeaderProps) {
  return (
    <>
      {useIsMobile() && (
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <h1 className="text-xl font-bold">Welcome User</h1>
          <Button variant="outline" size="icon" className="" onClick={() => setSidebarOpen(!sidebarOpen)}>
           {sidebarOpen ? <Plus className="size-5 rotate-45" /> : <Menu className="size-5" />}
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 md:gap-4 pb-3">
        <div className="flex items-center gap-4">
          <SearchInput onSearch={onSearch} />
        </div>
        <PlatformSelector activePlatform={activePlatform} setActivePlatform={setActivePlatform} />
      </div>
    </>
  )
}

