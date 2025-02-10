import { useState } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { ToolGrid } from '../components/dashboard/ToolGrid';
import { tools, Tool } from '../lib/config/tools';
import { Platform, Category } from '../lib/types';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activePlatform, setActivePlatform] = useState<Platform>('all');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    // Ideation tools
    if (tool.name === 'IdeaForge') {
      navigate('/youtube/idea-generator');
    } else if (tool.name === 'ReelSpark') {
      navigate('/instagram/idea-generator');
    } else if (tool.name === 'ThreadMind') {
      navigate('/twitter/idea-generator');
    } else if (tool.name === 'ProMind') {
      navigate('/linkedin/idea-generator');
    }
    
    // Content creation tools
    else if (tool.name === 'ScriptCraft') {
      navigate('/youtube/script-generator');
    } else if (tool.name === 'CaptionCraft') {
      navigate('/instagram/caption-generator');
    } else if (tool.name === 'ThreadCraft') {
      navigate('/twitter/thread-generator');
    } else if (tool.name === 'ProCraft') {
      navigate('/linkedin/post-generator');
    }
    
    // Analytics and SEO tools
    else if (tool.name === 'SEOPro') {
      navigate('/youtube/seo-optimizer');
    }
    
    // Engagement tools
    else if (tool.name === 'CommentPro - Instagram') {
      navigate('/instagram/comment-automation');
    } else if (tool.name === 'CommentPro - Facebook') {
      navigate('/facebook/comment-automation');
    }
    
    // Thumbnail tools
    else if (tool.name === 'ThumbnailPro' || tool.name === 'ThumbnailGen') {
      navigate('/youtube/thumbnail-generator');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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
          <ToolGrid
            tools={filteredTools}
            activePlatform={activePlatform}
            onToolLaunch={handleToolLaunch}
          />
        </main>
      </div>
    </div>
  );
}