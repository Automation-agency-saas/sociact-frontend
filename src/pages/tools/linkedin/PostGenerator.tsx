import { useState } from 'react';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Wand2, Copy, RefreshCw, MessageSquare, Hash } from 'lucide-react';
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
import {contentGeneratorService} from "../../../lib/services/content-generator"
import { ToolLayout } from '../../../components/tool-page/ToolLayout';
import { ToolTitle } from '@/components/ui/tool-title';

type Step = 'input' | 'generating' | 'results';
type ToneType = 'professional' | 'conversational' | 'inspirational' | 'informative' | 'persuasive';

const loadingMessages = [
  "Analyzing your content...",
  "Crafting your message...",
  "Adding engagement hooks...",
  "Optimizing for LinkedIn...",
  "Finalizing your post..."
];

const toneOptions = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-oriented tone' },
  { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable style' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivational and uplifting content' },
  { value: 'informative', label: 'Informative', description: 'Educational and fact-based approach' },
  { value: 'persuasive', label: 'Persuasive', description: 'Convincing and compelling tone' },
];

export function LinkedInPostGeneratorPage() {
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedPost, setGeneratedPost] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description) {
      toast.error('Please provide a description for your post');
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
      const response = await contentGeneratorService.generateLinkedInPost(description, tone);
      
      if (response.status === 'success' && response.content) {
        setLoadingProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setGeneratedPost(response.content);
        
        // Extract hashtags from the content
        const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
        const extractedHashtags = response.content.match(hashtagRegex) || [];
        
        // If no hashtags found in content, use the ones from the content
        if (extractedHashtags.length === 0) {
          const defaultHashtags = [
            "#WebDesign",
            "#UserExperience",
            "#DigitalMarketing",
            "#CreativeDesign",
            "#ContentStrategy"
          ];
          setGeneratedHashtags(defaultHashtags);
        } else {
          setGeneratedHashtags(extractedHashtags);
        }
        
        setCurrentStep('results');
        toast.success('Post generated successfully!');
      } else {
        throw new Error(response.message || 'Failed to generate post');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate post';
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep('input');
    } finally {
      if (loadingInterval) clearInterval(loadingInterval);
    }
  };

  const handleReset = () => {
    setDescription('');
    setTone('professional');
    setCurrentStep('input');
    setGeneratedPost('');
    setGeneratedHashtags([]);
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

  return (
    <ToolLayout>
      <ToolTitle
        title="LinkedIn Post Generator"
        description="Create engaging LinkedIn posts that drive professional engagement"
      />
      <div className="mx-auto max-w-2xl w-full space-y-6">
        {currentStep === 'input' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Post Details
                </CardTitle>
                <CardDescription>
                  Provide information about your LinkedIn post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what you want to share in your post..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone of Voice</label>
                  <Select value={tone} onValueChange={(value: ToneType) => setTone(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!description}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Post
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
              <h3 className="text-lg font-semibold">Generated Post</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generatedPost)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Post
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

            <Card>
              <CardContent className="p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                    {generatedPost}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    Suggested Hashtags
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => copyToClipboard(generatedHashtags.join(' '))}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Hashtags
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {generatedHashtags.map((hashtag, index) => (
                    <div
                      key={index}
                      className="group relative inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20"
                    >
                      <span>{hashtag}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(hashtag)}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy hashtag</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}