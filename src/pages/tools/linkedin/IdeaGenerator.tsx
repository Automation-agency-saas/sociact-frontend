import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Loader2, Trash2, History, Sparkles, Wand2, MessageSquare, Clock, Settings, PenLine, Lightbulb } from 'lucide-react';
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
  const [currentIdeas, setCurrentIdeas] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/linkedin/ideas/history');
      const data = await response.json();
      setHistory(data.items);
    } catch (error) {
      toast.error("Failed to load idea history");
    }
  };

  const generateFromPreferences = async () => {
    if (!postType || !targetAudience || !contentFocus || !engagementGoal) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/linkedin/ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_type: postType,
          target_audience: targetAudience,
          content_focus: contentFocus,
          engagement_goal: engagementGoal
        })
      });
      
      const data = await response.json();
      setCurrentIdeas(data);
      setHistory(prev => [data, ...prev]);
      toast.success("Ideas generated successfully!");
    } catch (error) {
      toast.error("Failed to generate ideas");
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
      const response = await fetch('/api/linkedin/ideas/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt })
      });
      
      const data = await response.json();
      setCurrentIdeas(data);
      setHistory(prev => [data, ...prev]);
      toast.success("Custom ideas generated successfully!");
    } catch (error) {
      toast.error("Failed to generate custom ideas");
    } finally {
      setLoading(false);
    }
  };

  const generateSurprise = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/linkedin/ideas/surprise');
      const data = await response.json();
      setCurrentIdeas(data);
      setHistory(prev => [data, ...prev]);
      toast.success("Surprise ideas generated!");
    } catch (error) {
      toast.error("Failed to generate surprise ideas");
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
      await fetch(`/api/linkedin/ideas/${ideaId}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(item => item.id !== ideaId));
      toast.success("Idea deleted successfully");
    } catch (error) {
      toast.error("Failed to delete idea");
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
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Generated Ideas</h2>
                </div>
                {currentIdeas.generation_type === 'preferences' && (
                  <div className="text-sm text-muted-foreground">
                    {currentIdeas.post_type} • {currentIdeas.target_audience} • {currentIdeas.content_focus} • {currentIdeas.engagement_goal}
                  </div>
                )}
              </div>
              <div className="grid gap-4">
                {currentIdeas.posts.map((post: any, index: number) => (
                  <Card key={index} className="p-4 relative group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-base font-medium">{post.headline}</p>
                          <p className="text-sm text-muted-foreground">{post.content}</p>
                          {post.hashtags && (
                            <p className="text-sm text-primary">
                              {post.hashtags}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(`${post.headline}\n\n${post.content}\n\n${post.hashtags || ''}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Previously Generated Ideas</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadHistory}
              className="text-muted-foreground hover:text-primary"
            >
              <History className="mr-2 h-4 w-4" />
              Refresh History
            </Button>
          </div>

          {history.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {history.map((item) => (
                <Card key={item.id} className="p-4 relative group bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="absolute right-2 top-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentIdeas(item)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteIdea(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatDate(item.created_at)}
                      </div>
                      {item.generation_type === 'preferences' && (
                        <div className="text-sm text-muted-foreground">
                          {item.post_type} • {item.target_audience} • {item.content_focus} • {item.engagement_goal}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {item.posts.slice(0, 2).map((post: any, index: number) => (
                        <div key={index} className="space-y-1">
                          <p className="text-sm font-medium">{post.headline}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      ))}
                      {item.posts.length > 2 && (
                        <Button
                          variant="ghost"
                          className="w-full text-muted-foreground hover:text-primary"
                          onClick={() => setCurrentIdeas(item)}
                        >
                          View {item.posts.length - 2} more posts
                        </Button>
                      )}
                    </div>
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