import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { MessageCircle, Copy, Trash2, Settings2, History, Sparkles, Link, Clock, Instagram } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { Slider } from "../../../components/ui/slider";
import { ToolLayout } from "@/components/tool-page/ToolLayout";
import { ToolTitle } from "@/components/ui/tool-title";
import { LoadingModal } from "@/components/ui/loading-modal";
import { cn } from "@/lib/utils";

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

export function InstagramCommentAutomationPage() {
  // Account connection state
  const [isInstagramConnected, setIsInstagramConnected] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [responseGeneration, setResponseGeneration] = useState<ResponseGeneration>({
    mode: 'instant',
    postUrl: '',
    useLatestPost: false,
    responseTone: '',
    responseLength: '',
    customPrompt: '',
    responses: [],
    includeEmojis: true
  });
  const [showAuthSimulation, setShowAuthSimulation] = useState(false);
  const [automationLogs, setAutomationLogs] = useState<AutoResponse[]>([]);

  // Check Instagram connection on mount
  useEffect(() => {
    // TODO: Replace with actual API call
    checkInstagramConnection();
  }, []);

  const checkInstagramConnection = async () => {
    try {
      // TODO: Replace with actual API call
      // Simulated API call
      const connected = false; // This would come from your API
      setIsInstagramConnected(connected);
    } catch (error) {
      console.error('Failed to check Instagram connection:', error);
      setIsInstagramConnected(false);
    }
  };

  const handleConnectInstagram = async () => {
    setShowAuthSimulation(true);
    // Simulate Instagram auth flow
    setTimeout(() => {
      setShowAuthSimulation(false);
      setIsInstagramConnected(true);
      toast.success('Instagram account connected successfully!');
    }, 3000);
  };

  const startAutomation = async () => {
    if (!responseGeneration.postUrl && !responseGeneration.useLatestPost) {
      toast.error('Please provide a post URL or select latest post');
      return;
    }

    setIsRunning(true);
    simulateLoading();

    // Simulate automation start
    setTimeout(() => {
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
          totalComments: 15,
          successfulReplies: 0,
          failedReplies: 0,
          remainingComments: 15
        }
      }));

      // Start simulated comment replies
      simulateCommentReplies();

      toast.success('Automation started successfully!');
    }, 2000);
  };

  const simulateCommentReplies = () => {
    let repliedCount = 0;
    let totalComments = 15;
    
    const interval = setInterval(() => {
      // Only increment total comments occasionally
      if (Math.random() > 0.7) {
        totalComments++;
        setResponseGeneration(prev => ({
          ...prev,
          stats: prev.stats ? {
            ...prev.stats,
            totalComments: prev.stats.totalComments + 1,
            remainingComments: prev.stats.remainingComments + 1
          } : prev.stats
        }));
      }

      repliedCount++;
      const success = Math.random() > 0.2; // 80% success rate

      // Generate a random reply based on preferences
      const generatedReply = success ? 
        `Thanks for your support! ${responseGeneration.includeEmojis ? '🙏 ' : ''}Really appreciate your feedback. ${responseGeneration.includeEmojis ? '💫' : ''}` :
        '';

      const newLog: AutoResponse = {
        id: Date.now().toString(),
        text: success 
          ? `Successfully replied to comment` 
          : `Failed to reply to comment`,
        timestamp: new Date(),
        type: success ? 'success' : 'error',
        userName: `user_${Math.floor(Math.random() * 1000)}`,
        commentText: 'Great content! Keep it up! 🔥',
        generatedReply: success ? generatedReply : undefined
      };

      setAutomationLogs(prev => [newLog, ...prev]);
      
      setResponseGeneration(prev => ({
        ...prev,
        stats: {
          totalComments,
          successfulReplies: prev.stats!.successfulReplies + (success ? 1 : 0),
          failedReplies: prev.stats!.failedReplies + (success ? 0 : 1),
          remainingComments: totalComments - repliedCount
        }
      }));

      // Stop when all comments are processed
      if (repliedCount >= totalComments) {
        clearInterval(interval);
        toast.success('All comments have been processed!');
        
        // Add final report
        const finalReport: AutoResponse = {
          id: Date.now().toString(),
          text: `Completed processing ${totalComments} comments:
          ✅ Successfully replied: ${responseGeneration.stats?.successfulReplies}
          ❌ Failed replies: ${responseGeneration.stats?.failedReplies}
          📊 Success rate: ${Math.round((responseGeneration.stats?.successfulReplies || 0) / totalComments * 100)}%`,
          timestamp: new Date(),
          type: 'info'
        };

        setResponseGeneration(prev => ({
          ...prev,
          responses: [finalReport, ...prev.responses]
        }));

        // Reset UI after delay
        setTimeout(() => {
          setResponseGeneration(prev => ({
            ...prev,
            stats: undefined
          }));
          setIsRunning(false);
          setAutomationLogs([]);
        }, 5000);
      }
    }, 1000); // Fixed interval for instant mode

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  };

  const stopAutomation = () => {
    setIsRunning(false);
    toast.success('Automation stopped');
  };

  const handleInstantReply = async () => {
    if (!responseGeneration.postUrl && !responseGeneration.useLatestPost) {
      toast.error('Please provide a post URL or select latest post');
      return;
    }

    setIsGenerating(true);
    setIsRunning(true);
    simulateLoading();

    // Simulate instant replies
    setTimeout(() => {
      const totalComments = Math.floor(Math.random() * 20) + 5;

      const newResponse: AutoResponse = {
        id: Date.now().toString(),
        text: `Starting to process ${totalComments} comments...`,
        timestamp: new Date(),
        type: 'info'
      };

      setResponseGeneration(prev => ({
        ...prev,
        responses: [newResponse, ...prev.responses],
        stats: {
          totalComments,
          successfulReplies: 0,
          failedReplies: 0,
          remainingComments: totalComments
        }
      }));

      // Start simulated comment replies for instant mode
      simulateInstantReplies(totalComments);
    }, 3000);
  };

  const simulateInstantReplies = (totalComments: number) => {
    let repliedCount = 0;
    const interval = setInterval(() => {
      repliedCount++;
      const success = Math.random() > 0.2; // 80% success rate

      // Generate a random reply based on preferences
      const generatedReply = success ? 
        `Thanks for your support! ${responseGeneration.includeEmojis ? '🙏 ' : ''}Really appreciate your feedback. ${responseGeneration.includeEmojis ? '💫' : ''}` :
        '';

      const newLog: AutoResponse = {
        id: Date.now().toString(),
        text: success 
          ? `Successfully replied to comment` 
          : `Failed to reply to comment`,
        timestamp: new Date(),
        type: success ? 'success' : 'error',
        userName: `user_${Math.floor(Math.random() * 1000)}`,
        commentText: 'Great content! Keep it up! 🔥',
        generatedReply: success ? generatedReply : undefined
      };

      setAutomationLogs(prev => [newLog, ...prev]);
      
      setResponseGeneration(prev => {
        if (!prev.stats) return prev; // Guard against undefined stats
        
        return {
          ...prev,
          stats: {
            ...prev.stats,
            successfulReplies: prev.stats.successfulReplies + (success ? 1 : 0),
            failedReplies: prev.stats.failedReplies + (success ? 0 : 1),
            remainingComments: totalComments - repliedCount
          }
        };
      });

      if (repliedCount >= totalComments) {
        clearInterval(interval);
        
        // Show completion toast
        toast.success('All comments have been processed!');

        // Add final report to responses
        setResponseGeneration(prev => {
          if (!prev.stats) return prev; // Guard against undefined stats
          
          const finalReport: AutoResponse = {
            id: Date.now().toString(),
            text: `Completed processing ${totalComments} comments:
            ✅ Successfully replied: ${prev.stats.successfulReplies}
            ❌ Failed replies: ${prev.stats.failedReplies}
            📊 Success rate: ${Math.round((prev.stats.successfulReplies) / totalComments * 100)}%`,
            timestamp: new Date(),
            type: 'info'
          };

          return {
            ...prev,
            responses: [finalReport, ...prev.responses]
          };
        });

        // Reset UI after delay
        setTimeout(() => {
          setResponseGeneration(prev => ({
            ...prev,
            stats: undefined
          }));
    setIsRunning(false);
          setIsGenerating(false);
          setAutomationLogs([]);
        }, 5000);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const deleteResponse = (id: string) => {
    setResponseGeneration(prev => ({
      ...prev,
      responses: prev.responses.filter(response => response.id !== id)
    }));
    toast.success('Response deleted');
  };

  if (showAuthSimulation) {
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

  if (!isInstagramConnected) {
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
            <Button onClick={handleConnectInstagram} className="bg-gradient-to-r from-purple-500 to-pink-500">
              Connect Instagram Account
            </Button>
          </CardContent>
        </Card>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout>
      <ToolTitle 
        title="Instagram Comment Automation 📸" 
        description="Reply to all pending comments on your Instagram posts instantly"
      />
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Comment Reply Settings</CardTitle>
            <CardDescription>
              Reply to all pending comments on a post instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Post Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Post Selection</label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={responseGeneration.useLatestPost}
                    onCheckedChange={(checked) => 
                      setResponseGeneration(prev => ({ ...prev, useLatestPost: checked, postUrl: '' }))}
                  />
                  <span className="text-sm">Use Latest Post</span>
                </div>
              </div>
              
              {!responseGeneration.useLatestPost && (
                <Input
                  placeholder="Enter Instagram post URL..."
                  value={responseGeneration.postUrl}
                  onChange={(e) => setResponseGeneration(prev => ({ ...prev, postUrl: e.target.value }))}
                />
              )}
            </div>

            {/* Response Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Tone</label>
                <Select
                  value={responseGeneration.responseTone}
                  onValueChange={(value) => setResponseGeneration(prev => ({ ...prev, responseTone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select response tone" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Response Length</label>
                <Select
                  value={responseGeneration.responseLength}
                  onValueChange={(value) => setResponseGeneration(prev => ({ ...prev, responseLength: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select response length" />
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

              <div className="flex items-center space-x-2">
                <Switch
                  checked={responseGeneration.includeEmojis}
                  onCheckedChange={(checked) => 
                    setResponseGeneration(prev => ({ ...prev, includeEmojis: checked }))}
                />
                <label className="text-sm font-medium">Include Emojis</label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Instructions (Optional)</label>
              <Textarea
                placeholder="Add any specific instructions for the AI..."
                value={responseGeneration.customPrompt}
                onChange={(e) => setResponseGeneration(prev => ({ ...prev, customPrompt: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleInstantReply}
              disabled={isGenerating}
              className="w-full"
            >
              Reply to All Comments
            </Button>
          </CardFooter>
        </Card>

        {(isGenerating || isRunning) && (
          <Card className="mt-4">
            <CardContent className="py-4">
                <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{loadingMessage}</span>
                  <span>{generationProgress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${generationProgress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${generationProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
      )}

        {responseGeneration.responses.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Response History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {responseGeneration.responses.map((response) => (
                <div
                  key={response.id}
                  className="p-4 rounded-lg border bg-card text-card-foreground"
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-sm">{response.text}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(response.text)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteResponse(response.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Generated {response.timestamp.toLocaleString()}
                  </p>
              </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
} 