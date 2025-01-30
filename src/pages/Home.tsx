import { useState, useMemo } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';
import { IdeaGeneratorModal, PlatformType as IdeaPlatformType } from '../components/ui/IdeaGeneratorModal';
import { ContentGeneratorModal, ContentType } from '../components/ui/ContentGeneratorModal';
import { SEOOptimizerModal } from '../components/ui/SEOOptimizerModal';
import { CommentAutomationModal, PlatformType as CommentPlatformType } from '../components/ui/CommentAutomationModal';
import { Sidebar } from '../components/dashboard/Sidebar';
// import { Header } from '../components/dashboard/Header';
import { ToolGrid } from '../components/dashboard/ToolGrid';
import { tools, Tool } from '../lib/config/tools';
import { Platform, Category } from '../lib/types';
import { SearchInput } from '@/components/dashboard/Search';
import { PlatformSelector } from '@/components/dashboard/Platform';

// Organize tools by category
const toolsByCategory = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<Category, Tool[]>);

export default function Home() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activePlatform, setActivePlatform] = useState<Platform>('all');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [showAllTools, setShowAllTools] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<Category, boolean>>({
    ideation: false,
    content: false,
    engagement: false,
    analytics: false,
  });

  // Modal states
  const [isIdeaGeneratorOpen, setIsIdeaGeneratorOpen] = useState(false);
  const [isContentGeneratorOpen, setIsContentGeneratorOpen] = useState(false);
  const [isSEOOptimizerOpen, setIsSEOOptimizerOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<IdeaPlatformType>('youtube');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('youtube_script');
  const [selectedSEOPlatform, setSelectedSEOPlatform] = useState<IdeaPlatformType>('youtube');

  // Comment automation states
  const [isCommentAutomationOpen, setIsCommentAutomationOpen] = useState(false);
  const [selectedCommentPlatform, setSelectedCommentPlatform] = useState<CommentPlatformType>('instagram');

  // Filter tools based on active platform and search query
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesPlatform = activePlatform === 'all' || tool.platforms.includes(activePlatform);
      const matchesSearch = searchQuery === "" ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }, [activePlatform, searchQuery]);

  const handleDashboardClick = () => {
    setShowAllTools(true);
    setActiveCategory(null);
  };

  const toggleCategory = (category: Category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    setActiveCategory(category);
    setShowAllTools(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleToolLaunch = (tool: Tool, platform: Platform) => {
    if (tool.name.includes('IdeaForge') || tool.name.includes('ReelSpark') ||
      tool.name.includes('ThreadMind') || tool.name.includes('ProMind')) {
      if (platform === 'all') {
        setSelectedPlatform(tool.platforms[0] as IdeaPlatformType);
      } else {
        setSelectedPlatform(platform as IdeaPlatformType);
      }
      setIsIdeaGeneratorOpen(true);
    } else if (tool.name.includes('ScriptCraft')) {
      setSelectedContentType('youtube_script');
      setIsContentGeneratorOpen(true);
    } else if (tool.name.includes('ThreadCraft')) {
      setSelectedContentType('twitter_thread');
      setIsContentGeneratorOpen(true);
    } else if (tool.name.includes('ProCraft')) {
      setSelectedContentType('linkedin_post');
      setIsContentGeneratorOpen(true);
    } else if (tool.name.includes('CaptionCraft')) {
      setSelectedContentType('instagram_caption');
      setIsContentGeneratorOpen(true);
    } else if (tool.name.includes('SEOPro')) {
      if (platform === 'all') {
        setSelectedSEOPlatform(tool.platforms[0] as IdeaPlatformType);
      } else {
        setSelectedSEOPlatform(platform as IdeaPlatformType);
      }
      setIsSEOOptimizerOpen(true);
    } else if (tool.name === 'CommentPro') {
      if (platform === 'all') {
        setSelectedCommentPlatform('instagram');
      } else if (platform !== 'linkedin') {
        setSelectedCommentPlatform(platform as CommentPlatformType);
      }
      setIsCommentAutomationOpen(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        toolsByCategory={toolsByCategory}
        activePlatform={activePlatform}
        activeCategory={activeCategory}
        showAllTools={showAllTools}
        expandedCategories={expandedCategories}
        handleDashboardClick={handleDashboardClick}
        toggleCategory={toggleCategory}
        handleToolLaunch={handleToolLaunch}
      />

      <div className="bg-gray-200 dark:bg-zinc-900 flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="z-40 flex items-center justify-between gap-2 md:gap-4">
          <SearchInput onSearch={handleSearch} />
          <PlatformSelector
            activePlatform={activePlatform}
            setActivePlatform={setActivePlatform}
          />
        </div>
          <ToolGrid
            tools={filteredTools}
            activePlatform={activePlatform}
            onToolLaunch={handleToolLaunch}
          />
        </main>
      </div>

      {/* Modals */}
      <IdeaGeneratorModal
        isOpen={isIdeaGeneratorOpen}
        onClose={() => setIsIdeaGeneratorOpen(false)}
        platform={selectedPlatform}
      />
      <ContentGeneratorModal
        isOpen={isContentGeneratorOpen}
        onClose={() => setIsContentGeneratorOpen(false)}
        contentType={selectedContentType}
      />
      <SEOOptimizerModal
        isOpen={isSEOOptimizerOpen}
        onClose={() => setIsSEOOptimizerOpen(false)}
        platform={selectedSEOPlatform}
      />
      <CommentAutomationModal
        isOpen={isCommentAutomationOpen}
        onClose={() => setIsCommentAutomationOpen(false)}
        platform={selectedCommentPlatform}
      />
    </div>
  );
}