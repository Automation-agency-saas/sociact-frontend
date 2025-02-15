import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { MessageCircle, Copy, Trash2, Settings2, History, Sparkles, Link, Clock, Twitter, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { ToolLayout } from "@/components/tool-page/ToolLayout";
import { ToolTitle } from "@/components/ui/tool-title";
import { LoadingModal } from "@/components/ui/loading-modal";
import { cn } from "@/lib/utils";
import { twitterService } from '@/lib/services/twitter.service';

// Constants for dropdown options
const RESPONSE_TONES = [
  { value: 'friendly', label: '😊 Friendly' },
  { value: 'professional', label: '👔 Professional' },
  { value: 'casual', label: '🤙 Casual' },
  { value: 'witty', label: '😏 Witty' },
  { value: 'supportive', label: '🤝 Supportive' },
  { value: 'engaging', label: '🎯 Engaging' }
];

const RESPONSE_LENGTHS = [
  { value: 'brief', label: '⚡ Brief (under 50 chars)' },
  { value: 'short', label: '📝 Short (50-100 chars)' },
  { value: 'medium', label: '📄 Medium (100-200 chars)' },
  { value: 'long', label: '📜 Long (200-280 chars)' }
];

const ENGAGEMENT_STRATEGIES = [
  { value: 'question', label: '❓ Ask Questions' },
  { value: 'value_add', label: '💡 Add Value' },
  { value: 'appreciation', label: '🙏 Show Appreciation' },
  { value: 'discussion', label: '💬 Encourage Discussion' }
];

interface AutoResponse {
  id: string;
  text: string;
  timestamp: Date;
  type?: 'success' | 'info' | 'error';
  tweetText?: string;
  userName?: string;
  generatedReply?: string;
}

interface AutomationStats {
  totalTweets: number;
  successfulReplies: number;
  failedReplies: number;
  remainingTweets: number;
}

interface ResponseGeneration {
  mode: 'instant';
  tweetUrl: string;
  responseTone: string;
  responseLength: string;
  engagementStrategy: string;
  customPrompt: string;
  responses: AutoResponse[];
  includeHashtags: boolean;
  stats?: AutomationStats;
}

interface AutomationLog {
  id: string;
  created_at: string;
  completed_at?: string;
  status: string;
  stats: {
    tweets_processed: number;
    successful_responses: number;
    failed_responses: number;
  };
  tweet_url?: string;
  settings: {
    tone: string;
    style: string;
    strategy: string;
  };
}

export function TwitterCommentAutomationPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [responseGeneration, setResponseGeneration] = useState<ResponseGeneration>({
    mode: 'instant',
    tweetUrl: '',
    responseTone: 'professional',
    responseLength: 'medium',
    engagementStrategy: 'value_add',
    customPrompt: '',
    responses: [],
    includeHashtags: true
  });
  const [automationLogs, setAutomationLogs] = useState<AutoResponse[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);

  // Check Twitter auth status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const { isAuthenticated } = await twitterService.checkAuthStatus();
      setIsAuthenticated(isAuthenticated);
      
      if (isAuthenticated) {
        fetchLogs();
      }
    } catch (error) {
      console.error('Failed to check Twitter auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectTwitter = async () => {
    try {
      setIsAuthenticating(true);
      // Save current state for after auth
      localStorage.setItem('twitter_auth_return_state', JSON.stringify({
        route: '/twitter/comment-automation',
        automation: responseGeneration
      }));
      
      const url = await twitterService.getAuthUrl();
      window.location.href = url;
    } catch (error: any) {
      console.error('Failed to initiate Twitter auth:', error);
      toast.error(error.message || 'Failed to connect Twitter account');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const data = await twitterService.getAutomationLogs();
      setLogs(data.logs);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch automation logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAutomation = async () => {
    if (!responseGeneration.tweetUrl) {
      toast.error('Please provide a tweet URL');
      return;
    }

    try {
      setIsLoading(true);
      setIsRunning(true);
      simulateLoading();

      const data = await twitterService.startAutomation({
        tweet_url: responseGeneration.tweetUrl,
        tone: responseGeneration.responseTone,
        length: responseGeneration.responseLength,
        strategy: responseGeneration.engagementStrategy,
        include_hashtags: responseGeneration.includeHashtags,
        custom_prompt: responseGeneration.customPrompt
      });

      if (data.success) {
        const newResponse: AutoResponse = {
          id: Date.now().toString(),
          text: 'Started automated tweet replies! 🚀',
          timestamp: new Date(),
          type: 'info'
        };

        setResponseGeneration(prev => ({
          ...prev,
          responses: [newResponse, ...prev.responses],
          stats: {
            totalTweets: data.stats.tweets_processed,
            successfulReplies: data.stats.successful_responses,
            failedReplies: data.stats.failed_responses,
            remainingTweets: data.stats.tweets_processed - (data.stats.successful_responses + data.stats.failed_responses)
          }
        }));

        toast.success('Automation started successfully!');
        fetchLogs();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start automation');
      setIsRunning(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopAutomation = async () => {
    try {
      await twitterService.stopAutomation();
      setIsRunning(false);
      toast.success('Automation stopped');
    } catch (error: any) {
      toast.error(error.message || 'Failed to stop automation');
    }
  };

  const simulateLoading = () => {
    const messages = [
      'Analyzing tweet patterns...',
      'Crafting engaging replies...',
      'Optimizing for Twitter style...',
      'Adding relevant hashtags...',
      'Finalizing response generation...'
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setGenerationProgress(progress);
      setLoadingMessage(messages[progress/25 - 1]);
      
      if (progress === 100) {
        clearInterval(interval);
      }
    }, 750);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'running':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  if (isAuthenticating) {
    return (
      <ToolLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-96 bg-white rounded-lg shadow-xl p-8">
            <div className="flex flex-col items-center space-y-4">
              <Twitter className="w-16 h-16 text-blue-400" />
              <h2 className="text-2xl font-bold">Twitter</h2>
              <p className="text-center text-gray-600">
                Connecting to Twitter...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                />
              </div>
            </div>
          </div>
        </div>
      </ToolLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <ToolLayout>
        <ToolTitle 
          title="Twitter Comment Automation 🐦" 
          description="Automate responses to tweets and engage with your audience"
        />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Connect Your Twitter Account</CardTitle>
            <CardDescription>
              To use the comment automation features, please connect your Twitter account first.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Twitter className="w-16 h-16 text-blue-400 mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              Connect your Twitter account to enable automatic reply generation and engagement features.
            </p>
            <Button 
              onClick={handleConnectTwitter} 
              disabled={isLoading}
              className="bg-blue-400 hover:bg-blue-500"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </div>
              ) : (
                <>Connect Twitter Account</>
              )}
            </Button>
          </CardContent>
        </Card>
      </ToolLayout>
    );
  }

  if ((isGenerating || isRunning) && responseGeneration.stats) {
    return (
      <ToolLayout>
        <ToolTitle 
          title="Automation in Progress 🤖" 
          description="Processing tweet replies..."
        />
        
        <div className="space-y-8">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Tweets</p>
                  <p className="text-2xl font-bold">{responseGeneration.stats.totalTweets}</p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Successful</p>
                  <p className="text-2xl font-bold text-green-500">{responseGeneration.stats.successfulReplies}</p>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-500">{responseGeneration.stats.failedReplies}</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-blue-500">{responseGeneration.stats.remainingTweets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round((responseGeneration.stats.successfulReplies + responseGeneration.stats.failedReplies) / responseGeneration.stats.totalTweets * 100)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(responseGeneration.stats.successfulReplies + responseGeneration.stats.failedReplies) / responseGeneration.stats.totalTweets * 100}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-4">
              {automationLogs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    log.type === 'success' && "border-green-500/20 bg-green-500/10",
                    log.type === 'error' && "border-red-500/20 bg-red-500/10",
                    log.type === 'info' && "border-blue-500/20 bg-blue-500/10"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{log.text}</p>
                      {log.userName && log.tweetText && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          <p>User: @{log.userName}</p>
                          <p>Tweet: {log.tweetText}</p>
                          {log.generatedReply && (
                            <p className="text-primary mt-1">Reply: {log.generatedReply}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            onClick={stopAutomation}
            variant="destructive"
            className="w-full"
          >
            Stop Processing
          </Button>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout>
      <div className="container mx-auto py-8">
        <ToolTitle
          title="Twitter Comment Automation"
          description="Automatically respond to tweets and engage with your audience"
        />

        <div className="mt-8 space-y-8">
          {/* Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure how you want to handle tweet replies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tweet Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Tweet URL</label>
                </div>
                <Input
                  placeholder="Enter Tweet URL (e.g., https://x.com/username/status/123456789)"
                  value={responseGeneration.tweetUrl}
                  onChange={(e) => 
                    setResponseGeneration(prev => ({...prev, tweetUrl: e.target.value}))
                  }
                />
              </div>

              {/* Response Tone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Tone</label>
                <Select
                  value={responseGeneration.responseTone}
                  onValueChange={(value) => 
                    setResponseGeneration(prev => ({...prev, responseTone: value}))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSE_TONES.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Response Length */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Length</label>
                <Select
                  value={responseGeneration.responseLength}
                  onValueChange={(value) => 
                    setResponseGeneration(prev => ({...prev, responseLength: value}))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSE_LENGTHS.map((length) => (
                      <SelectItem key={length.value} value={length.value}>
                        {length.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Engagement Strategy */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Engagement Strategy</label>
                <Select
                  value={responseGeneration.engagementStrategy}
                  onValueChange={(value) => 
                    setResponseGeneration(prev => ({...prev, engagementStrategy: value}))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGAGEMENT_STRATEGIES.map((strategy) => (
                      <SelectItem key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Prompt */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Instructions (Optional)</label>
                <Textarea
                  placeholder="Add any specific instructions for response generation..."
                  value={responseGeneration.customPrompt}
                  onChange={(e) => 
                    setResponseGeneration(prev => ({...prev, customPrompt: e.target.value}))
                  }
                />
              </div>

              {/* Hashtag Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Include Hashtags</p>
                  <p className="text-sm text-muted-foreground">Add relevant hashtags to responses</p>
                </div>
                <Switch
                  checked={responseGeneration.includeHashtags}
                  onCheckedChange={(checked) => 
                    setResponseGeneration(prev => ({...prev, includeHashtags: checked}))
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStartAutomation}
                disabled={isLoading}
                className="w-full bg-blue-400 hover:bg-blue-500"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Starting...
                  </div>
                ) : (
                  <>
                    <Twitter className="mr-2 h-5 w-5" />
                    Start Automation
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* History Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Automation History
                  </CardTitle>
                  <CardDescription>
                    View your past Twitter reply automation sessions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : logs.length > 0 ? (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <Card key={log.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <p className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Started: {formatDate(log.created_at)}
                          </p>
                          {log.completed_at && (
                            <p className="text-sm text-muted-foreground">
                              Completed: {formatDate(log.completed_at)}
                            </p>
                          )}
                          {log.tweet_url && (
                            <a
                              href={log.tweet_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-400 hover:underline"
                            >
                              View Tweet
                            </a>
                          )}
                          <div className="mt-2">
                            <p className="text-sm">
                              Tone: {log.settings.tone}, Style: {log.settings.style}, Strategy: {log.settings.strategy}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold">{log.stats.tweets_processed}</p>
                            <p className="text-xs text-muted-foreground">Total Tweets</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-500">
                              {log.stats.successful_responses}
                            </p>
                            <p className="text-xs text-muted-foreground">Successful</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-red-500">
                              {log.stats.failed_responses}
                            </p>
                            <p className="text-xs text-muted-foreground">Failed</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No automation history found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
} 