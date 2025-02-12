import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Loader2, Trash2, History, MessageSquare, Clock, Settings, PenLine, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { LoadingModal } from "@/components/ui/loading-modal";
import { ToolTitle } from "@/components/ui/tool-title";
import { ToolLayout } from "@/components/tool-page/ToolLayout";

// Constants for dropdowns
const RESPONSE_TONES = [
  { value: 'friendly', label: '😊 Friendly' },
  { value: 'professional', label: '👔 Professional' },
  { value: 'casual', label: '🤙 Casual' },
  { value: 'witty', label: '😏 Witty' },
  { value: 'supportive', label: '🤝 Supportive' },
  { value: 'engaging', label: '🎯 Engaging' }
];

const COMMENT_TYPES = [
  { value: 'reply', label: '💬 Replies' },
  { value: 'mention', label: '@ Mentions' },
  { value: 'quote', label: '🔄 Quote Tweets' },
  { value: 'feedback', label: '💭 Feedback' },
  { value: 'discussion', label: '🗣️ Discussion' }
];

const RESPONSE_LENGTHS = [
  { value: 'short', label: '⚡ Short (under 140 chars)' },
  { value: 'medium', label: '📝 Medium (140-200 chars)' },
  { value: 'long', label: '📄 Long (200-280 chars)' }
];

interface AutoResponse {
  comment_type: string;
  response_tone: string;
  response_length: string;
  sample_comment?: string;
  generated_response: string;
  engagement_tips?: string;
}

interface ResponseGeneration {
  id: string;
  created_at: string;
  platform: string;
  generation_type: string;
  responses: AutoResponse[];
  preferences?: {
    comment_type: string;
    response_tone: string;
    response_length: string;
  };
}

export function TwitterCommentAutomationPage() {
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
    "Analyzing tweet patterns...",
    "Crafting engaging responses...",
    "Optimizing for Twitter's style...",
    "Adding personality...",
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
      // TODO: Implement actual API call
      // Simulated response for now
      const response: ResponseGeneration = {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        platform: 'twitter',
        generation_type: 'preferences',
        preferences: {
          comment_type: commentType,
          response_tone: responseTone,
          response_length: responseLength
        },
        responses: [
          {
            comment_type: commentType,
            response_tone: responseTone,
            response_length: responseLength,
            sample_comment: "Your thread on AI was mind-blowing! Would love to see more content like this 🚀",
            generated_response: "Thanks for the amazing feedback! 🙌 More AI content coming your way next week. Any specific aspects you'd like me to dive into? Always love hearing from the community! #AI #Tech",
            engagement_tips: "Include relevant hashtags and ask follow-up questions"
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
      // TODO: Implement actual API call
      // Simulated response for now
      const response: ResponseGeneration = {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        platform: 'twitter',
        generation_type: 'custom',
        responses: [
          {
            comment_type: 'custom',
            response_tone: 'custom',
            response_length: 'medium',
            sample_comment: customPrompt,
            generated_response: "Appreciate your insights! 🎯 Your perspective adds so much value to the conversation. Let's connect and discuss more - DM me anytime! #CommunityFirst",
            engagement_tips: "Encourage DMs for deeper conversations"
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const deleteResponse = async (responseId: string) => {
    try {
      // TODO: Implement actual API call
      setHistory(prev => prev.filter(item => item.id !== responseId));
      toast.success("Response deleted successfully");
    } catch (error) {
      toast.error("Failed to delete response");
    }
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
            <p className="text-sm text-muted-foreground">🐦 Sample Tweet</p>
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

  return (
    <ToolLayout>
      <ToolTitle 
        title="Twitter Comment Automation 🐦" 
        description="Generate engaging responses to tweets, mentions, and replies"
      />
      
      <div className="space-y-8">
        <Tabs defaultValue="preferences" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              Custom
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Response Preferences</h2>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comment Type</label>
                    <Select value={commentType} onValueChange={setCommentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Tone</label>
                    <Select value={responseTone} onValueChange={setResponseTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESPONSE_TONES.map(tone => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Length</label>
                    <Select value={responseLength} onValueChange={setResponseLength}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESPONSE_LENGTHS.map(length => (
                          <SelectItem key={length.value} value={length.value}>
                            {length.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={generateFromPreferences}
                  disabled={loading || (!commentType || !responseTone || !responseLength)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Responses...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Generate Responses
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Custom Tab */}
          <TabsContent value="custom">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <PenLine className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Custom Response Requirements</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Describe the type of tweets you want to respond to and how you'd like to respond. Include any specific requirements or style preferences.
                  </p>
                  <Textarea
                    placeholder="E.g., 'I want to respond to tweets discussing AI technology with informative but concise replies that include relevant hashtags and encourage further discussion.'"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <Button
                    className="w-full"
                    onClick={generateCustomResponses}
                    disabled={loading || !customPrompt.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Custom Responses...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Generate Custom Responses
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Loading State */}
        {loading && (
          <LoadingModal 
            progress={loadingProgress} 
            message={loadingMessages[loadingMessageIndex]}
          />
        )}

        {/* Generated Responses Section */}
        {currentResponses && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Generated Responses</h2>
              </div>
              {currentResponses.preferences && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentResponses.preferences.comment_type}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentResponses.preferences.response_tone}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentResponses.preferences.response_length}</span>
                </div>
              )}
            </div>
            <div className="grid gap-6">
              {currentResponses.responses.map((response, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {renderResponse(response)}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Response History</h2>
            </div>
          </div>

          {history.length > 0 ? (
            <div className="grid gap-6">
              {history.map((item) => (
                <Card 
                  key={item.id} 
                  className="p-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatDate(item.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCurrentResponses(item)}
                          title="View Details"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteResponse(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-4">
                      {item.responses.slice(0, 1).map((response, index) => (
                        <div key={index} className="space-y-2">
                          {response.sample_comment && (
                            <p className="text-sm text-muted-foreground italic">
                              "{response.sample_comment}"
                            </p>
                          )}
                          <p className="text-sm line-clamp-2">{response.generated_response}</p>
                        </div>
                      ))}
                    </div>

                    {/* View More Button */}
                    {item.responses.length > 1 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2 hover:bg-secondary/50"
                        onClick={() => setCurrentResponses(item)}
                      >
                        View all responses
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-card/50 backdrop-blur-sm">
              <div className="space-y-3">
                <History className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No Response History</h3>
                <p className="text-sm text-muted-foreground">
                  Generate your first response using the tools above!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
} 