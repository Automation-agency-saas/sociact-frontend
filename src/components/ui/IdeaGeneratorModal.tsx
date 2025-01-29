import { useState } from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Loader2, Laptop, Gamepad, BookOpen, Sparkles, Briefcase, Film, Trophy, Music, Utensils, Plane, ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ideaGeneratorService, GeneratedIdea as IGeneratedIdea } from '../../lib/services/idea-generator';
import { toast } from 'react-hot-toast';

export type PlatformType = 'youtube' | 'instagram' | 'twitter' | 'linkedin';

interface IdeaGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformType;
}

type Step = 'select' | 'generating' | 'results';

const platformConfig = {
  youtube: {
    title: 'Video Idea Generator',
    description: 'Select up to 5 genres to generate engaging video ideas',
    contentType: 'video',
  },
  instagram: {
    title: 'Reel Idea Generator',
    description: 'Select up to 5 genres to generate engaging reel ideas',
    contentType: 'reel',
  },
  twitter: {
    title: 'Thread Idea Generator',
    description: 'Select up to 5 genres to generate viral thread ideas',
    contentType: 'thread',
  },
  linkedin: {
    title: 'Post Idea Generator',
    description: 'Select up to 5 genres to generate professional post ideas',
    contentType: 'post',
  },
};

const genres = [
  { value: 'technology', label: 'Technology', icon: Laptop, color: 'bg-blue-100 dark:bg-blue-950/50', textColor: 'text-blue-600 dark:text-blue-400' },
  { value: 'gaming', label: 'Gaming', icon: Gamepad, color: 'bg-purple-100 dark:bg-purple-950/50', textColor: 'text-purple-600 dark:text-purple-400' },
  { value: 'education', label: 'Education', icon: BookOpen, color: 'bg-green-100 dark:bg-green-950/50', textColor: 'text-green-600 dark:text-green-400' },
  { value: 'lifestyle', label: 'Lifestyle', icon: Sparkles, color: 'bg-yellow-100 dark:bg-yellow-950/50', textColor: 'text-yellow-600 dark:text-yellow-400' },
  { value: 'business', label: 'Business', icon: Briefcase, color: 'bg-gray-100 dark:bg-gray-950/50', textColor: 'text-gray-600 dark:text-gray-400' },
  { value: 'entertainment', label: 'Entertainment', icon: Film, color: 'bg-pink-100 dark:bg-pink-950/50', textColor: 'text-pink-600 dark:text-pink-400' },
  { value: 'sports', label: 'Sports', icon: Trophy, color: 'bg-red-100 dark:bg-red-950/50', textColor: 'text-red-600 dark:text-red-400' },
  { value: 'music', label: 'Music', icon: Music, color: 'bg-indigo-100 dark:bg-indigo-950/50', textColor: 'text-indigo-600 dark:text-indigo-400' },
  { value: 'cooking', label: 'Cooking', icon: Utensils, color: 'bg-teal-100 dark:bg-teal-950/50', textColor: 'text-teal-600 dark:text-teal-400' },
  { value: 'travel', label: 'Travel', icon: Plane, color: 'bg-cyan-100 dark:bg-cyan-950/50', textColor: 'text-cyan-600 dark:text-cyan-400' },
];

const loadingMessages = [
  "Analyzing trending topics...",
  "Exploring creative possibilities...",
  "Crafting engaging ideas...",
  "Adding viral potential...",
  "Finalizing your content ideas..."
];

