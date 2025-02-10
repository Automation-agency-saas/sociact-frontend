import { useState } from 'react';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Wand2, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

type Step = 'input' | 'generating' | 'results';

const loadingMessages = [
  "Analyzing Twitter trends...",
  "Identifying viral potential...",
  "Crafting engaging tweets...",
  "Optimizing for engagement...",
  "Finalizing your tweet ideas..."
];

export function TwitterIdeaGeneratorPage() {
  const [niche, setNiche] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        "Share a quick tip about your expertise 💡",
        "Start a poll about a trending topic in your niche 📊",
        "Share an interesting statistic with your take on it 📈",
        "Ask an engaging question to start a conversation 🤔",
        "Share a success story in a thread format 🧵",
        "Post a hot take on a industry trend 🔥",
        "Share a behind-the-scenes moment 📱",
        "Create a 'did you know' fact tweet ⭐",
        "Share a valuable resource or tool 🛠️",
        "Start a 'tip of the day' series 📝"
      ];

      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedIdeas(ideas);
      setCurrentStep('results');
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

  return (
    <ToolPageWrapper
      title="Twitter Content Idea Generator"
      description="Generate engaging tweet ideas that resonate with your audience"
    >
      <div className="space-y-6">
        {currentStep === 'input' && (
          <Card>
            <CardHeader>
              <CardTitle>Generate Tweet Ideas</CardTitle>
              <CardDescription>
                Enter your niche or topic to get personalized tweet ideas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Niche/Topic</label>
                <Textarea
                  placeholder="Enter your niche or topic (e.g., tech, finance, marketing)..."
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!niche}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Ideas
              </Button>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 'generating' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
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
              <h3 className="text-lg font-semibold">Generated Ideas</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Generate New Ideas
              </Button>
            </div>

            <div className="grid gap-4">
              {generatedIdeas.map((idea, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm">{idea}</p>
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