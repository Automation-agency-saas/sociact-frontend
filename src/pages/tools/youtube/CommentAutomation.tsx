import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { MessageCircle, Copy, Trash2, Settings2, History, Sparkles, Link, Clock, Youtube, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { Slider } from "../../../components/ui/slider";
import { ToolLayout } from "@/components/tool-page/ToolLayout";
import { ToolTitle } from "@/components/ui/tool-title";
import { cn } from "@/lib/utils";
import { youtubeService } from '@/lib/services/youtube.service';
import type { AutomationConfig } from '@/lib/types/youtube';
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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

interface ResponseGeneration {
  mode: 'auto' | 'instant';
  videoUrl: string;
  useLatestVideo: boolean;
  checkInterval: string;
  responseTone: string;
  responseLength: string;
  customPrompt: string;
  responses: AutoResponse[];
  includeEmojis: boolean;
  maxRepliesPerHour: number;
  stats?: {
    totalComments: number;
    successfulReplies: number;
    failedReplies: number;
    remainingComments: number;
    startTime?: Date;
    endTime?: Date;
    alreadyReplied?: number;
  };
  websocket?: WebSocket;
  automationId?: string;
  status?: string;
}

interface AutoResponse {
  id: string;
  text: string;
  timestamp: Date;
  type?: 'success' | 'info' | 'error';
  commentText?: string;
  userName?: string;
  generatedReply?: string;
  generated_response?: string;
  comment_type?: string;
  response_tone?: string;
  response_length?: string;
  sample_comment?: string;
  engagement_tips?: string;
}

export function YouTubeCommentAutomationPage() {
  // Account connection state
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  
  const [activeTab, setActiveTab] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [responseGeneration, setResponseGeneration] = useState<ResponseGeneration>({
    mode: 'auto',
    videoUrl: '',
    useLatestVideo: false,
    checkInterval: '15',
    responseTone: '',
    responseLength: '',
    customPrompt: '',
    responses: [],
    includeEmojis: true,
    maxRepliesPerHour: 10
  });
  const [showAuthSimulation, setShowAuthSimulation] = useState(false);
  const [automationLogs, setAutomationLogs] = useState<AutoResponse[]>([]);
  const [commentHistory, setCommentHistory] = useState<Array<any>>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Check YouTube connection on mount
  useEffect(() => {
    checkYouTubeConnection();
  }, []);

  const checkYouTubeConnection = async () => {
    try {
      const status = await youtubeService.checkAuthStatus();
      setIsYouTubeConnected(status.isConnected);
    } catch (error) {
      console.error('Failed to check YouTube connection:', error);
      setIsYouTubeConnected(false);
    }
  };

  const handleConnectYouTube = async () => {
    setShowAuthSimulation(true);
    try {
      // Redirect to YouTube OAuth URL
      const clientId = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_YOUTUBE_REDIRECT_URI;
      const scope = 'https://www.googleapis.com/auth/youtube.force-ssl';
      const state = 'youtube'; // Add state parameter for callback handling
      
      // Save current state if needed
      const currentState = {
        returnPath: window.location.pathname,
        videoUrl: responseGeneration.videoUrl,
        useLatestVideo: responseGeneration.useLatestVideo,
        checkInterval: responseGeneration.checkInterval,
        responseTone: responseGeneration.responseTone,
        responseLength: responseGeneration.responseLength,
        customPrompt: responseGeneration.customPrompt,
        includeEmojis: responseGeneration.includeEmojis,
        maxRepliesPerHour: responseGeneration.maxRepliesPerHour
      };
      localStorage.setItem('youtube_auth_return_state', JSON.stringify(currentState));
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}&access_type=offline&prompt=consent`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect YouTube:', error);
      setShowAuthSimulation(false);
      toast.error('Failed to connect YouTube account');
    }
  };

  // Form states
  const [commentType, setCommentType] = useState('');
  const [responseTone, setResponseTone] = useState('');
  const [responseLength, setResponseLength] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Loading and results states
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [currentResponses, setCurrentResponses] = useState<ResponseGeneration | null>(null);
  const [history, setHistory] = useState<ResponseGeneration[]>([]);

  const loadingMessages = [
    "Analyzing comment patterns...",
    "Crafting personalized responses...",
    "Optimizing engagement potential...",
    "Adding personal touches...",
    "Finalizing your responses..."
  ];

  // Simulate loading progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          const increment = prev < 30 ? 0.7 : 
                          prev < 60 ? 0.5 : 
                          prev < 80 ? 0.3 : 0.1;
          return Math.round((prev + increment) * 10) / 10;
        });

        setLoadingMessageIndex(prev => 
          loadingProgress < 20 ? 0 :
          loadingProgress < 40 ? 1 :
          loadingProgress < 60 ? 2 :
          loadingProgress < 80 ? 3 : 4
        );
      }, 100);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
      setLoadingMessageIndex(0);
    }
  }, [loading, loadingProgress]);

  const generateFromPreferences = async () => {
    if (!commentType || !responseTone || !responseLength) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }

    setLoading(true);
    try {
      const response: ResponseGeneration = {
        mode: 'auto',
        videoUrl: '',
        useLatestVideo: false,
        checkInterval: '15',
        responseTone,
        responseLength,
        customPrompt: '',
        includeEmojis: true,
        maxRepliesPerHour: 10,
        responses: [
          {
            id: Date.now().toString(),
            text: "Generated response for preferences",
            timestamp: new Date(),
            comment_type: commentType,
            response_tone: responseTone,
            response_length: responseLength,
            sample_comment: "This video was so helpful! Can you make more content like this?",
            generatedReply: "Thank you so much for your kind words! 🙏 I'm thrilled to hear you found the video helpful. I definitely have more content like this planned - stay tuned for new uploads every week! Is there any specific topic you'd like me to cover next?",
            engagement_tips: "Ask a follow-up question to encourage further interaction"
          }
        ]
      };
      
      setCurrentResponses(response);
      setHistory(prev => [response, ...prev]);
      toast.success("Responses generated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCustomResponses = async () => {
    if (!customPrompt.trim()) {
      toast.error("Please enter your custom response requirements");
      return;
    }

    setLoading(true);
    try {
      const response: ResponseGeneration = {
        mode: 'auto',
        videoUrl: '',
        useLatestVideo: false,
        checkInterval: '15',
        responseTone: 'custom',
        responseLength: 'medium',
        customPrompt,
        includeEmojis: true,
        maxRepliesPerHour: 10,
        responses: [
          {
            id: Date.now().toString(),
            text: "Generated custom response",
            timestamp: new Date(),
            comment_type: 'custom',
            response_tone: 'custom',
            response_length: 'medium',
            sample_comment: customPrompt,
            generatedReply: "Thank you for sharing your thoughts! Your feedback helps me improve the content. I'll definitely take your suggestions into account for future videos. Let me know if you have any other ideas!",
            engagement_tips: "Personalize the response based on the specific feedback received"
          }
        ]
      };
      
      setCurrentResponses(response);
      setHistory(prev => [response, ...prev]);
      toast.success("Custom responses generated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantReply = async () => {
    if (!responseGeneration.videoUrl && !responseGeneration.useLatestVideo) {
      toast.error('Please provide a video URL or select latest video');
      return;
    }

    setIsGenerating(true);
    setIsRunning(true);
    simulateLoading();

    try {
      const config: AutomationConfig = {
        mode: 'instant',
        videoUrl: responseGeneration.videoUrl,
        useLatestVideo: responseGeneration.useLatestVideo,
        checkInterval: responseGeneration.checkInterval,
        responseTone: responseGeneration.responseTone,
        responseLength: responseGeneration.responseLength,
        customPrompt: responseGeneration.customPrompt,
        includeEmojis: responseGeneration.includeEmojis,
        maxRepliesPerHour: responseGeneration.maxRepliesPerHour
      };

      // Show processing message
      const processingLog: AutoResponse = {
        id: Date.now().toString(),
        text: 'Processing comments...',
        timestamp: new Date(),
        type: 'info'
      };
      setAutomationLogs(prev => [processingLog, ...prev]);
      
      // Process comments and get final report
      const result = await youtubeService.processInstantComments(config);
      
      // Convert API logs to AutoResponse format and add them to automation logs
      const apiLogs = result.logs.map(log => ({
        id: log.id,
        text: log.text,
        timestamp: new Date(log.timestamp),
        type: log.type,
        userName: log.userName,
        commentText: log.commentText,
        generatedReply: log.generatedReply
      }));
      
      setAutomationLogs(prev => [...apiLogs, ...prev]);
      
      // Add final report
      const finalReport: AutoResponse = {
        id: Date.now().toString(),
        text: `Completed processing comments:
        ✅ Successfully replied: ${result.stats.successfulReplies}
        ❌ Failed replies: ${result.stats.failedReplies}
        📊 Success rate: ${Math.round((result.stats.successfulReplies / result.stats.totalComments) * 100)}%`,
        timestamp: new Date(),
        type: 'info'
      };
      
      setAutomationLogs(prev => [finalReport, ...prev]);
      setResponseGeneration(prev => ({
        ...prev,
        stats: result.stats
      }));
      
      toast.success('Successfully processed all comments!');
      
      // Reset UI state after showing the report
      setTimeout(() => {
        setIsGenerating(false);
        setIsRunning(false);
        setResponseGeneration(prev => ({ ...prev, stats: undefined }));
        setAutomationLogs([]);
      }, 10000); // Keep the report visible for 10 seconds

    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to process comments:', error);
        toast.error(error.message);
      } else {
        console.error('Failed to process comments:', error);
        toast.error('Failed to process comments');
      }
      setIsGenerating(false);
      setIsRunning(false);
    }
  };

  const startAutomation = async () => {
    if (!responseGeneration.videoUrl && !responseGeneration.useLatestVideo) {
      toast.error('Please provide a video URL or select latest video');
      return;
    }

    setIsRunning(true);
    simulateLoading();

    try {
      const config: AutomationConfig = {
        mode: 'auto',
        videoUrl: responseGeneration.videoUrl,
        useLatestVideo: responseGeneration.useLatestVideo,
        checkInterval: responseGeneration.checkInterval,
        responseTone: responseGeneration.responseTone,
        responseLength: responseGeneration.responseLength,
        customPrompt: responseGeneration.customPrompt,
        includeEmojis: responseGeneration.includeEmojis,
        maxRepliesPerHour: responseGeneration.maxRepliesPerHour
      };

      const result = await youtubeService.startAutoComments(config);
      
      // Store automation ID, status and initial stats
      setResponseGeneration(prev => ({
        ...prev,
        automationId: result.automationId,
        status: 'running',
        stats: {
          totalComments: result.initialStats.totalComments,
          successfulReplies: result.initialStats.successfulReplies,
          failedReplies: result.initialStats.failedReplies,
          remainingComments: result.initialStats.remainingComments,
          alreadyReplied: result.initialStats.alreadyReplied || 0,
          startTime: result.initialStats.startTime ? new Date(result.initialStats.startTime) : undefined,
          endTime: result.initialStats.endTime ? new Date(result.initialStats.endTime) : undefined
        }
      }));

      // Add initial log
      const initialLog: AutoResponse = {
        id: Date.now().toString(),
        text: 'Starting 3-hour automation...',
        timestamp: new Date(),
        type: 'info'
      };
      setAutomationLogs(prev => [initialLog, ...prev]);

      // Start polling for updates
      const pollInterval = setInterval(async () => {
        try {
          if (!result.automationId) {
            clearInterval(pollInterval);
            return;
          }

          const statusResult = await youtubeService.getAutomationStatus(result.automationId);
          
          // Update stats and status
          setResponseGeneration(prev => ({
            ...prev,
            status: statusResult.status,
            stats: {
              ...prev.stats!,
              ...statusResult.stats
            }
          }));

          // Add status update to logs if there are changes
          if (statusResult.stats.successfulReplies > 0 || statusResult.stats.failedReplies > 0) {
            const newLog: AutoResponse = {
              id: Date.now().toString(),
              text: `Status update: ${statusResult.status.toUpperCase()}
                ✅ Successful replies: ${statusResult.stats.successfulReplies}
                ❌ Failed replies: ${statusResult.stats.failedReplies}
                ⏳ Remaining comments: ${statusResult.stats.remainingComments}
                🔄 Already replied: ${statusResult.stats.alreadyReplied}`,
              timestamp: new Date(),
              type: 'info'
            };
            setAutomationLogs(prev => [newLog, ...prev]);
          }

          // Check if automation is complete
          if (statusResult.status === 'completed' || statusResult.status === 'failed' || statusResult.status === 'stopped') {
            clearInterval(pollInterval);
            setIsRunning(false);
            
            const finalLog: AutoResponse = {
              id: Date.now().toString(),
              text: statusResult.status === 'completed' 
                ? '3-hour automation completed successfully!' 
                : `Automation ${statusResult.status}`,
              timestamp: new Date(),
              type: statusResult.status === 'completed' ? 'success' : 'error'
            };
            setAutomationLogs(prev => [finalLog, ...prev]);
            
            if (statusResult.status === 'completed') {
              toast.success('3-hour automation completed!');
            } else {
              toast.error(`Automation ${statusResult.status}`);
            }

            // Reset UI after delay
            setTimeout(() => {
              setResponseGeneration(prev => ({
                ...prev,
                stats: undefined,
                status: undefined,
                automationId: undefined
              }));
              setAutomationLogs([]);
            }, 10000);
          }
        } catch (error) {
          console.error('Error polling status:', error);
          clearInterval(pollInterval);
          setIsRunning(false);
          setResponseGeneration(prev => ({
            ...prev,
            status: 'failed'
          }));
          toast.error('Failed to get status updates');
        }
      }, 2000);

    } catch (error) {
      console.error('Failed to start automation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start automation';
      toast.error(errorMessage);
      setIsRunning(false);
      setResponseGeneration(prev => ({
        ...prev,
        status: 'failed'
      }));
    }
  };

  const simulateCommentReplies = (startTime?: Date, endTime?: Date) => {
    let repliedCount = 0;
    let totalComments = 15;
    
    const interval = setInterval(() => {
      // Only add new comments in auto mode
      const shouldAddNewComment = responseGeneration.mode === 'auto' && Math.random() > 0.7;
      if (shouldAddNewComment) {
        totalComments++;
        setResponseGeneration(prev => ({
          ...prev,
          stats: prev.stats ? {
            ...prev.stats,
            totalComments: prev.stats.totalComments + 1,
            remainingComments: prev.stats.remainingComments + 1
          } : prev.stats
        }));

        // Add a notification for new comment
        const newCommentLog: AutoResponse = {
          id: Date.now().toString(),
          text: 'New comment detected! 🔔',
          timestamp: new Date(),
          type: 'info',
          userName: `user_${Math.floor(Math.random() * 1000)}`,
          commentText: 'New comment: Great video! Looking forward to more content! 🎉'
        };
        setAutomationLogs(prev => [newCommentLog, ...prev]);
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
      
      const now = new Date();
      
      setResponseGeneration(prev => ({
        ...prev,
        stats: {
          ...prev.stats!,
          totalComments,
          successfulReplies: prev.stats!.successfulReplies + (success ? 1 : 0),
          failedReplies: prev.stats!.failedReplies + (success ? 0 : 1),
          remainingComments: prev.mode === 'instant' ? totalComments - repliedCount : prev.stats!.remainingComments
        }
      }));

      // For instant mode, stop when all comments are processed
      if (responseGeneration.mode === 'instant' && repliedCount >= totalComments) {
        clearInterval(interval);
        toast.success('All comments have been processed!');
        
        // Add final report for instant mode
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

        // Reset UI after delay for instant mode
        setTimeout(() => {
          setResponseGeneration(prev => ({
            ...prev,
            stats: undefined
          }));
          setIsRunning(false);
          setAutomationLogs([]);
        }, 5000);
      }

      // For auto mode, stop after 3 hours
      if (responseGeneration.mode === 'auto' && endTime && now >= endTime) {
        clearInterval(interval);
        toast.success('3-hour automation completed!');
        
        // Add final report for auto mode
        const finalReport: AutoResponse = {
          id: Date.now().toString(),
          text: `3-hour automation completed:
          📊 Total Comments: ${totalComments}
          ✅ Successfully replied: ${responseGeneration.stats?.successfulReplies}
          ❌ Failed replies: ${responseGeneration.stats?.failedReplies}`,
          timestamp: new Date(),
          type: 'info'
        };

        setResponseGeneration(prev => ({
          ...prev,
          responses: [finalReport, ...prev.responses]
        }));

        // Reset UI
        setTimeout(() => {
          setResponseGeneration(prev => ({
            ...prev,
            stats: undefined
          }));
          setIsRunning(false);
          setAutomationLogs([]);
        }, 5000);
      }
    }, responseGeneration.mode === 'auto' ? 2000 : 1000);

    return () => clearInterval(interval);
  };

  const stopAutomation = async () => {
    try {
      if (responseGeneration.automationId) {
        await youtubeService.stopAutomation(responseGeneration.automationId);
        
        // Close WebSocket connection
        if (responseGeneration.websocket) {
          responseGeneration.websocket.close();
        }
        
        setIsRunning(false);
        toast.success('Automation stopped');
      }
    } catch (error) {
      console.error('Failed to stop automation:', error);
      toast.error('Failed to stop automation');
    }
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

  const copyToClipboard = (text: string | undefined) => {
    if (!text) return;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderResponse = (response: AutoResponse) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Sample Comment */}
        {response.sample_comment && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">💬 Sample Comment</p>
            <p className="text-sm italic bg-muted/50 p-3 rounded-lg">
              "{response.sample_comment}"
            </p>
          </div>
        )}

        {/* Generated Response */}
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-4">
            <p className="text-sm text-muted-foreground">✨ Generated Response</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(response.generated_response)}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm bg-primary/10 p-3 rounded-lg">
            {response.generated_response}
          </p>
        </div>

        {/* Engagement Tips */}
        {response.engagement_tips && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">💡 Engagement Tip</p>
            <p className="text-sm text-primary">{response.engagement_tips}</p>
          </div>
        )}

        {/* Response Metadata */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm font-medium">{response.comment_type}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tone</p>
            <p className="text-sm font-medium">{response.response_tone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Length</p>
            <p className="text-sm font-medium">{response.response_length}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (responseGeneration.websocket) {
        responseGeneration.websocket.close();
      }
    };
  }, []);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (responseGeneration.automationId) {
        // Any cleanup needed
      }
    };
  }, []);

  // Add fetchHistory function
  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setHistoryError(null);
      const response = await youtubeService.getCommentHistory(10, 0);
      setCommentHistory(response.history);
    } catch (error) {
      setHistoryError('Failed to load comment history');
      console.error('Error fetching history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Add useEffect to fetch history on mount and after automation completes
  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (responseGeneration.status === 'completed') {
      fetchHistory();
    }
  }, [responseGeneration.status]);

  if (showAuthSimulation) {
    return (
      <ToolLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-96 bg-white rounded-lg shadow-xl p-8">
            <div className="flex flex-col items-center space-y-4">
              <Youtube className="w-16 h-16 text-red-500" />
              <h2 className="text-2xl font-bold">YouTube</h2>
              <p className="text-center text-gray-600">
                Connecting to YouTube...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-red-500 h-2 rounded-full"
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

  if (!isYouTubeConnected) {
    return (
      <ToolLayout>
        <ToolTitle 
          title="YouTube Comment Automation 🎥" 
          description="Automate responses to YouTube comments and mentions"
        />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Connect Your YouTube Account</CardTitle>
            <CardDescription>
              To use the comment automation features, please connect your YouTube account first.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Youtube className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              Connect your YouTube account to enable automatic comment responses and engagement features.
            </p>
            <Button onClick={handleConnectYouTube} className="bg-gradient-to-r from-red-500 to-red-600">
              Connect YouTube Account
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
          description={responseGeneration.mode === 'auto' 
            ? "Comment automation is running and will continue for 3 hours. New comments will be automatically detected and replied to. Click 'Stop Automation' to end early." 
            : "Processing all current comments..."
          }
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
                  <p className="text-sm text-muted-foreground">Already Replied</p>
                  <p className="text-2xl font-bold text-blue-500">{responseGeneration.stats.alreadyReplied || 0}</p>
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
                  {responseGeneration.mode === 'auto' && responseGeneration.stats?.startTime && responseGeneration.stats?.endTime
                    ? (
                      <span>
                        {Math.min(
                          100,
                          Math.round(
                            ((new Date().getTime() - responseGeneration.stats.startTime.getTime()) /
                              (responseGeneration.stats.endTime.getTime() - responseGeneration.stats.startTime.getTime())) *
                              100
                            )
                          )}%
                      </span>
                    )
                    : (
                      <span>
                        {responseGeneration.stats
                          ? `${Math.round((responseGeneration.stats.successfulReplies + responseGeneration.stats.failedReplies) /
                              responseGeneration.stats.totalComments *
                              100)}%`
                          : '0%'
                        }
                      </span>
                    )
                  }
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: responseGeneration.mode === 'auto' && responseGeneration.stats?.startTime && responseGeneration.stats?.endTime
                        ? `${Math.min(
                            100,
                            Math.round(
                              ((new Date().getTime() - responseGeneration.stats.startTime.getTime()) /
                                (responseGeneration.stats.endTime.getTime() - responseGeneration.stats.startTime.getTime())) *
                                100
                              )
                            )}%`
                        : responseGeneration.stats
                        ? `${Math.round((responseGeneration.stats.successfulReplies + responseGeneration.stats.failedReplies) /
                            responseGeneration.stats.totalComments *
                            100)}%`
                        : '0%'
                    }}
                  />
                </div>
                {responseGeneration.mode === 'auto' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Time Remaining: {formatTimeRemaining(responseGeneration.stats.endTime)}
                  </p>
                )}
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

          {/* Comment History Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Automation History
                  </CardTitle>
                  <CardDescription>
                    View your past automation sessions
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchHistory}
                  disabled={isLoadingHistory}
                >
                  <RefreshCw className={cn("h-4 w-4", isLoadingHistory && "animate-spin")} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : historyError ? (
                <div className="text-center py-8 text-destructive">
                  {historyError}
                </div>
              ) : commentHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No automation history yet
                </div>
              ) : (
                <div className="space-y-4">
                  {commentHistory.map((session) => (
                    <Card key={session.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(session.createdAt).toLocaleDateString()} at{' '}
                              {new Date(session.createdAt).toLocaleTimeString()}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={
                                session.status === 'completed' ? 'success' :
                                session.status === 'failed' ? 'destructive' :
                                session.status === 'running' ? 'default' :
                                'secondary'
                              }>
                                {session.status}
                              </Badge>
                              {session.completedAt && (
                                <span className="text-xs text-muted-foreground">
                                  Completed: {new Date(session.completedAt).toLocaleTimeString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                          <div className="text-center p-2 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">Total Comments</p>
                            <p className="text-lg font-semibold">{session.stats.totalComments}</p>
                          </div>
                          <div className="text-center p-2 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">Successful</p>
                            <p className="text-lg font-semibold text-green-500">{session.stats.successfulReplies}</p>
                          </div>
                          <div className="text-center p-2 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">Failed</p>
                            <p className="text-lg font-semibold text-red-500">{session.stats.failedReplies}</p>
                          </div>
                          <div className="text-center p-2 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">Already Replied</p>
                            <p className="text-lg font-semibold text-blue-500">{session.stats.alreadyReplied}</p>
                          </div>
                        </div>
                        
                        {session.error && (
                          <div className="mt-2 p-2 rounded-lg bg-destructive/10 text-destructive text-sm">
                            {session.error}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Button to stop automation */}
          {responseGeneration.mode === 'auto' && (
            <Button
              onClick={stopAutomation}
              variant="destructive"
              className="w-full"
            >
              Stop 3-hour Automation
            </Button>
          )}
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout>
      <ToolTitle 
        title="YouTube Comment Automation 🎥" 
        description="Automate responses to YouTube comments and mentions"
      />
      
      <div className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="auto">
              <Clock className="w-4 h-4 mr-2" />
              Auto Mode
            </TabsTrigger>
            <TabsTrigger value="instant">
              <Sparkles className="w-4 h-4 mr-2" />
              Instant Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Automated Response Settings</CardTitle>
                <CardDescription>
                  Configure settings for 3-hour automated comment responses. The automation will continuously monitor and reply to new comments for 3 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Video Selection</label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={responseGeneration.useLatestVideo}
                        onCheckedChange={(checked) => 
                          setResponseGeneration(prev => ({ ...prev, useLatestVideo: checked, videoUrl: '' }))}
                      />
                      <span className="text-sm">Use Latest Video</span>
                    </div>
                  </div>
                  
                  {!responseGeneration.useLatestVideo && (
                    <Input
                      placeholder="Enter YouTube video URL..."
                      value={responseGeneration.videoUrl}
                      onChange={(e) => setResponseGeneration(prev => ({ ...prev, videoUrl: e.target.value }))}
                      disabled={isRunning}
                    />
                  )}
                </div>

                {/* Check Interval */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check Interval</label>
                  <Select
                    value={responseGeneration.checkInterval}
                    onValueChange={(value) => setResponseGeneration(prev => ({ ...prev, checkInterval: value }))}
                    disabled={isRunning}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select check interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHECK_INTERVALS.map((interval) => (
                        <SelectItem key={interval.value} value={interval.value}>
                          {interval.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Response Settings */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Tone</label>
                    <Select
                      value={responseGeneration.responseTone}
                      onValueChange={(value) => setResponseGeneration(prev => ({ ...prev, responseTone: value }))}
                      disabled={isRunning}
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
                      disabled={isRunning}
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

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Max Replies per Hour</label>
                      <span className="text-sm text-muted-foreground">
                        {responseGeneration.maxRepliesPerHour} replies/hour
                      </span>
                    </div>
                    <Slider
                      value={[responseGeneration.maxRepliesPerHour]}
                      onValueChange={([value]) => 
                        setResponseGeneration(prev => ({ ...prev, maxRepliesPerHour: value }))}
                      min={1}
                      max={20}
                      step={1}
                      disabled={isRunning}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={responseGeneration.includeEmojis}
                      onCheckedChange={(checked) => 
                        setResponseGeneration(prev => ({ ...prev, includeEmojis: checked }))}
                      disabled={isRunning}
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
                    disabled={isRunning}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={isRunning ? stopAutomation : startAutomation}
                  disabled={isGenerating}
                  className="w-full"
                  variant={isRunning ? "destructive" : "default"}
                >
                  {isRunning ? 'Stop Automation' : 'Start Automation'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="instant" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Instant Reply Settings</CardTitle>
                <CardDescription>
                  Reply to all pending comments on a video instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Video Selection</label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={responseGeneration.useLatestVideo}
                        onCheckedChange={(checked) => 
                          setResponseGeneration(prev => ({ ...prev, useLatestVideo: checked, videoUrl: '' }))}
                      />
                      <span className="text-sm">Use Latest Video</span>
                    </div>
                  </div>
                  
                  {!responseGeneration.useLatestVideo && (
                    <Input
                      placeholder="Enter YouTube video URL..."
                      value={responseGeneration.videoUrl}
                      onChange={(e) => setResponseGeneration(prev => ({ ...prev, videoUrl: e.target.value }))}
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
          </TabsContent>

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
                    className={cn(
                      "p-4 rounded-lg border",
                      response.type === 'success' && "border-green-500/20 bg-green-500/10",
                      response.type === 'error' && "border-red-500/20 bg-red-500/10",
                      response.type === 'info' && "border-blue-500/20 bg-blue-500/10"
                    )}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <p className="text-sm">{response.text}</p>
                        {response.userName && response.commentText && (
                          <div className="mt-1 text-sm text-muted-foreground">
                            <p>User: @{response.userName}</p>
                            <p>Comment: {response.commentText}</p>
                            {response.generatedReply && (
                              <p className="text-primary mt-1">Reply: {response.generatedReply}</p>
                            )}
                          </div>
                        )}
                      </div>
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
                      {response.timestamp.toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </Tabs>

        {/* Automation Logs Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Automation Logs
                </CardTitle>
                <CardDescription>
                  View your recent automation activities
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchHistory}
                disabled={isLoadingHistory}
              >
                <RefreshCw className={cn("h-4 w-4", isLoadingHistory && "animate-spin")} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : historyError ? (
              <div className="text-center py-8 text-destructive">
                {historyError}
              </div>
            ) : commentHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No automation logs yet
              </div>
            ) : (
              <div className="space-y-4">
                {commentHistory.map((log) => (
                  <Card key={log.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {formatDate(log.createdAt)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              log.status === 'completed' ? 'success' :
                              log.status === 'failed' ? 'destructive' :
                              log.status === 'running' ? 'default' :
                              'secondary'
                            }>
                              {log.status}
                            </Badge>
                            {log.completedAt && (
                              <span className="text-xs text-muted-foreground">
                                Completed: {formatDate(log.completedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Total Comments</p>
                          <p className="text-lg font-semibold">{log.stats.totalComments}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Successful</p>
                          <p className="text-lg font-semibold text-green-500">{log.stats.successfulReplies}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Failed</p>
                          <p className="text-lg font-semibold text-red-500">{log.stats.failedReplies}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Already Replied</p>
                          <p className="text-lg font-semibold text-blue-500">{log.stats.alreadyReplied}</p>
                        </div>
                      </div>

                      {/* Settings Summary */}
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium mb-2">Settings Used:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Video: </span>
                            {log.settings.use_latest_video ? 'Latest Video' : 'Custom URL'}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Response Tone: </span>
                            {log.settings.response_tone}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Response Length: </span>
                            {log.settings.response_length}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Emojis: </span>
                            {log.settings.include_emojis ? 'Yes' : 'No'}
                          </div>
                        </div>
                      </div>
                      
                      {log.error && (
                        <div className="mt-2 p-2 rounded-lg bg-destructive/10 text-destructive text-sm">
                          {log.error}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}

const formatTimeRemaining = (endTime?: Date) => {
  if (!endTime) return 'Completed';
  
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Completed';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m remaining`;
}; 