import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { MessageCircle, Copy, Trash2, Settings2, History, Sparkles, Link, Clock, Instagram, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { Slider } from "../../../components/ui/slider";
import { ToolLayout } from "@/components/tool-page/ToolLayout";
import { ToolTitle } from "@/components/ui/tool-title";
import { LoadingModal } from "@/components/ui/loading-modal";
import { cn } from "@/lib/utils";
import { commentAutomationService } from "@/lib/services/comment-automation";
import { instagramService } from "@/lib/services/instagram.service";
import { useLocation } from 'react-router-dom';

// Constants for dropdown options
const RESPONSE_TONES = [
  'Friendly',
  'Professional',
  'Casual',
  'Enthusiastic',
  'Supportive',
  'Engaging'
];

const CHECK_INTERVALS = [
  { value: '5', label: 'Every 5 minutes' },
  { value: '15', label: 'Every 15 minutes' },
  { value: '30', label: 'Every 30 minutes' },
  { value: '60', label: 'Every hour' }
];

const RESPONSE_LENGTHS = [
  'Brief (1-2 words)',
  'Short (3-5 words)',
  'Medium (6-10 words)',
  'Long (10+ words)'
];

interface AutoResponse {
  id: string;
  text: string;
  timestamp: Date;
  type?: 'success' | 'info' | 'error';
  commentText?: string;
  userName?: string;
  generatedReply?: string;
}

interface AutomationStats {
  totalComments: number;
  successfulReplies: number;
  failedReplies: number;
  remainingComments: number;
}

interface ResponseGeneration {
  mode: 'instant';
  postUrl: string;
  useLatestPost: boolean;
  responseTone: string;
  responseLength: string;
  customPrompt: string;
  responses: AutoResponse[];
  includeEmojis: boolean;
  stats?: AutomationStats;
}

interface AutomationLog {
  id: string;
  created_at: string;
  completed_at?: string;
  status: string;
  stats: {
    comments_processed: number;
    successful_responses: number;
    failed_responses: number;
  };
  post_url?: string;
  settings: {
    tone: string;
    style: string;
  };
}

export function InstagramCommentAutomationPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [responseGeneration, setResponseGeneration] = useState<ResponseGeneration>({
    mode: 'instant',
    postUrl: '',
    useLatestPost: false,
    responseTone: 'Professional',
    responseLength: 'Medium (6-10 words)',
    customPrompt: '',
    responses: [],
    includeEmojis: true
  });
  const [automationLogs, setAutomationLogs] = useState<AutoResponse[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const location = useLocation();

  // Check Instagram auth status and handle auth return
  useEffect(() => {
    checkAuthStatus();
    handleAuthReturn();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await instagramService.checkAuthStatus();
      setIsAuthenticated(response.auth_status);
      
      if (response.auth_status) {
        fetchLogs();
      }
    } catch (error) {
      console.error('Failed to check Instagram auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthReturn = () => {
    const state = location.state as { instagramConnected?: boolean };
    if (state?.instagramConnected) {
      setIsAuthenticated(true);
      fetchLogs();
      // Clear the state after processing
      window.history.replaceState({}, document.title, location.pathname);
    }
  };

  const handleConnectInstagram = async () => {
    try {
      setIsAuthenticating(true);
      const authUrl = await instagramService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Failed to initiate Instagram auth:', error);
      toast.error(error.message || 'Failed to connect Instagram account');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const response = await commentAutomationService.getLogs();
      // Filter for Instagram logs only
      const instagramLogs = response.filter(log => log.platform === 'instagram');
      setLogs(instagramLogs);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch automation logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAutomation = async () => {
    if (!responseGeneration.postUrl && !responseGeneration.useLatestPost) {
      toast.error('Please provide a post URL or select latest post');
      return;
    }

    try {
      setIsLoading(true);
      setIsRunning(true);
      simulateLoading();

      const response = await commentAutomationService.startAutomation({
        platform: 'instagram',
        tone: responseGeneration.responseTone.toLowerCase(),
        style: responseGeneration.responseLength.split(' ')[0].toLowerCase(),
        post_url: responseGeneration.postUrl,
        use_latest_post: responseGeneration.useLatestPost
      });

      if (response.success) {
        const newResponse: AutoResponse = {
          id: Date.now().toString(),
          text: 'Started automated comment responses! 🤖',
          timestamp: new Date(),
          type: 'info'
        };

        setResponseGeneration(prev => ({
          ...prev,
          responses: [newResponse, ...prev.responses],
          stats: {
            totalComments: response.stats.comments_processed,
            successfulReplies: response.stats.successful_responses,
            failedReplies: response.stats.failed_responses,
            remainingComments: response.stats.comments_processed - (response.stats.successful_responses + response.stats.failed_responses)
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

  const stopAutomation = () => {
    setIsRunning(false);
    toast.success('Automation stopped');
  };

  const simulateLoading = () => {
    const messages = [
      'Analyzing engagement patterns...',
      'Crafting personalized responses...',
      'Optimizing for engagement...',
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
              <Instagram className="w-16 h-16 text-pink-500" />
              <h2 className="text-2xl font-bold">Instagram</h2>
              <p className="text-center text-gray-600">
                Connecting to Instagram...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-pink-500 h-2 rounded-full"
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
          title="Instagram Comment Automation 📸" 
          description="Automate responses to Instagram comments and mentions"
        />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Connect Your Instagram Account</CardTitle>
            <CardDescription>
              To use the comment automation features, please connect your Instagram account first.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Instagram className="w-16 h-16 text-pink-500 mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              Connect your Instagram account to enable automatic comment responses and engagement features.
            </p>
            <Button 
              onClick={handleConnectInstagram} 
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </div>
              ) : (
                <>Connect Instagram Account</>
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
          description="Processing all current comments..."
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
                  <p className="text-sm text-muted-foreground">Total Comments</p>
                  <p className="text-2xl font-bold">{responseGeneration.stats.totalComments}</p>
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
                  <p className="text-2xl font-bold text-blue-500">{responseGeneration.stats.remainingComments}</p>
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
                  <span>{Math.round((responseGeneration.stats.successfulReplies + responseGeneration.stats.failedReplies) / responseGeneration.stats.totalComments * 100)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(responseGeneration.stats.successfulReplies + responseGeneration.stats.failedReplies) / responseGeneration.stats.totalComments * 100}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Card */}
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
                      {log.userName && log.commentText && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          <p>User: @{log.userName}</p>
                          <p>Comment: {log.commentText}</p>
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
          title="Instagram Comment Automation"
          description="Automatically respond to comments on your Instagram posts"
        />

        <div className="mt-8 space-y-8">
          {/* Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure how you want to handle comment responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Post Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Post Selection</label>
                  <Switch
                    checked={responseGeneration.useLatestPost}
                    onCheckedChange={(checked) => 
                      setResponseGeneration(prev => ({...prev, useLatestPost: checked}))
                    }
                  />
                </div>
                {!responseGeneration.useLatestPost && (
                  <Input
                    placeholder="Enter Instagram post URL"
                    value={responseGeneration.postUrl}
                    onChange={(e) => 
                      setResponseGeneration(prev => ({...prev, postUrl: e.target.value}))
                    }
                  />
                )}
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
                      <SelectItem key={tone} value={tone}>
                        {tone}
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
                      <SelectItem key={length} value={length}>
                        {length}
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

              {/* Emoji Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Include Emojis</p>
                  <p className="text-sm text-muted-foreground">Add relevant emojis to responses</p>
                </div>
                <Switch
                  checked={responseGeneration.includeEmojis}
                  onCheckedChange={(checked) => 
                    setResponseGeneration(prev => ({...prev, includeEmojis: checked}))
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStartAutomation}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Starting...
                  </div>
                ) : (
                  <>
                    <Instagram className="mr-2 h-5 w-5" />
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
                    View your past Instagram comment automation sessions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                          {log.post_url && (
                            <a
                              href={log.post_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 hover:underline"
                            >
                              View Post
                            </a>
                          )}
                          <div className="mt-2">
                            <p className="text-sm">
                              Tone: {log.settings.tone}, Style: {log.settings.style}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold">{log.stats.comments_processed}</p>
                            <p className="text-xs text-muted-foreground">Total Comments</p>
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