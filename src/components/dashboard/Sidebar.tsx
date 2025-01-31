import { Zap, LogOut, Sparkles, FileText, MessageSquare, BarChart3, Menu, Cross, Plus, ArrowRight, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"
import { ModeToggle } from "../mode-toggle"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { useAuth } from "@/lib/context/AuthContext"
import { redirect } from "react-router-dom"

interface SidebarProps {
  user: any
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeCategory: Category | null
  toggleCategory: (category: Category) => void
  handleDashboardClick: () => void
}

const categoryIcons = {
  ideation: Sparkles,
  content: FileText,
  engagement: MessageSquare,
  analytics: BarChart3,
}

export function Sidebar({
  user,
  sidebarOpen,
  setSidebarOpen,
  activeCategory,
  toggleCategory,
  handleDashboardClick,
}: SidebarProps) {
  const { signOut } = useAuth()
  const categories: Category[] = ["ideation", "content", "engagement", "analytics"]

  return (
    <aside
      className={cn(
        "fixed md:relative inset-y-0 left-0 z-50 w-64 transform border-r bg-card/90 md:bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex justify-between items-center gap-3 p-6 py-4 cursor-pointer hover:bg-primary/5",
            !sidebarOpen && "md:justify-center",
          )}
          onClick={handleDashboardClick}
        >
          <div className="flex gap-3 justify-center items-center">
            <a href="/">
              <Zap className="size-10 text-primary bg-primary/10 p-2 rounded-lg" />
            </a>
            {sidebarOpen && (
              <div>
                <h2 className="text-xl font-bold">Sociact</h2>
                <p className="text-xs">Dashboard</p>
              </div>
            )}
          </div>
          {sidebarOpen && <ModeToggle />}
        </div>
        <Separator />

        {/* Navigation */}
        <nav className={`flex-1 space-y-2 ${sidebarOpen ? "p-4" : "p-2"}`}>
          {categories.map((category) => {
            const Icon = categoryIcons[category]
            return (
              <Button
                key={category}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 capitalize text-base font-medium hover:bg-primary/10 hover:text-primary py-6",
                  activeCategory === category && "bg-primary/10 text-primary",
                  !sidebarOpen && "md:justify-center md:px-0",
                )}
                onClick={() => toggleCategory(category)}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && category}
              </Button>
            )
          })}
        </nav>

        {/*  */}
        <div className={`p-4 hidden items-center md:flex
          ${sidebarOpen ? 'justify-end' : 'justify-center'}
          `}>
        <Button variant="link" size="icon" className="text-primary bg-foreground rounded-full " onClick={() => { setSidebarOpen(!sidebarOpen) }}>
          {/* please make a button to close sidebar */}
          {sidebarOpen ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
          {/* <ChevronRight className="size-4" /> */}
        </Button>
        </div>

        {/* User Profile Card */}
        <div className="border-t">
          <div className={`flex items-center ${sidebarOpen ? 'hover:bg-primary/10 m-2 justify-between' : 'justify-center'} p-2 rounded-lg`}>
            {sidebarOpen && (
              <a href="/profile" className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.picture} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-xs font-medium capitalize">{user?.name || "A Name"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "mail@sociact.com"}</p>
                </div>
              </a>
            )}
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
  )
}

