import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Loader2, Trash2, History, Sparkles, Wand2, MessageSquare, Clock, Settings, PenLine, Lightbulb, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { ToolLayout } from '../../../components/tool-page/ToolLayout';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { containerVariants, itemVariants, cardHoverVariants } from '../../../lib/animations';
import { LoadingModal } from "@/components/ui/loading-modal";
import { ToolTitle } from "@/components/ui/tool-title";
import { ideaGeneratorService, type IdeaGeneration } from '../../../lib/services/idea-generator';

// Constants for dropdowns
const POST_TYPES = [
  { value: 'career_story', label: '📖 Personal Career Story' },
  { value: 'industry_trends', label: '📈 Industry Trends & Insights' },
  { value: 'lessons_learned', label: '🎓 Lessons Learned' },
  { value: 'how_to', label: '📝 How-To or Guide' },
  { value: 'announcement', label: '📢 Company/Product Announcement' },
  { value: 'job_advice', label: '💼 Job-Related Advice' },
  { value: 'networking', label: '🤝 Networking & Collaboration Opportunity' }
];

const TARGET_AUDIENCES = [
  { value: 'job_seekers', label: '🔍 Job Seekers' },
  { value: 'entrepreneurs', label: '🚀 Entrepreneurs' },
  { value: 'business_owners', label: '💼 Business Owners' },
  { value: 'corporate', label: '👔 Corporate Professionals' },
  { value: 'students', label: '📚 Students & Interns' }
];

const CONTENT_FOCUS = [
  { value: 'motivation', label: '🌟 Motivation & Career Growth' },
  { value: 'business_strategy', label: '📊 Business Strategy & Startups' },
  { value: 'ai_tech', label: '🤖 AI & Tech Innovations' },
  { value: 'work_culture', label: '🏢 Work Culture & Productivity' },
  { value: 'marketing', label: '📢 Marketing & Sales' }
];

const ENGAGEMENT_GOALS = [
  { value: 'inspire', label: '✨ Inspire & Motivate' },
  { value: 'educate', label: '📚 Educate & Share Knowledge' },
  { value: 'discuss', label: '💬 Start a Discussion' },
  { value: 'promote', label: '📣 Promote a Service or Product' }
];

const loadingMessages = [
  "Analyzing LinkedIn trends...",
  "Identifying professional insights...",
  "Crafting engaging content...",
  "Optimizing for engagement...",
  "Finalizing your post ideas..."
];

interface LinkedInPost {
  headline: string;
  content: string;
  hashtags?: string;
}

interface LinkedInIdeaGeneration extends IdeaGeneration {
  ideas: LinkedInPost[];
  preferences: {
    post_type: string;
    target_audience: string;
    content_focus: string;
    engagement_goal: string;
  };
  post_type?: string;
  target_audience?: string;
  content_focus?: string;
  engagement_goal?: string;
}

