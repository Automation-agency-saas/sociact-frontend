import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Copy, ChartBar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Progress } from '../../../components/ui/progress';
import { HistorySection } from '../../../components/shared/HistorySection';
import { containerVariants, itemVariants, cardHoverVariants, SEOHistoryItem } from '../../../lib/animations';

export function YouTubeSEOOptimizerPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState<{
    title: string;
    description: string;
    keywords: string[];
    score: number;
  } | null>(null);
  const [history, setHistory] = useState<SEOHistoryItem[]>([]);

  const optimizeContent = async () => {
    if (!content) {
      toast.error('Please enter your content');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = {
        title: 'How to Master YouTube SEO in 2024 - Complete Guide',
        description: 'Learn the latest YouTube SEO strategies for 2024. This comprehensive guide covers keyword research, title optimization, description writing, and more. Perfect for creators looking to grow their channel.',
        keywords: [
          'youtube seo',
          'youtube optimization',
          'video ranking',
          'channel growth',
          'metadata optimization',
          '2024 seo guide'
        ],
        score: 85
      };
      
      setOptimizedContent(result);
      const historyItem: SEOHistoryItem = {
        id: uuidv4(),
        timestamp: new Date(),
        content,
        optimizedContent: result
      };
      setHistory(prev => [historyItem, ...prev]);
      toast.success('Content optimized successfully!');
    } catch (error) {
      toast.error('Failed to optimize content. Please try again.');
    } finally {
      setLoading(false);
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
    <ToolPageWrapper
      title="YouTube SEO Optimizer"
      description="Optimize your video content for better visibility and ranking"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <Card className="p-6 bg-background/60 backdrop-blur-lg">
            <motion.div variants={containerVariants} className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Optimize Content</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Content</label>
                  <Textarea
                    placeholder="Enter your video title, description, and tags..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={optimizeContent}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing Content...
                    </>
                  ) : (
                    'Optimize Content'
                  )}
                </Button>
              </div>

              {optimizedContent && (
                <motion.div
                  variants={containerVariants}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">SEO Score</h3>
                    <span className={getScoreColor(optimizedContent.score)}>
                      {optimizedContent.score}%
                    </span>
                  </div>
                  <Progress value={optimizedContent.score} className="h-2" />

                  <Card className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <label className="text-sm font-medium">Optimized Title</label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(optimizedContent.title)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm">{optimizedContent.title}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <label className="text-sm font-medium">Optimized Description</label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(optimizedContent.description)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm">{optimizedContent.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <label className="text-sm font-medium">Suggested Keywords</label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(optimizedContent.keywords.join(', '))}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {optimizedContent.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
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
                <span className={`ml-2 ${getScoreColor(item.optimizedContent.score)}`}>
                  {item.optimizedContent.score}%
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
    </ToolPageWrapper>
  );
} 