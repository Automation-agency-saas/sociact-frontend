import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Wand2, Loader2, Download, Image as ImageIcon, Palette, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { thumbnailGenService } from '../../../lib/services/thumbnail-gen';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { cn } from '../../../lib/utils';
import { HistorySection } from "../../../components/shared/HistorySection";
import { containerVariants, itemVariants, cardHoverVariants, ThumbnailHistoryItem } from "../../../lib/animations";
import { v4 as uuidv4 } from "uuid";

type ThumbnailStyle = 'modern' | 'classic' | 'vibrant' | 'minimal' | 'dramatic';
type Step = 'input' | 'generating' | 'results';

const STYLE_OPTIONS: { value: ThumbnailStyle; label: string; description: string }[] = [
  {
    value: 'modern',
    label: 'Modern',
    description: 'Clean, sleek, and contemporary design'
  },
  {
    value: 'classic',
    label: 'Classic',
    description: 'Timeless and elegant appearance'
  },
  {
    value: 'vibrant',
    label: 'Vibrant',
    description: 'Bold colors and dynamic elements'
  },
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Simple and uncluttered layout'
  },
  {
    value: 'dramatic',
    label: 'Dramatic',
    description: 'High contrast and cinematic feel'
  }
];

const loadingMessages = [
  "Analyzing your descriptions...",
  "Generating background elements...",
  "Adding text and typography...",
  "Applying visual effects...",
  "Finalizing your thumbnail..."
];

export function ThumbnailGenPage() {
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [textPrompt, setTextPrompt] = useState('');
  const [style, setStyle] = useState<ThumbnailStyle>('modern');
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ThumbnailHistoryItem[]>([]);

  const handleGenerate = async () => {
    if (!backgroundPrompt || !textPrompt) {
      toast.error('Please provide both background and text descriptions');
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
      const result = await thumbnailGenService.generateThumbnail({
        backgroundPrompt,
        textPrompt,
        style
      });

      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.status === 'success' && result.url) {
        setGeneratedUrl(result.url);
        setCurrentStep('results');
        toast.success('Thumbnail generated successfully!');
        const historyItem: ThumbnailHistoryItem = {
          id: uuidv4(),
          timestamp: new Date(),
          prompt: `${backgroundPrompt} - ${textPrompt}`,
          imageUrl: result.url,
          style
        };
        setHistory(prev => [historyItem, ...prev]);
      } else {
        throw new Error(result.message || 'Failed to generate thumbnail');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate thumbnail';
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep('input');
    } finally {
      if (loadingInterval) clearInterval(loadingInterval);
    }
  };

  const handleDownload = async () => {
    if (!generatedUrl) return;

    try {
      const response = await fetch(generatedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'thumbnail.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Thumbnail downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download thumbnail');
    }
  };

  const handleReset = () => {
    setBackgroundPrompt('');
    setTextPrompt('');
    setStyle('modern');
    setGeneratedUrl(null);
    setCurrentStep('input');
    setError(null);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success("History item deleted");
  };

  return (
    <ToolPageWrapper
      title="ThumbnailGen"
      description="Create stunning YouTube thumbnails from your descriptions"
    >
      <div className="space-y-6">
        {currentStep === 'input' && (
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Content Input Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Thumbnail Content
                  </CardTitle>
                  <CardDescription>
                    Describe your desired thumbnail elements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Background Description</label>
                    <Textarea
                      placeholder="Describe the background scene or image (e.g., 'A serene mountain landscape at sunset with dramatic clouds')"
                      value={backgroundPrompt}
                      onChange={(e) => setBackgroundPrompt(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Text Content</label>
                    <Textarea
                      placeholder="What text should appear on the thumbnail? (e.g., 'TOP 10 SECRETS')"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Style Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Style Settings
                  </CardTitle>
                  <CardDescription>
                    Choose the visual style for your thumbnail
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Visual Style</label>
                    <Select value={style} onValueChange={(value) => setStyle(value as ThumbnailStyle)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                      <SelectContent>
                        {STYLE_OPTIONS.map((option) => (
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

                  <div className="pt-4">
                    <Button
                      onClick={handleGenerate}
                      disabled={!backgroundPrompt || !textPrompt}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Thumbnail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {currentStep === 'generating' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-primary animate-pulse" />
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

        {currentStep === 'results' && generatedUrl && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Thumbnail</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate New
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="relative w-full bg-black rounded-lg border overflow-hidden">
                  <div className="aspect-[16/9] relative">
                    <img
                      src={generatedUrl}
                      alt="Generated thumbnail"
                      className={cn(
                        "absolute inset-0 w-full h-full",
                        "object-contain object-center"
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Style Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Generation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Background Description</h4>
                    <p className="text-sm text-muted-foreground">{backgroundPrompt}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Text Content</h4>
                    <p className="text-sm text-muted-foreground">{textPrompt}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Applied Style</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {STYLE_OPTIONS.find(opt => opt.value === style)?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <HistorySection<ThumbnailHistoryItem>
        title="Generated Thumbnails History"
        items={history}
        onDelete={deleteHistoryItem}
        renderPreview={(item) => (
          <div className="space-y-2">
            <img
              src={item.imageUrl}
              alt={item.prompt}
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="text-sm text-muted-foreground line-clamp-2">
              {item.prompt}
            </div>
            <div className="text-xs text-muted-foreground">
              Style: {STYLE_OPTIONS.find(s => s.value === item.style)?.description}
            </div>
          </div>
        )}
      />
    </ToolPageWrapper>
  );
} 