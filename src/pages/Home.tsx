import { useState } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';
import { IdeaGeneratorModal, PlatformType as IdeaPlatformType } from '../components/ui/IdeaGeneratorModal';
import { ThumbnailProModal } from '../components/ui/ThumbnailProModal';
import { ThumbnailGenModal } from '../components/ui/ThumbnailGenModal';
import { ContentGeneratorModal, ContentType } from '../components/ui/ContentGeneratorModal';
import { SEOOptimizerModal } from '../components/ui/SEOOptimizerModal';
import { CommentAutomationModal, PlatformType as CommentPlatformType } from '../components/ui/CommentAutomationModal';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { ToolGrid } from '../components/dashboard/ToolGrid';
import { tools, Tool } from '../lib/config/tools';
import { Platform, Category } from '../lib/types';

export default function Home() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activePlatform, setActivePlatform] = useState<Platform>('all');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isIdeaGeneratorOpen, setIsIdeaGeneratorOpen] = useState(false);
  const [isThumbnailProOpen, setIsThumbnailProOpen] = useState(false);
  const [isThumbnailGenOpen, setIsThumbnailGenOpen] = useState(false);
  const [isContentGeneratorOpen, setIsContentGeneratorOpen] = useState(false);
  const [isSEOOptimizerOpen, setIsSEOOptimizerOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<IdeaPlatformType>('youtube');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('youtube_script');
  const [selectedSEOPlatform, setSelectedSEOPlatform] = useState<IdeaPlatformType>('youtube');
  const [isCommentAutomationOpen, setIsCommentAutomationOpen] = useState(false);
  const [selectedCommentPlatform, setSelectedCommentPlatform] = useState<CommentPlatformType>('instagram');

  // Filter tools based on category, platform, and search
  const filteredTools = tools.filter(tool => {
    const matchesCategory = !activeCategory || tool.category === activeCategory;
    const matchesPlatform = activePlatform === 'all' || tool.platforms.includes(activePlatform);
    const matchesSearch = !searchQuery || tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPlatform && matchesSearch;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDashboardClick = () => {
    setActiveCategory(null);
    setActivePlatform('all');
    setSearchQuery('');
  };

  const toggleCategory = (category: Category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleToolLaunch = (tool: Tool, platform: Platform) => {
    if (tool.name.includes('IdeaForge') || tool.name.includes('ReelSpark') ||
      tool.name.includes('ThreadMind') || tool.name.includes('ProMind')) {
      setSelectedPlatform((platform === 'all' ? tool.platforms[0] : platform) as IdeaPlatformType);
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
      setSelectedSEOPlatform((platform === 'all' ? tool.platforms[0] : platform) as IdeaPlatformType);
      setIsSEOOptimizerOpen(true);
    } else if (tool.name.includes('CommentPro')) {
      if (platform !== 'linkedin') {
        const commentPlatform = tool.name.includes('Facebook') ? 'facebook' : 'instagram';
        setSelectedCommentPlatform(commentPlatform as CommentPlatformType);
        setIsCommentAutomationOpen(true);
      }
    } else if (tool.name === 'ThumbnailPro') {
      setIsThumbnailProOpen(true);
    } else if (tool.name === 'ThumbnailGen') {
      setIsThumbnailGenOpen(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )} */}

      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeCategory={activeCategory}
        toggleCategory={toggleCategory}
        handleDashboardClick={handleDashboardClick}
      />

      <div className="bg-gray-200 dark:bg-zinc-900 flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onSearch={handleSearch}
            activePlatform={activePlatform}
            setActivePlatform={setActivePlatform}
          />
          {/* <div className="z-40 flex items-center justify-between gap-2 md:gap-4">
            <SearchInput onSearch={handleSearch} />
            <PlatformSelector
              activePlatform={activePlatform}
              setActivePlatform={setActivePlatform}
            />
          </div> */}
          <ToolGrid
            tools={filteredTools}
            activePlatform={activePlatform}
            onToolLaunch={handleToolLaunch}
          />
        </main>
      </div>

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
      <ThumbnailProModal
        isOpen={isThumbnailProOpen}
        onClose={() => setIsThumbnailProOpen(false)}
      />
      <ThumbnailGenModal
        isOpen={isThumbnailGenOpen}
        onClose={() => setIsThumbnailGenOpen(false)}
      />
    </div>
  );
}