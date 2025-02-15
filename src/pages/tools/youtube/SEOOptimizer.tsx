import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Copy, ChartBar, Youtube, Search, KeyRound, Hash, Lightbulb, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Progress } from '../../../components/ui/progress';
import { HistorySection } from '../../../components/shared/HistorySection';
import { containerVariants, itemVariants, cardHoverVariants } from '../../../lib/animations';
import { ToolLayout } from '@/components/tool-page/ToolLayout';
import { ToolTitle } from '@/components/ui/tool-title';
import { SEOOptimizerService } from '@/lib/services/seo-optimizer';

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

interface SEOHistoryItem {
  id: string;
  timestamp: Date;
  content: string;
  optimizedContent: OptimizedContent;
}

type Step = 'input' | 'optimizing' | 'results';

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

export function YouTubeSEOOptimizerPage() {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [optimizedContent, setOptimizedContent] = useState<OptimizedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SEOHistoryItem[]>([]);

  const optimizeContent = async () => {
    if (!content && !url) {
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
      const optimizedResult = await SEOOptimizerService.optimizeContent({
        platform: 'youtube',
        content_url: url || undefined,
        content: content || undefined
      });

      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOptimizedContent(optimizedResult);
      setCurrentStep('results');

      const historyItem: SEOHistoryItem = {
        id: uuidv4(),
        timestamp: new Date(),
        content: content,
        optimizedContent: optimizedResult
      };
      setHistory(prev => [historyItem, ...prev]);
      
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success('History item deleted');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <ToolLayout>  
      <ToolTitle 
        title="YouTube SEO Optimizer"
        description="Optimize your video content for better visibility and ranking"
      />
      <div className=" max-w-6xl mx-auto pb-20 flex flex-col gap-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <Card className="p-6 bg-background/60 backdrop-blur-lg">
            <motion.div variants={containerVariants} className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Optimize Content</h2>
              
              {currentStep === 'input' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Youtube Video URL (Optional)</label>
                    <Input
                      placeholder="Put your youtube video url here"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Video Title and Description</label>
                    <Textarea
                      placeholder="Enter your video title, description, and tags..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                    />
                  </div>

                  {error && (
                    <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={optimizeContent}
                    disabled={!content && !url}
                  >
                    Optimize Content
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

              {currentStep === 'results' && optimizedContent && (
                <motion.div variants={containerVariants} className="space-y-6">
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
                          strokeDashoffset={276 - (276 * optimizedContent.original_score) / 100}
                          className={getScoreColor(optimizedContent.original_score)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">{optimizedContent.original_score}</span>
                        <span className="text-xs text-muted-foreground">Original</span>
                      </div>
                    </div>

                    {/* Improvement Arrow */}
                    <div className="flex flex-col items-center">
                      <ChartBar className="h-8 w-8 text-primary animate-pulse" />
                      <span className="text-xs text-muted-foreground mt-1">
                        Improved by {optimizedContent.seo_score - optimizedContent.original_score} points
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
                          strokeDashoffset={352 - (352 * optimizedContent.seo_score) / 100}
                          className={getScoreColor(optimizedContent.seo_score)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{optimizedContent.seo_score}</span>
                        <span className="text-sm text-muted-foreground">Optimized</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <Card>
                      <div className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Youtube className="h-5 w-5" />
                            Optimized Title
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(optimizedContent.title || '')}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-base">{optimizedContent.title}</p>
                      </div>
                    </Card>

                    <Card>
                      <div className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Description
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(optimizedContent.description || '')}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-base whitespace-pre-wrap">{optimizedContent.description}</p>
                      </div>
                    </Card>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                      <Card>
                        <div className="p-4 space-y-4">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <KeyRound className="h-5 w-5" />
                            Target Keywords
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {optimizedContent.keywords.map((keyword: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-4 space-y-4">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Hash className="h-5 w-5" />
                            Recommended Hashtags
                          </h3>
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
                        </div>
                      </Card>
                    </div>

                    <Card>
                      <div className="p-4 space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Optimization Tips
                        </h3>
                        <ul className="space-y-3">
                          {optimizedContent.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentStep('input');
                          setOptimizedContent(null);
                        }}
                        className="flex-1"
                      >
                        Optimize Another
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </Card>
        </motion.div>

        <HistorySection<SEOHistoryItem>
          title="Optimization History"
          items={history}
          onDelete={deleteHistoryItem}
          renderPreview={(item) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium truncate flex-1">
                  {item.optimizedContent.title}
                </div>
                <span className={`ml-2 ${getScoreColor(item.optimizedContent.seo_score)}`}>
                  {item.optimizedContent.seo_score}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {item.optimizedContent.description}
              </div>
              <div className="flex flex-wrap gap-1">
                {item.optimizedContent.keywords.slice(0, 3).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {keyword}
                  </span>
                ))}
                {item.optimizedContent.keywords.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{item.optimizedContent.keywords.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </ToolLayout>
  );
} 