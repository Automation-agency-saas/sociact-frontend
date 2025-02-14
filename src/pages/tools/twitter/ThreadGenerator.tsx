import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Wand2, Copy, RefreshCw, MessageSquare, ArrowDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ToolLayout } from '../../../components/tool-page/ToolLayout';
import { ToolTitle } from "@/components/ui/tool-title";
import { contentGeneratorService } from "../../../lib/services/content-generator";
import { containerVariants, cardHoverVariants } from '../../../lib/animations';

type Step = 'input' | 'generating' | 'results';

const loadingMessages = [
  "Analyzing your topic...",
  "Structuring the thread...",
  "Adding engaging hooks...",
  "Optimizing for readability...",
  "Finalizing your thread..."
];

const tweetCountOptions = [3, 5, 7, 9, 11, 13, 15];

export function TwitterThreadGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [tweetCount, setTweetCount] = useState<number>(5);
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedThread, setGeneratedThread] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!tweetCount || !description) {
      toast.error('Please provide both topic and description');
      return;
    }

    if (tweetCount < 3 || tweetCount > 15) {
      toast.error('Tweet count must be between 3 and 15');
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
      const response = await contentGeneratorService.generateTwitterThread(description, Number(tweetCount));
      
      if (response.status === 'success' && response.content) {
        setLoadingProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Split the content string into an array of tweets
        const tweets = response.content
          .split('\n\n')
          .filter(tweet => tweet.trim() !== '');
        
        setGeneratedThread(tweets);
        setCurrentStep('results');
        toast.success('Thread generated successfully!');
      } else {
        throw new Error(response.message || 'Failed to generate thread');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate thread';
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep('input');
    } finally {
      if (loadingInterval) clearInterval(loadingInterval);
    }
  };

  const handleReset = () => {
    setTopic('');
    setDescription('');
    setTweetCount(5);
    setCurrentStep('input');
    setGeneratedThread([]);
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

  const copyEntireThread = async () => {
    try {
      const threadText = generatedThread.join('\n\n');
      await navigator.clipboard.writeText(threadText);
      toast.success('Entire thread copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy thread');
    }
  };

  return (
    <ToolLayout>
      <ToolTitle 
        title="Twitter Thread Generator ✨" 
        description="Create engaging Twitter threads that captivate your audience"
      />
      <div className="mx-auto max-w-2xl w-full space-y-6">
        {currentStep === 'input' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <Card className="p-6 bg-background/60 backdrop-blur-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Thread Details
                </CardTitle>
                <CardDescription>
                  Provide information about your thread
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what you want to cover in your thread..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Tweets</label>
                  <Select 
                    value={tweetCount.toString()} 
                    onValueChange={(value) => setTweetCount(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of tweets" />
                    </SelectTrigger>
                    <SelectContent>
                      {tweetCountOptions.map((count) => (
                        <SelectItem key={count} value={count.toString()}>
                          {count} tweets
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!description || !tweetCount}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Thread
                </Button>

                {error && (
                  <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 'generating' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-primary animate-pulse" />
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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Thread</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyEntireThread}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {generatedThread.map((tweet, index) => (
                <Card 
                  key={index} 
                  className="relative p-4 cursor-pointer group"
                  onClick={() => copyToClipboard(tweet)}
                >
                  {index < generatedThread.length - 1 && (
                    <div className="absolute -bottom-4 left-7 z-10">
                      <ArrowDown className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <motion.div variants={cardHoverVariants}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{tweet}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
}