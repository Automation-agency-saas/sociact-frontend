import { useAuth } from '../lib/context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Menu, Youtube, Twitter,  PlusCircle, LineChart, Calendar, Video, Instagram, Clock, BarChart3, Bot, Settings, Sparkles, Search, TrendingUp, Zap, Megaphone, Camera, LayoutDashboard, Wand2, Activity, Gauge, History, ChevronDown, PenTool, MessageSquare, Share2, X, Linkedin } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { cn } from '../lib/utils';
import { useState, useMemo, useEffect } from 'react';
import { ThemeToggle } from '../components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { IdeaGeneratorModal, PlatformType } from '../components/ui/IdeaGeneratorModal';
import { ContentGeneratorModal, ContentType } from '../components/ui/ContentGeneratorModal';
import { SEOOptimizerModal } from '../components/ui/SEOOptimizerModal';

type Platform = 'all' | 'youtube' | 'instagram' | 'twitter' | 'linkedin';
type Category = 'content' | 'analytics' | 'automation' | 'optimization';

interface Tool {
  name: string;
  icon: React.ElementType;
  description: string;
  platforms: Platform[];
  comingSoon: boolean;
}

const toolsByCategory: Record<Category, Tool[]> = {
  content: [
    { 
      name: 'IdeaForge: YouTube', 
      icon: Sparkles, 
      description: 'Generate viral video ideas based on trends', 
      platforms: ['youtube'],
      comingSoon: false
    },
    { 
      name: 'ReelSpark: Instagram', 
      icon: Sparkles, 
      description: 'Generate engaging reel ideas that resonate with your audience', 
      platforms: ['instagram'],
      comingSoon: false
    },
    { 
      name: 'ThreadMind: Twitter', 
      icon: Sparkles, 
      description: 'Generate viral thread ideas that drive engagement', 
      platforms: ['twitter'],
      comingSoon: false
    },
    { 
      name: 'ProMind: LinkedIn', 
      icon: Sparkles, 
      description: 'Generate professional post ideas that build your brand', 
      platforms: ['linkedin'],
      comingSoon: false
    },
    { 
      name: 'ScriptCraft: YouTube', 
      icon: PenTool, 
      description: 'Generate engaging video scripts with AI', 
      platforms: ['youtube'],
      comingSoon: false
    },
    { 
      name: 'ThreadCraft: Twitter', 
      icon: MessageSquare, 
      description: 'Generate viral Twitter threads with AI', 
      platforms: ['twitter'],
      comingSoon: false
    },
    { 
      name: 'ProCraft: LinkedIn', 
      icon: PenTool, 
      description: 'Generate professional LinkedIn posts with AI', 
      platforms: ['linkedin'],
      comingSoon: false
    },
    { 
      name: 'CaptionCraft: Instagram', 
      icon: MessageSquare, 
      description: 'Generate engaging Instagram captions with AI', 
      platforms: ['instagram'],
      comingSoon: false
    },
    { 
      name: 'ContentFlow Planner', 
      icon: Calendar, 
      description: 'Plan and schedule your content strategy', 
      platforms: ['youtube', 'instagram', 'twitter', 'linkedin'],
      comingSoon: false
    },
    { 
      name: 'ThumbCraft: YouTube', 
      icon: Camera, 
      description: 'Create eye-catching thumbnails', 
      platforms: ['youtube'],
      comingSoon: false
    }
  ],
  analytics: [
    { 
      name: 'ChannelLens: Research', 
      icon: Search, 
      description: 'Analyze competitor channels and strategies', 
      platforms: ['youtube'],
      comingSoon: false
    },
    { 
      name: 'TrendScope: YouTube', 
      icon: TrendingUp, 
      description: 'Analyze current YouTube trends and topics', 
      platforms: ['youtube'],
      comingSoon: true
    },
    { 
      name: 'ChannelPulse: Analytics', 
      icon: BarChart3, 
      description: 'Get insights to improve channel performance', 
      platforms: ['youtube'],
      comingSoon: true
    }
  ],
  automation: [
    { 
      name: 'CommentPilot: YouTube', 
      icon: MessageSquare, 
      description: 'Automate YouTube comments with AI', 
      platforms: ['youtube'],
      comingSoon: false
    },
    { 
      name: 'TimePilot: Scheduler', 
      icon: Clock, 
      description: 'Schedule your videos for optimal times', 
      platforms: ['youtube'],
      comingSoon: false
    }
  ],
  optimization: [
    { 
      name: 'SEOPro', 
      icon: Search, 
      description: 'Optimize video titles, tags, and descriptions', 
      platforms: ['youtube'],
      comingSoon: false
    },
    { 
      name: 'StatsPro: Performance', 
      icon: LineChart, 
      description: 'Track and analyze content performance', 
      platforms: ['youtube'],
      comingSoon: false
    }
  ],
};