export function IdeaGeneratorModal({ isOpen, onClose, platform }: IdeaGeneratorModalProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedIdeas, setGeneratedIdeas] = useState<IGeneratedIdea[]>([]);
  const [error, setError] = useState<string | null>(null);

  const config = platformConfig[platform];

  const handleGenreClick = (value: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(value)) {
        return prev.filter(g => g !== value);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, value];
    });
  };

  const handleGenerate = async () => {
    if (selectedGenres.length === 0) return;
    
    setCurrentStep('generating');
    setLoadingProgress(0);
    setLoadingMessageIndex(0);
    setError(null);

    // Progress intervals for different stages
    const intervals = {
      initial: { target: 85, speed: 50, increment: 1 },
      slow: { target: 98, speed: 500, increment: 2 },
    };

    let loadingInterval: NodeJS.Timeout | null = null;
    const startLoading = () => {
      loadingInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= intervals.slow.target) {
            if (loadingInterval) clearInterval(loadingInterval);
            return prev;
          }
          if (prev >= intervals.initial.target) {
            // Slow down progress after 85%
            if (loadingInterval) clearInterval(loadingInterval);
            startSlowProgress();
            return prev;
          }
          return prev + intervals.initial.increment;
        });
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, intervals.initial.speed);
    };

    const startSlowProgress = () => {
      loadingInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= intervals.slow.target) {
            if (loadingInterval) clearInterval(loadingInterval);
            return prev;
          }
          return prev + intervals.slow.increment;
        });
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, intervals.slow.speed);
    };

    startLoading();

    try {
      const response = await ideaGeneratorService.generateIdeas({
        platform,
        genres: selectedGenres
      });

      // Set to 100% when ideas are generated
      setLoadingProgress(100);
      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedIdeas(response.ideas);
      setCurrentStep('results');
      toast.success('Successfully generated ideas!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate ideas';
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep('select');
    } finally {
      if (loadingInterval) clearInterval(loadingInterval);
    }
  };

  const handleClose = () => {
    setSelectedGenres([]);
    setCurrentStep('select');
    setGeneratedIdeas([]);
    setError(null);
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="space-y-2 text-left sm:text-center mb-4">
          <DialogTitle className="text-xl md:text-2xl">{config.title}</DialogTitle>
          <DialogDescription className="text-sm md:text-base">{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep === 'select' && (
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3">Choose Your Genres</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
                {genres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre.value);
                  const Icon = genre.icon;
                  return (
                    <button
                      key={genre.value}
                      onClick={() => handleGenreClick(genre.value)}
                      className={cn(
                        'relative flex flex-col items-center justify-center p-2 md:p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105',
                        isSelected ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50',
                        genre.color,
                        !isSelected && selectedGenres.length >= 5 && 'opacity-50 cursor-not-allowed hover:scale-100'
                      )}
                      disabled={!isSelected && selectedGenres.length >= 5}
                    >
                      <Icon className={cn('h-6 w-6 md:h-8 md:w-8 mb-1 md:mb-2', genre.textColor)} />
                      <span className={cn('text-xs md:text-sm font-medium text-center', genre.textColor)}>
                        {genre.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-xs md:text-sm text-muted-foreground">
                {selectedGenres.length}/5 genres selected
              </div>
              {error && (
                <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {currentStep === 'generating' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lightbulb className="w-12 h-12 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0">
                  <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                    <circle
                      className="text-primary/20"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-primary"
                      strokeWidth="8"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (loadingProgress / 100) * 264}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-primary">
                  {loadingMessages[loadingMessageIndex]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {loadingProgress}% complete
                </p>
              </div>
            </div>
          )}

          {currentStep === 'results' && (
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold">Generated Ideas</h3>
              <div className="grid gap-4">
                {generatedIdeas.map((idea, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{idea.title}</h4>
                        <p className="text-sm text-muted-foreground">{idea.description}</p>
                      </div>
                      <span className={cn(
                        "text-sm font-medium",
                        getDifficultyColor(idea.difficulty)
                      )}>
                        {idea.difficulty}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {idea.engagement}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4 md:mt-6">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            {currentStep === 'results' ? 'Done' : 'Cancel'}
          </Button>
          {currentStep === 'select' && (
            <Button 
              onClick={handleGenerate} 
              disabled={selectedGenres.length === 0}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              Generate Ideas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 