export function LinkedInIdeaGeneratorPage() {
  // Form states
  const [postType, setPostType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentFocus, setContentFocus] = useState('');
  const [engagementGoal, setEngagementGoal] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Loading and results states
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [currentIdeas, setCurrentIdeas] = useState<LinkedInIdeaGeneration | null>(null);
  const [history, setHistory] = useState<LinkedInIdeaGeneration[]>([]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await ideaGeneratorService.getHistory('linkedin');
      setHistory(response.items as LinkedInIdeaGeneration[]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const generateFromPreferences = async () => {
    if (!postType || !targetAudience || !contentFocus || !engagementGoal) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }

    setLoading(true);
    try {
      const response = await ideaGeneratorService.generateFromPreferences('linkedin', {
        post_type: postType,
        target_audience: targetAudience,
        content_focus: contentFocus,
        engagement_goal: engagementGoal
      });
      
      setCurrentIdeas(response as LinkedInIdeaGeneration);
      setHistory(prev => [response as LinkedInIdeaGeneration, ...prev]);
      toast.success("Ideas generated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCustomIdeas = async () => {
    if (!customPrompt.trim()) {
      toast.error("Please enter your custom idea description");
      return;
    }

    setLoading(true);
    try {
      const response = await ideaGeneratorService.generateCustom('linkedin', customPrompt);
      setCurrentIdeas(response as LinkedInIdeaGeneration);
      setHistory(prev => [response as LinkedInIdeaGeneration, ...prev]);
      toast.success("Custom ideas generated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSurprise = async () => {
    setLoading(true);
    try {
      const response = await ideaGeneratorService.generateSurprise('linkedin');
      setCurrentIdeas(response as LinkedInIdeaGeneration);
      setHistory(prev => [response as LinkedInIdeaGeneration, ...prev]);
      toast.success("Surprise ideas generated!");
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

  const deleteIdea = async (ideaId: string) => {
    try {
      await ideaGeneratorService.deleteIdea('linkedin', ideaId);
      setHistory(prev => prev.filter(item => item.id !== ideaId));
      toast.success("Idea deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
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

  const renderIdea = (idea: LinkedInPost) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Title Section */}
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-semibold">{idea.headline}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(idea.headline)}
            className="shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-base">{idea.content}</p>
        </div>

        {/* Hashtags */}
        {idea.hashtags && (
          <div className="flex flex-wrap gap-2">
            {idea.hashtags.split(',').map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                onClick={() => copyToClipboard(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <ToolLayout>
      <ToolTitle 
        title="LinkedIn Post Generator ✨" 
        description="Generate engaging post ideas that grow your professional network"
      />
      
      <div className="space-y-8">
        <Tabs defaultValue="preferences" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              Custom
            </TabsTrigger>
            <TabsTrigger value="surprise" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Surprise Me
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Generate with Preferences</h2>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Post Type</label>
                    <Select value={postType} onValueChange={setPostType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select post type" />
                      </SelectTrigger>
                      <SelectContent>
                        {POST_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Audience</label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {TARGET_AUDIENCES.map(audience => (
                          <SelectItem key={audience.value} value={audience.value}>
                            {audience.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content Focus</label>
                    <Select value={contentFocus} onValueChange={setContentFocus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select focus" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_FOCUS.map(focus => (
                          <SelectItem key={focus.value} value={focus.value}>
                            {focus.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Engagement Goal</label>
                    <Select value={engagementGoal} onValueChange={setEngagementGoal}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        {ENGAGEMENT_GOALS.map(goal => (
                          <SelectItem key={goal.value} value={goal.value}>
                            {goal.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={generateFromPreferences}
                  disabled={loading || (!postType || !targetAudience || !contentFocus || !engagementGoal)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Ideas...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Ideas
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
                  <h2 className="text-xl font-semibold">Custom Description</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Describe your post idea in detail. Include any specific requirements, themes, or elements you want to incorporate.
                  </p>
                  <Textarea
                    placeholder="E.g., 'I want to create an engaging LinkedIn post about my recent career transition, focusing on key lessons learned and advice for others...'"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <Button
                    className="w-full"
                    onClick={generateCustomIdeas}
                    disabled={loading || !customPrompt.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Ideas...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Custom Ideas
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Surprise Tab */}
          <TabsContent value="surprise">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Surprise Me!</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center space-y-4 py-8">
                    <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Get Creative Inspiration</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Let AI surprise you with unique and engaging LinkedIn post ideas! Perfect when you're looking for fresh, professional content inspiration.
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={generateSurprise}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Surprise Ideas...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Surprise Me!
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

        {/* Generated Ideas Section */}
        {currentIdeas && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Generated Ideas</h2>
              </div>
              {currentIdeas.generation_type === 'preferences' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.post_type}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.target_audience}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.content_focus}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.engagement_goal}</span>
                </div>
              )}
            </div>
            <div className="grid gap-6">
              {currentIdeas.ideas.map((idea, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {renderIdea(idea)}
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
              <h2 className="text-xl font-semibold">Previously Generated Ideas</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadHistory}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              Refresh History
            </Button>
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
                          onClick={() => setCurrentIdeas(item)}
                          title="View Details"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteIdea(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-4">
                      {item.ideas.slice(0, 1).map((idea, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="text-lg font-medium">{idea.headline}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{idea.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* View More Button */}
                    {item.ideas.length > 1 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2 hover:bg-secondary/50"
                        onClick={() => setCurrentIdeas(item)}
                      >
                        View all generated ideas
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
                <h3 className="text-lg font-medium">No Previous Ideas</h3>
                <p className="text-sm text-muted-foreground">
                  Generate your first post using the tools above!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
} 