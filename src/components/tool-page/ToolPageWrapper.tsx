import { ReactNode } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../dashboard/Sidebar';
import { useAuth } from '@/lib/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import type { Category } from '@/lib/types';

interface ToolPageWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function ToolPageWrapper({ children, title, description }: ToolPageWrapperProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const handleDashboardClick = () => {
    navigate('/home');
  };

  const toggleCategory = (category: Category) => {
    setActiveCategory(activeCategory === category ? null : category);
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Back button and header */}
          <div className="max-w-[900px] mx-auto">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => navigate('/home')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Button>

            {/* Header */}
            <div className="space-y-2 text-left sm:text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>

            {/* Content */}
            <div className="bg-card border rounded-lg shadow-lg">
              <div className="p-4 md:p-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 