import { useState } from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Textarea } from "./textarea";
import { Input } from './input';
import { Loader2, ArrowRight, Sparkles, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { contentGeneratorService } from '../../lib/services/content-generator';

export type ContentType = 'youtube_script' | 'twitter_thread' | 'linkedin_post' | 'instagram_caption';

interface BaseContentTypeConfig {
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  requiresTitle: boolean;
}

interface YouTubeScriptConfig extends BaseContentTypeConfig {
  titleLabel: string;
  titlePlaceholder: string;
  lengthLabel: string;
  lengthOptions: string[];
}

interface TwitterThreadConfig extends BaseContentTypeConfig {
  tweetCountLabel: string;
  tweetCountPlaceholder: string;
  minTweets: number;
  maxTweets: number;
}

interface LinkedInPostConfig extends BaseContentTypeConfig {
  toneLabel: string;
  toneOptions: string[];
}

interface InstagramCaptionConfig extends BaseContentTypeConfig {
  styleLabel: string;
  styleOptions: string[];
  wordCountLabel: string;
  wordCountPlaceholder: string;
  minWords: number;
  maxWords: number;
}

type ContentTypeConfig = {
  youtube_script: YouTubeScriptConfig;
  twitter_thread: TwitterThreadConfig;
  linkedin_post: LinkedInPostConfig;
  instagram_caption: InstagramCaptionConfig;
}

interface ContentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: ContentType;
}

const contentTypeConfig: ContentTypeConfig = {
  youtube_script: {
    title: 'YouTube Script Generator',
    description: 'Generate engaging video scripts for your YouTube content',
    titleLabel: 'Video Title',
    titlePlaceholder: 'Enter your video title...',
    inputLabel: 'Video Description',
    inputPlaceholder: 'Describe what your video will be about, key points to cover, target audience, tone, etc...',
    requiresTitle: true,
    lengthLabel: 'Video Length',
    lengthOptions: ['3-5 minutes', '5-10 minutes', '10-15 minutes', '15-20 minutes', '20+ minutes'],
  },
  twitter_thread: {
    title: 'Twitter Thread Generator',
    description: 'Generate viral Twitter threads that engage your audience',
    inputLabel: 'Thread Topic',
    inputPlaceholder: 'Describe the topic and key points you want to cover in your thread...',
    requiresTitle: false,
    tweetCountLabel: 'Number of Tweets',
    tweetCountPlaceholder: 'Enter number of tweets (5-20)',
    minTweets: 5,
    maxTweets: 20,
  },
  linkedin_post: {
    title: 'LinkedIn Post Generator',
    description: 'Generate professional LinkedIn posts that build your personal brand',
    inputLabel: 'Post Topic',
    inputPlaceholder: 'Describe what you want to share with your professional network...',
    requiresTitle: false,
    toneLabel: 'Post Tone',
    toneOptions: ['Professional', 'Conversational', 'Inspirational', 'Educational', 'Story-telling'],
  },
  instagram_caption: {
    title: 'Instagram Caption Generator',
    description: 'Generate engaging captions for your Instagram posts',
    inputLabel: 'Post Description',
    inputPlaceholder: 'Describe your image/video and what message you want to convey...',
    requiresTitle: false,
    styleLabel: 'Caption Style',
    styleOptions: ['Casual', 'Professional', 'Funny', 'Motivational', 'Storytelling'],
    wordCountLabel: 'Caption Length',
    wordCountPlaceholder: 'Enter desired word count (20-200)',
    minWords: 20,
    maxWords: 200,
  },
};

const loadingMessages = [
  "Analyzing your input...",
  "Crafting engaging content...",
  "Adding personality...",
  "Optimizing for engagement...",
  "Finalizing your content..."
];

function isYouTubeScriptConfig(config: BaseContentTypeConfig): config is YouTubeScriptConfig {
  return 'lengthLabel' in config;
}

function isTwitterThreadConfig(config: BaseContentTypeConfig): config is TwitterThreadConfig {
  return 'tweetCountLabel' in config;
}

function isLinkedInPostConfig(config: BaseContentTypeConfig): config is LinkedInPostConfig {
  return 'toneOptions' in config;
}

function isInstagramCaptionConfig(config: BaseContentTypeConfig): config is InstagramCaptionConfig {
  return 'styleOptions' in config;
}

function formatYouTubeScript(content: string): string {
  // Add custom formatting for YouTube script
  return content
    .split('\n')
    .map(line => {
      // Format timestamps
      if (line.match(/^\d{1,2}:\d{2}/)) {
        return `\n⏱️ ${line}`;
      }
      // Format action notes
      if (line.match(/\[.*?\]/)) {
        return line.replace(/\[(.*?)\]/g, '🎬 [$1]');
      }
      // Format section headers
      if (line.match(/^(Introduction|Hook|Main Content|Section \d|Conclusion)/i)) {
        return `\n📌 ${line.toUpperCase()}\n`;
      }
      return line;
    })
    .join('\n');
}

