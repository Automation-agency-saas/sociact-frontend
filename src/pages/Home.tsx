import { useState } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';
import { IdeaGeneratorModal, PlatformType } from '../components/ui/IdeaGeneratorModal';
import { ContentGeneratorModal, ContentType } from '../components/ui/ContentGeneratorModal';
import { SEOOptimizerModal } from '../components/ui/SEOOptimizerModal';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { ToolGrid } from '../components/dashboard/ToolGrid';
import { tools, Tool, Platform, Category } from '../lib/config/tools';
import { CommentAutomationModal } from '../components/ui/CommentAutomationModal';

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
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('youtube');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('youtube_script');
  const [selectedSEOPlatform, setSelectedSEOPlatform] = useState<PlatformType>('youtube');

  // Add new state
  const [isCommentAutomationOpen, setIsCommentAutomationOpen] = useState(false);
  const [selectedCommentPlatform, setSelectedCommentPlatform] = useState<PlatformType>('instagram');

  // Filter tools based on active platform
  const platformFilteredTools = tools.filter(tool => {
    if (activePlatform === 'all') return true;
    return tool.platforms.includes(activePlatform);
  });

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

  const handleToolLaunch = (tool: Tool, platform: Platform) => {
    if (tool.name.includes('IdeaForge') || tool.name.includes('ReelSpark') || 
        tool.name.includes('ThreadMind') || tool.name.includes('ProMind')) {
      if (platform === 'all') {
        setSelectedPlatform(tool.platforms[0] as PlatformType);
      } else {
        setSelectedPlatform(platform as PlatformType);
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
        setSelectedSEOPlatform(tool.platforms[0] as PlatformType);
      } else {
        setSelectedSEOPlatform(platform as PlatformType);
      }
      setIsSEOOptimizerOpen(true);
    } else if (tool.name === 'CommentPro') {
      if (platform === 'all') {
        setSelectedCommentPlatform('instagram');
      } else {
        setSelectedCommentPlatform(platform as PlatformType);
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          activePlatform={activePlatform}
          setActivePlatform={setActivePlatform}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <ToolGrid
            tools={platformFilteredTools}
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