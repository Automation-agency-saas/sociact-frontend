import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Loader2, RefreshCw, MessageSquare, Clock, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { HistorySection } from '../../../components/shared/HistorySection';
import { containerVariants, itemVariants, cardHoverVariants } from '../../../lib/animations';
import { ToolLayout } from "../../../components/tool-page/ToolLayout";
import { ToolTitle } from '@/components/ui/tool-title';
import { contentGeneratorService } from "../../../lib/services/content-generator";
import { activityTracker } from '@/lib/services/activity-tracker';
import { cn } from '@/lib/utils';

type Step = 'input' | 'generating' | 'results';

const loadingMessages = [
  "Analyzing your video topic...",
  "Crafting engaging script...",
  "Structuring content...",
  "Adding hooks and transitions...",
  "Finalizing your script..."
];

interface ScriptHistoryItem {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  script: string;
}

export function YouTubeScriptGeneratorPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [script, setScript] = useState('');
  const [history, setHistory] = useState<ScriptHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateScript = async () => {
    if (!title || !description) {
      toast.error('Please fill in all fields');
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
      const generatedScript = await contentGeneratorService.generateYouTubeScript(title, description, '00:10:00');
      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setScript(generatedScript);
      const historyItem: ScriptHistoryItem = {
        id: uuidv4(),
        timestamp: new Date(),
        title,
        description,
        script: generatedScript
      };
      setHistory(prev => [historyItem, ...prev]);
      setCurrentStep('results');
      toast.success('Script generated successfully!');
      activityTracker.trackActivity({
        type: 'script',
        details: {
          title: title,
          description: description
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate script';
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep('input');
    } finally {
      if (loadingInterval) clearInterval(loadingInterval);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCurrentStep('input');
    setScript('');
    setError(null);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success('History item deleted');
  };

  const renderScript = (script: string) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 whitespace-pre-wrap font-mono text-sm">
            {script.split('\n').map((line, index) => (
              <div 
                key={index} 
                className={cn(
                  "py-1",
                  // Headers and Timestamps
                  line.match(/^\d{1,2}:\d{2}/) && "text-lg font-semibold text-primary mt-6",
                  line.match(/^(Introduction|Conclusion|Main Content)/i) && "text-lg font-semibold text-primary/90 mt-6",
                  // Action Notes
                  line.match(/^\[.*\]$/) && "text-muted-foreground italic",
                  // Emphasis
                  line.includes('CAPS') && "font-semibold text-primary",
                  // Transitions
                  line.match(/^Transition:/) && "text-primary/70 italic mt-4 mb-2",
                  // Dramatic Pauses
                  line.includes('...') && "text-muted-foreground",
                  // Call to Action
                  line.match(/^Call to Action:/i) && "text-primary font-medium mt-4"
                )}
              >
                {/* Add timestamp badge if line starts with timestamp */}
                {line.match(/^\d{1,2}:\d{2}/) ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm">
                      {line.match(/^\d{1,2}:\d{2}/)?.[0]}
                    </span>
                    <span>{line.replace(/^\d{1,2}:\d{2}/, '').trim()}</span>
                  </div>
                ) : (
                  // Render action notes with special styling
                  line.match(/^\[.*\]$/) ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      {line}
                    </div>
                  ) : (
                    line
                  )
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(script)}
              title="Copy Full Script"
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <ToolLayout>
      <ToolTitle 
        title="YouTube Script Generator" 
        description="Generate professional video scripts based on your title and description"
      />
      <div className="mx-auto max-w-6xl pb-20 w-full space-y-6">
        {currentStep === 'input' && (
          <Card className="p-6 bg-background/60 backdrop-blur-lg">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                Script Details
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Provide information about your video
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Title</label>
                <Input
                  placeholder="e.g. How to Build a Website in 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Video Description</label>
                <Textarea
                  placeholder="Describe what your video will be about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={generateScript}
                disabled={!title || !description}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Script
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
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Generated Script</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any section to copy it to clipboard
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(script)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Full Script
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

            {/* Script sections */}
            <div className="grid gap-4">
              {renderScript(script)}
            </div>

            {/* Quick Actions */}
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Action Notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Timestamps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Emphasis</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-muted-foreground"
                >
                  Print Script
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* <HistorySection<ScriptHistoryItem>
          title="Generated Scripts History"
          items={history}
          onDelete={deleteHistoryItem}
          renderPreview={(item) => (
            <div className="space-y-2">
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </div>
              <div className="text-xs text-muted-foreground">
                Click to view full script
              </div>
            </div>
          )}
        /> */}
      </div>
    </ToolLayout>
  );
}