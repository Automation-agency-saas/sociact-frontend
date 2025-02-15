import { useState, useEffect } from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Loader2, Search, Youtube, Twitter, Instagram, Linkedin, ArrowRight, Sparkles, Link, Hash, KeyRound, Lightbulb } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { Input } from './input';
import { Textarea } from './textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { SEOOptimizerService } from '../../lib/services/seo-optimizer';

export type PlatformType = 'youtube' | 'instagram' | 'twitter' | 'linkedin';

interface SEOOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformType;
}

type Step = 'input' | 'optimizing' | 'results';

interface OptimizedContent {
  title?: string;
  description?: string;
  hashtags: string[];
  keywords: string[];
  suggestions: string[];
  caption?: string;
  seo_score: number;
  original_score: number;
}

const platformConfig = {
  youtube: {
    title: 'YouTube SEO Optimizer',
    description: 'Optimize your video title and description for better visibility',
    inputLabel: 'Video Title/Description',
    inputPlaceholder: 'Enter your current video title and description',
    urlPlaceholder: 'Enter your YouTube video URL',
  },
  instagram: {
    title: 'Instagram SEO Optimizer',
    description: 'Optimize your post caption and hashtags for better reach',
    inputLabel: 'Post Caption',
    inputPlaceholder: 'Enter your current post caption',
    urlPlaceholder: 'Enter your Instagram post URL',
  },
  twitter: {
    title: 'Twitter SEO Optimizer',
    description: 'Optimize your tweet for better engagement',
    inputLabel: 'Tweet Content',
    inputPlaceholder: 'Enter your tweet content',
    urlPlaceholder: 'Enter your tweet URL',
  },
  linkedin: {
    title: 'LinkedIn SEO Optimizer',
    description: 'Optimize your post for professional visibility',
    inputLabel: 'Post Content',
    inputPlaceholder: 'Enter your post content',
    urlPlaceholder: 'Enter your LinkedIn post URL',
  },
};

const loadingMessages = [
  "Analyzing content structure...",
  "Identifying key topics...",
  "Researching trending keywords...",
  "Optimizing for engagement...",
  "Generating SEO suggestions..."
];

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
};

export function SEOOptimizerModal({ isOpen, onClose, platform }: SEOOptimizerModalProps) {
  const [content, setContent] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [optimizedContent, setOptimizedContent] = useState<OptimizedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contentUrl, setContentUrl] = useState('');

  const config = platformConfig[platform];

  useEffect(() => {
  }, [isOpen, currentStep, content, error]);

  const handleOptimize = async () => {
    if (!content && !contentUrl) {
      toast.error('Please enter content or URL to optimize');
      return;
    }
    
    setCurrentStep('optimizing');
    setLoadingProgress(0);
    setLoadingMessageIndex(0);
    setError(null);

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
      const optimizedContent = await SEOOptimizerService.optimizeContent({
        platform,
        content_url: contentUrl || undefined,
        content: content || undefined
      });

      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOptimizedContent(optimizedContent);
      setCurrentStep('results');
      toast.success('Successfully optimized content!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize content';
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep('input');
    } finally {
      if (loadingInterval) clearInterval(loadingInterval);
    }
  };

  const handleClose = () => {
    setContent('');
    setContentUrl('');
    setCurrentStep('input');
    setOptimizedContent(null);
    setError(null);
    onClose();
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'youtube': return Youtube;
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      default: return Search;
    }
  };

  const PlatformIcon = getPlatformIcon();

  const renderResults = () => {
    if (!optimizedContent) return null;
    
    // Ensure we have valid numbers and log the values
    const originalScore = Number(optimizedContent.original_score);
    const optimizedScore = Number(optimizedContent.seo_score);

    // Calculate improvement
    const improvement = optimizedScore - originalScore;
    

    // Get colors based on scores
    const originalScoreColor = getScoreColor(originalScore);
    const optimizedScoreColor = getScoreColor(optimizedScore);

    return (
      <div className="space-y-6">
        {/* SEO Score Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-8">
            {/* Original Score */}
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/20"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={276}
                  strokeDashoffset={276 - (276 * originalScore) / 100}
                  className={originalScoreColor}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{originalScore}</span>
                <span className="text-xs text-muted-foreground">Original</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center">
              <ArrowRight className="h-8 w-8 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground mt-1">
                Improved by {improvement} points
              </span>
            </div>

            {/* Optimized Score */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={352}
                  strokeDashoffset={352 - (352 * optimizedScore) / 100}
                  className={optimizedScoreColor}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{optimizedScore}</span>
                <span className="text-sm text-muted-foreground">Optimized</span>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            This score evaluates how well your content is optimized for {platform}. 
            Below are suggestions to improve it.
          </div>
        </div>

        {/* Platform Specific Content */}
        <div className="grid gap-6">
          {platform === 'youtube' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Youtube className="h-5 w-5" />
                    Optimized Title
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-base">{optimizedContent.title}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="h-5 w-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-base whitespace-pre-wrap">
                  {optimizedContent.description}
                </CardContent>
              </Card>
            </>
          )}

          {(platform === 'twitter' || platform === 'instagram' || platform === 'linkedin') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PlatformIcon className="h-5 w-5" />
                  Optimized Caption
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base whitespace-pre-wrap">
                {optimizedContent.caption}
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <KeyRound className="h-5 w-5" />
                  Target Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {optimizedContent.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hash className="h-5 w-5" />
                  Recommended Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {optimizedContent.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5" />
                Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {optimizedContent.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep('input');
              setOptimizedContent(null);
            }}
            className="w-full sm:w-auto"
          >
            Optimize Another
          </Button>
          <Button onClick={handleClose} className="w-full sm:w-auto">
            Done
          </Button>
        </DialogFooter>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="space-y-2 text-left sm:text-center mb-4">
          <DialogTitle className="text-xl md:text-2xl flex items-center justify-center gap-2">
            <PlatformIcon className="h-6 w-6" />
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep === 'input' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Content URL (Optional)</h3>
                <div className="relative">
                  <Input
                    placeholder={config.urlPlaceholder}
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="pl-9"
                  />
                  <Link className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">{config.inputLabel}</h3>
                <Textarea
                  placeholder={config.inputPlaceholder}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleOptimize}
                disabled={!content && !contentUrl}
              >
                Optimize Content
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {currentStep === 'optimizing' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-12 h-12 text-primary animate-pulse" />
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
                <div className="text-lg font-medium">
                  {loadingMessages[loadingMessageIndex]}
                </div>
                <div className="text-sm text-muted-foreground">
                  {loadingProgress}% complete
                </div>
              </div>
            </div>
          )}

          {currentStep === 'results' && renderResults()}
        </div>
      </DialogContent>
    </Dialog>
  );
} 