import { useState } from 'react';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
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

type Step = 'input' | 'generating' | 'results';

const loadingMessages = [
  "Analyzing your topic...",
  "Structuring the thread...",
  "Adding engaging hooks...",
  "Optimizing for readability...",
  "Finalizing your thread..."
];

const threadLengths = [
  { value: '3-5', label: '3-5 tweets', description: 'Quick, focused threads' },
  { value: '5-7', label: '5-7 tweets', description: 'Standard thread length' },
  { value: '7-10', label: '7-10 tweets', description: 'Detailed explanations' },
  { value: '10+', label: '10+ tweets', description: 'Comprehensive coverage' },
];

export function TwitterThreadGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [threadLength, setThreadLength] = useState('5-7');
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedThread, setGeneratedThread] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic || !description) {
      toast.error('Please provide both topic and description');
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
      const thread = [
        "🧵 Let me break down everything you need to know about this topic in this thread...",
        "1/ First, let's understand the basics. This is fundamental to grasping the bigger picture...",
        "2/ Here's what most people get wrong about this topic...",
        "3/ The key insight that changed everything for me was...",
        "4/ Here are 3 practical tips you can implement right now:",
        "5/ The most important thing to remember is...",
        "6/ Here's what to do next and how to get started...",
        "If you found this thread helpful:\n- Follow me for more insights\n- RT to share with others\n- Bookmark for future reference"
      ];

      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedThread(thread);
      setCurrentStep('results');
      toast.success('Thread generated successfully!');
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
    setThreadLength('5-7');
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
    <ToolPageWrapper
      title="Twitter Thread Generator"
      description="Create engaging Twitter threads that captivate your audience"
    >
      <div className="space-y-6">
        {currentStep === 'input' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Thread Details
                </CardTitle>
                <CardDescription>
                  Provide information about your thread
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    placeholder="Enter the main topic of your thread..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

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
                  <label className="text-sm font-medium">Thread Length</label>
                  <Select value={threadLength} onValueChange={setThreadLength}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select thread length" />
                    </SelectTrigger>
                    <SelectContent>
                      {threadLengths.map((length) => (
                        <SelectItem key={length.value} value={length.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{length.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {length.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!topic || !description}
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
          </div>
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
          <div className="space-y-6">
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
                <Card key={index} className="relative">
                  {index < generatedThread.length - 1 && (
                    <div className="absolute -bottom-4 left-7 z-10">
                      <ArrowDown className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1"
                        onClick={() => copyToClipboard(tweet)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <div>
                        <p className="text-sm whitespace-pre-wrap">{tweet}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
} 