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

type Step = 'input' | 'generating' | 'results';
type PostType = 'thought-leadership' | 'case-study' | 'industry-insights' | 'personal-story' | 'tips-tricks';

const loadingMessages = [
  "Analyzing your topic...",
  "Crafting professional content...",
  "Adding engagement hooks...",
  "Optimizing for LinkedIn...",
  "Finalizing your post..."
];

const postTypes = [
  { value: 'thought-leadership', label: 'Thought Leadership', description: 'Share industry expertise and insights' },
  { value: 'case-study', label: 'Case Study', description: 'Share success stories and results' },
  { value: 'industry-insights', label: 'Industry Insights', description: 'Analysis of trends and developments' },
  { value: 'personal-story', label: 'Personal Story', description: 'Share professional journey and experiences' },
  { value: 'tips-tricks', label: 'Tips & Tricks', description: 'Practical advice and actionable insights' },
];

export function LinkedInPostGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [postType, setPostType] = useState<PostType>('thought-leadership');
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedPost, setGeneratedPost] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
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
      const post = "🎯 Exciting breakthrough in our latest project!\n\nOver the past quarter, our team has been working tirelessly on revolutionizing how we approach customer engagement. Today, I'm thrilled to share our results:\n\n✨ 47% increase in customer satisfaction\n📈 2.5x improvement in response time\n🎉 98% positive feedback from beta users\n\nKey learnings:\n\n1. Always start with user research\n2. Iterate based on feedback\n3. Measure everything\n\nBut here's what really made the difference: our team's dedication to putting customers first.\n\nWhat strategies have worked for you in improving customer engagement?\n\nLet's discuss in the comments! 👇\n\n#CustomerSuccess #Innovation #Leadership";
      
      const hashtags = [
        "#Innovation",
        "#Leadership",
        "#ProfessionalDevelopment",
        "#BusinessGrowth",
        "#CustomerSuccess",
        "#CareerGrowth",
        "#BusinessStrategy",
        "#NetworkingTips",
        "#IndustryInsights",
        "#ProfessionalTips"
      ];

      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedPost(post);
      setGeneratedHashtags(hashtags);
      setCurrentStep('results');
      toast.success('Post generated successfully!');
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
    setTopic('');
    setDescription('');
    setPostType('thought-leadership');
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
    <ToolPageWrapper
      title="LinkedIn Post Generator"
      description="Create engaging LinkedIn posts that drive professional engagement"
    >
      <div className="space-y-6">
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
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    placeholder="Enter the main topic of your post..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what you want to convey in your post..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Post Type</label>
                  <Select value={postType} onValueChange={(value) => setPostType(value as PostType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      {postTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{type.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {type.description}
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
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-primary" />
                  Suggested Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {generatedHashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium cursor-pointer hover:bg-primary/20"
                      onClick={() => copyToClipboard(hashtag)}
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
} 