const platformMetrics = {
  youtube: [
    { title: 'Subscribers', value: '12.5K', change: '+12%' },
    { title: 'Views', value: '48.2K', change: '+18%' },
    { title: 'Watch Time', value: '2.4K hrs', change: '+8%' },
  ],
  instagram: [
    { title: 'Followers', value: '24.8K', change: '+15%' },
    { title: 'Engagement', value: '3.2K', change: '+22%' },
    { title: 'Reach', value: '89.1K', change: '+11%' },
  ],
  twitter: [
    { title: 'Followers', value: '18.3K', change: '+9%' },
    { title: 'Impressions', value: '152K', change: '+25%' },
    { title: 'Engagement', value: '4.7K', change: '+14%' },
  ],
  linkedin: [
    { title: 'Connections', value: '8.2K', change: '+7%' },
    { title: 'Post Views', value: '35.1K', change: '+16%' },
    { title: 'Engagement', value: '2.8K', change: '+12%' },
  ],
  all: [
    { title: 'Total Followers', value: '55.6K', change: '+13%' },
    { title: 'Total Engagement', value: '7.9K', change: '+19%' },
    { title: 'Total Reach', value: '289K', change: '+16%' },
  ],
};

// Add shuffle function after the platformMetrics object
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activePlatform, setActivePlatform] = useState<Platform>('all');
  const [activeCategory, setActiveCategory] = useState<Category>('content');
  const [showAllTools, setShowAllTools] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<Category, boolean>>({
    content: true,
    analytics: false,
    automation: false,
    optimization: false,
  });
  const [isIdeaGeneratorOpen, setIsIdeaGeneratorOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('youtube');
  const [isContentGeneratorOpen, setIsContentGeneratorOpen] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('youtube_script');
  const [isSEOOptimizerOpen, setIsSEOOptimizerOpen] = useState(false);
  const [selectedSEOPlatform, setSelectedSEOPlatform] = useState<PlatformType>('youtube');

  const toggleCategory = (category: Category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    setActiveCategory(category);
    setShowAllTools(false);
  };

  const handleDashboardClick = () => {
    setShowAllTools(true);
    setExpandedCategories({
      content: false,
      analytics: false,
      automation: false,
      optimization: false,
    });
  };

  // Get all tools or filtered tools based on showAllTools state and shuffle them
  const filteredTools = useMemo(() => {
    const tools = showAllTools 
      ? Object.values(toolsByCategory).flat()
      : toolsByCategory[activeCategory];
    return shuffleArray(tools);
  }, [showAllTools, activeCategory]);

  // Then filter by platform if not "all"
  const platformFilteredTools = useMemo(() => 
    activePlatform === 'all'
      ? filteredTools
      : filteredTools.filter(tool => tool.platforms.includes(activePlatform))
  , [filteredTools, activePlatform]);

  const currentMetrics = platformMetrics[activePlatform];

  const calendarEvents = [
    { date: '2024-03-20', platform: 'youtube', title: 'Tech Review Video' },
    { date: '2024-03-21', platform: 'instagram', title: 'Product Launch' },
    { date: '2024-03-22', platform: 'twitter', title: 'Live Tweet Session' },
  ];

  const platformIcons = {
    all: <Zap className="h-4 w-4 text-primary" />,
    youtube: <Youtube className="h-4 w-4 text-[#FF0000]" />,
    instagram: <Instagram className="h-4 w-4 text-[#E4405F]" />,
    twitter: <Twitter className="h-4 w-4 text-[#1DA1F2]" />,
    linkedin: <Linkedin className="h-4 w-4 text-[#0A66C2]" />
  };

  const platformNames = {
    all: 'All Platforms',
    youtube: 'YouTube',
    instagram: 'Instagram',
    twitter: 'Twitter',
    linkedin: 'LinkedIn'
  };

  const handleToolLaunch = (tool: Tool, platform: Platform) => {
    console.log('Tool clicked:', tool.name, 'Platform:', platform);
    
    if (tool.name.includes('IdeaForge') || tool.name.includes('ReelSpark') || 
        tool.name.includes('ThreadMind') || tool.name.includes('ProMind')) {
      if (platform === 'all') {
        setSelectedPlatform(tool.platforms[0] as PlatformType);
      } else {
        setSelectedPlatform(platform as PlatformType);
      }
      setIsIdeaGeneratorOpen(true);
      console.log('Opening Idea Generator Modal');
    } else if (tool.name.includes('ScriptCraft')) {
      setSelectedContentType('youtube_script');
      setIsContentGeneratorOpen(true);
      console.log('Opening Script Generator Modal');
    } else if (tool.name.includes('ThreadCraft')) {
      setSelectedContentType('twitter_thread');
      setIsContentGeneratorOpen(true);
      console.log('Opening Thread Generator Modal');
    } else if (tool.name.includes('ProCraft')) {
      setSelectedContentType('linkedin_post');
      setIsContentGeneratorOpen(true);
      console.log('Opening Post Generator Modal');
    } else if (tool.name.includes('CaptionCraft')) {
      setSelectedContentType('instagram_caption');
      setIsContentGeneratorOpen(true);
      console.log('Opening Caption Generator Modal');
    } else if (tool.name.includes('SEOPro')) {
      console.log('SEO Tool clicked - Opening SEO Modal');
      if (platform === 'all') {
        setSelectedSEOPlatform(tool.platforms[0] as PlatformType);
      } else {
        setSelectedSEOPlatform(platform as PlatformType);
      }
      setIsSEOOptimizerOpen(true);
      console.log('SEO Modal state set to open');
    }
  };

  // Add console log for modal state changes
  useEffect(() => {
    console.log('SEO Modal open state:', isSEOOptimizerOpen);
  }, [isSEOOptimizerOpen]);

  // Add console log for filtered tools
  useEffect(() => {
    const seoTools = platformFilteredTools.filter(tool => tool.name.includes('SEOPro'));
    console.log('Available SEO tools:', seoTools);
  }, [platformFilteredTools]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
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
              // Filter tools based on active platform
              const platformTools = activePlatform === 'all' 
                ? tools 
                : tools.filter(tool => tool.platforms.includes(activePlatform));
              
              // Only show category if it has tools for the current platform
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

          {/* Sidebar Footer */}
          <div className="border-t border-border/50">
            {/* Recent Activity */}
            <div className="p-4 space-y-3">
              <h3 className="px-2 text-sm font-medium text-muted-foreground">Recent Activity</h3>
              <div className="space-y-2">
                {[
                  { name: 'Tech Review Script', time: '2 hours ago', icon: Video },
                  { name: 'Product Launch Post', time: '5 hours ago', icon: Camera },
                  { name: 'SEO Optimization', time: 'Yesterday', icon: Search }
                ].slice(0, 3).map((activity) => (
                  <div key={activity.name} className="flex items-start gap-3 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent">
                    <History className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{activity.name}</p>
                      <p className="text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border/50">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-primary/10 hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center justify-between border-b bg-background/95 backdrop-blur-sm px-2 md:px-4">
          {/* Left side with menu and platform selector */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Platform Selector - Dropdown on mobile, Tabs on desktop */}
            <div className="flex md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {platformIcons[activePlatform]}
                    <span className="font-medium">{platformNames[activePlatform]}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {Object.entries(platformIcons).map(([platform, icon]) => (
                    <DropdownMenuItem
                      key={platform}
                      onClick={() => setActivePlatform(platform as Platform)}
                      className="gap-2"
                    >
                      {icon}
                      {platformNames[platform as Platform]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:block">
              <Tabs value={activePlatform} onValueChange={(value) => setActivePlatform(value as Platform)}>
                <TabsList className="h-10 grid grid-cols-5 w-[500px]">
                  <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>All</span>
                  </TabsTrigger>
                  <TabsTrigger value="youtube" className="gap-2 data-[state=active]:bg-red-500/10">
                    <Youtube className="h-4 w-4 text-[#FF0000]" />
                    <span>YouTube</span>
                  </TabsTrigger>
                  <TabsTrigger value="instagram" className="gap-2 data-[state=active]:bg-pink-500/10">
                    <Instagram className="h-4 w-4 text-[#E4405F]" />
                    <span>Instagram</span>
                  </TabsTrigger>
                  <TabsTrigger value="twitter" className="gap-2 data-[state=active]:bg-blue-500/10">
                    <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                    <span>Twitter</span>
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="gap-2 data-[state=active]:bg-blue-700/10">
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                    <span>LinkedIn</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <Button 
                variant="default" 
                size="icon"
                className="h-8 w-8"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
              <ThemeToggle />
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
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Create Post
              </Button>
              <ThemeToggle />
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.picture} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Metrics */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {currentMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <span className={cn(
                    'text-xs',
                    metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  )}>
                    {metric.change}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {platformFilteredTools.map((tool, index) => (
              <Card 
                key={index} 
                className={cn(
                  "group relative overflow-hidden bg-card/50 border-0 flex flex-col",
                  tool.comingSoon && "opacity-80"
                )}
              >
                {/* Card Header with Coming Soon Badge */}
                {tool.comingSoon && (
                  <div className="absolute right-3 top-3 md:right-4 md:top-4">
                    <span className="text-sm text-muted-foreground">Coming Soon</span>
                  </div>
                )}

                {/* Card Content */}
                <div className="flex-1 p-4 md:p-6">
                  {/* Tool Info */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="rounded-xl bg-primary/10 p-2 md:p-3 shrink-0">
                      <tool.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base md:text-lg font-semibold truncate">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tool.description}</p>
                      
                      {/* Platform Icons */}
                      {activePlatform === 'all' && tool.platforms.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {tool.platforms.map((p) => (
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
                              {platformIcons[p]}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer with Button */}
                <div className="p-4 md:p-2 pt-0">
                  <Button 
                    className={cn(
                      "w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors",
                      tool.comingSoon && "bg-muted hover:bg-muted text-muted-foreground hover:text-muted-foreground"
                    )}
                    disabled={tool.comingSoon}
                    onClick={() => handleToolLaunch(tool, activePlatform)}
                  >
                    {tool.comingSoon ? 'Coming Soon' : 'Launch Tool'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Content Calendar */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Upcoming Content</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {calendarEvents.map((event) => (
                    <div key={event.date} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="text-sm text-muted-foreground sm:w-24">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        {event.platform === 'youtube' && <Youtube className="h-4 w-4 text-red-500" />}
                        {event.platform === 'instagram' && <Instagram className="h-4 w-4 text-pink-500" />}
                        {event.platform === 'twitter' && <Twitter className="h-4 w-4 text-blue-400" />}
                        <span className="text-sm font-medium">{event.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Idea Generator Modal */}
      <IdeaGeneratorModal
        isOpen={isIdeaGeneratorOpen}
        onClose={() => setIsIdeaGeneratorOpen(false)}
        platform={selectedPlatform}
      />

      {/* Content Generator Modal */}
      <ContentGeneratorModal
        isOpen={isContentGeneratorOpen}
        onClose={() => setIsContentGeneratorOpen(false)}
        contentType={selectedContentType}
      />

      {/* Add SEO Optimizer Modal */}
      <SEOOptimizerModal
        isOpen={isSEOOptimizerOpen}
        onClose={() => setIsSEOOptimizerOpen(false)}
        platform={selectedSEOPlatform}
      />
    </div>
  );
} 