export function ContentGeneratorModal({ isOpen, onClose, contentType }: ContentGeneratorModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoLength, setVideoLength] = useState('5-10 minutes');
  const [tweetCount, setTweetCount] = useState('5');
  const [postTone, setPostTone] = useState('Professional');
  const [captionStyle, setCaptionStyle] = useState('Casual');
  const [wordCount, setWordCount] = useState('50');
  const [currentStep, setCurrentStep] = useState<'input' | 'generating' | 'results'>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const config = contentTypeConfig[contentType];

  const handleGenerate = async () => {
    if (!description || (config.requiresTitle && !title)) return;
    
    // Validate platform-specific inputs
    if (isTwitterThreadConfig(config)) {
      const count = parseInt(tweetCount);
      if (isNaN(count) || count < config.minTweets || count > config.maxTweets) {
        setError(`Please enter a valid number of tweets between ${config.minTweets} and ${config.maxTweets}`);
        return;
      }
    }

    if (isInstagramCaptionConfig(config)) {
      const count = parseInt(wordCount);
      if (isNaN(count) || count < config.minWords || count > config.maxWords) {
        setError(`Please enter a valid word count between ${config.minWords} and ${config.maxWords}`);
        return;
      }
    }
    
    setCurrentStep('generating');
    setLoadingProgress(0);
    setLoadingMessageIndex(0);
    setError(null);

    // Progress simulation
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
      let content = '';

      switch (contentType) {
        case 'youtube_script':
          content = await contentGeneratorService.generateYouTubeScript(
            title,
            description,
            videoLength
          );
          break;

        case 'twitter_thread':
          content = await contentGeneratorService.generateTwitterThread(
            description,
            parseInt(tweetCount)
          );
          break;

        case 'linkedin_post':
          content = await contentGeneratorService.generateLinkedInPost(
            description,
            postTone
          );
          break;

        case 'instagram_caption':
          content = await contentGeneratorService.generateInstagramCaption(
            description,
            captionStyle,
            parseInt(wordCount)
          );
          break;
      }

      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedContent(content);
      setCurrentStep('results');
      toast.success('Content generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep('input');
    } finally {
      if (loadingInterval) clearInterval(loadingInterval);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCurrentStep('input');
    setGeneratedContent('');
    setError(null);
    onClose();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const renderContent = () => {
    if (contentType === 'youtube_script') {
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none font-mono">
          <pre className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
            {formatYouTubeScript(generatedContent)}
          </pre>
        </div>
      );
    }

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap">{generatedContent}</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="space-y-2 text-left sm:text-center mb-4">
          <DialogTitle className="text-xl md:text-2xl">{config.title}</DialogTitle>
          <DialogDescription className="text-sm md:text-base">{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep === 'input' && (
            <div className="space-y-4">
              {isYouTubeScriptConfig(config) && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      {config.titleLabel}
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                      placeholder={config.titlePlaceholder}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="videoLength" className="text-sm font-medium">
                      {config.lengthLabel}
                    </label>
                    <select
                      id="videoLength"
                      value={videoLength}
                      onChange={(e) => setVideoLength(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {config.lengthOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Description field - shown for all content types */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                  {config.inputLabel}
                  {isYouTubeScriptConfig(config) && (
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  )}
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder={config.inputPlaceholder}
                  className="min-h-[150px] w-full"
                />
              </div>

              {isTwitterThreadConfig(config) && (
                <div className="space-y-2">
                  <label htmlFor="tweetCount" className="text-sm font-medium">
                    {config.tweetCountLabel}
                  </label>
                  <Input
                    id="tweetCount"
                    type="number"
                    value={tweetCount}
                    onChange={(e) => setTweetCount(e.target.value)}
                    placeholder={config.tweetCountPlaceholder}
                    min={config.minTweets}
                    max={config.maxTweets}
                    className="w-full"
                  />
                </div>
              )}

              {isLinkedInPostConfig(config) && (
                <div className="space-y-2">
                  <label htmlFor="postTone" className="text-sm font-medium">
                    {config.toneLabel}
                  </label>
                  <select
                    id="postTone"
                    value={postTone}
                    onChange={(e) => setPostTone(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {config.toneOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {isInstagramCaptionConfig(config) && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="captionStyle" className="text-sm font-medium">
                      {config.styleLabel}
                    </label>
                    <select
                      id="captionStyle"
                      value={captionStyle}
                      onChange={(e) => setCaptionStyle(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {config.styleOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="wordCount" className="text-sm font-medium">
                      {config.wordCountLabel}
                    </label>
                    <Input
                      id="wordCount"
                      type="number"
                      value={wordCount}
                      onChange={(e) => setWordCount(e.target.value)}
                      placeholder={config.wordCountPlaceholder}
                      min={config.minWords}
                      max={config.maxWords}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
            </div>
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
            <div className="space-y-4">
              <div className="flex justify-end gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generatedContent)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([generatedContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${contentType}-${new Date().toISOString()}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    toast.success('Content downloaded successfully!');
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Download
                </Button>
              </div>

              <div className="rounded-lg border bg-card hover:shadow-lg transition-shadow">
                <div className="p-4">
                  {renderContent()}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4 md:mt-6">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            {currentStep === 'results' ? 'Done' : 'Cancel'}
          </Button>
          {currentStep === 'input' && (
            <Button 
              onClick={handleGenerate} 
              disabled={!description || (config.requiresTitle && !title)}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              Generate Content
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 