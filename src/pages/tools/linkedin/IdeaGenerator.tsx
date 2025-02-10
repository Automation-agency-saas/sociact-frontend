import { useState } from 'react';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Wand2, Sparkles, RefreshCw, History, Trash2, Copy, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../components/ui/card";

type Step = 'input' | 'generating' | 'results';
type HistoryItem = {
  id: string;
  niche: string;
  ideas: string[];
  timestamp: Date;
};

const loadingMessages = [
  "Analyzing LinkedIn trends...",
  "Identifying professional opportunities...",
  "Crafting engaging ideas...",
  "Optimizing for LinkedIn...",
  "Finalizing your content ideas..."
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

export function LinkedInIdeaGeneratorPage() {
  const [niche, setNiche] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleGenerate = async () => {
    if (!niche) {
      toast.error('Please enter your niche or topic');
      return;
    }
    
    setCurrentStep('generating');
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
      // TODO: Replace with actual API call
      const ideas = [
        "Share a success story from your professional journey",
        "Create a how-to guide for industry best practices",
        "Share insights from a recent industry conference or event",
        "Post about emerging trends in your field",
        "Share a case study of a successful project",
        "Create a list of essential tools for professionals",
        "Share lessons learned from a career challenge",
        "Post about industry innovations and their impact",
        "Share tips for professional development",
        "Create a thought leadership piece on industry changes"
      ];

      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedIdeas(ideas);
      setCurrentStep('results');

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        niche,
        ideas,
        timestamp: new Date()
      };
      setHistory(prev => [historyItem, ...prev]);
      
      toast.success('Ideas generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate ideas';
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep('input');
    } finally {
      if (loadingInterval) clearInterval(loadingInterval);
    }
  };

  const handleReset = () => {
    setNiche('');
    setCurrentStep('input');
    setGeneratedIdeas([]);
    setError(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success('History item deleted');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ToolPageWrapper
      title="LinkedIn Content Idea Generator"
      description="Generate professional content ideas that resonate with your network"
    >
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Main Generation Section */}
        <motion.div variants={itemVariants} className="bg-card rounded-lg border shadow-lg">
          <div className="p-6">
            {currentStep === 'input' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-lg font-semibold">Your Niche/Topic</label>
                    <Textarea
                      placeholder="Enter your professional niche or topic (e.g., digital marketing, software development, leadership)..."
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="min-h-[100px] text-base"
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!niche}
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Ideas
                  </Button>

                  {error && (
                    <motion.div 
                      className="p-4 rounded-lg bg-destructive/10 text-destructive"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 'generating' && (
              <motion.div 
                className="flex flex-col items-center justify-center py-12 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                  </div>
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
                <div className="text-center space-y-3">
                  <p className="text-xl font-medium text-primary">
                    {loadingMessages[loadingMessageIndex]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loadingProgress}% complete
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 'results' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Generated Ideas</h3>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Generate New Ideas
                  </Button>
                </div>

                <motion.div 
                  className="grid gap-4"
                  variants={containerVariants}
                >
                  {generatedIdeas.map((idea, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={cardHoverVariants.hover}
                    >
                      <Card className="bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="mt-1">
                                <Sparkles className="h-5 w-5 text-primary" />
                              </div>
                              <p className="text-base">{idea}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(idea)}
                              className="shrink-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* History Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <History className="h-5 w-5" />
            <h2>Generation History</h2>
          </div>

          <AnimatePresence>
            {history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                No generation history yet
              </motion.div>
            ) : (
              <motion.div 
                className="grid gap-4"
                variants={containerVariants}
              >
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={cardHoverVariants.hover}
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{item.niche}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(item.timestamp)}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteHistoryItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-2">
                          {item.ideas.slice(0, 3).map((idea, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="mt-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              </div>
                              <p className="text-sm text-muted-foreground">{idea}</p>
                            </div>
                          ))}
                          {item.ideas.length > 3 && (
                            <p className="text-xs text-muted-foreground pl-3">
                              +{item.ideas.length - 3} more ideas
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </ToolPageWrapper>
  );
} 