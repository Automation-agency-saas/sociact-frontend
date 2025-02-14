import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Loader2, Trash2, History, Sparkles, Wand2, MessageSquare, Clock, Settings, PenLine, Lightbulb, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
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

interface LinkedInIdea {
  title: string;
  content: string;
  key_points?: string[];
  hashtags?: string[];
  engagement_strategy?: string;
}

interface LinkedInIdeaGeneration extends IdeaGeneration {
  ideas: LinkedInIdea[];
  preferences: {
    post_type: string;
    topic: string;
    tone_of_voice: string;
  };
}

export function LinkedInIdeaGeneratorPage() {
  const [currentIdeas, setCurrentIdeas] = useState<LinkedInIdea[]>([]);
  const [history, setHistory] = useState<LinkedInIdeaGeneration[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [preferences, setPreferences] = useState({
    post_type: '',
    topic: '',
    tone_of_voice: ''
  });

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Simulate loading progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          // Slower increment for longer API time
          const increment = prev < 30 ? 0.7 : // Initial phase
                          prev < 60 ? 0.5 : // Middle phase
                          prev < 80 ? 0.3 : // Later phase
                          0.1; // Final phase
          return Math.round((prev + increment) * 10) / 10; // Round to 1 decimal place
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

  const loadHistory = async () => {
    try {
      const response = await ideaGeneratorService.getHistory('linkedin');
      setHistory(response.items as LinkedInIdeaGeneration[]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences.post_type || !preferences.topic || !preferences.tone_of_voice) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }
    
    setLoading(true);
    try {
      const response = await ideaGeneratorService.generateFromPreferences('linkedin', preferences) as LinkedInIdeaGeneration;
      setCurrentIdeas(response.ideas);
      setHistory(prev => [response, ...prev]);
      toast.success("Ideas generated successfully!");
    } catch (error: any) {
      // console.error('Error generating ideas:', error);
      toast.error(error.message || 'Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (field: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCustomIdeas = async () => {
    if (!preferences.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setLoading(true);
    try {
      const response = await ideaGeneratorService.generateCustom('linkedin', preferences.topic) as LinkedInIdeaGeneration;
      setCurrentIdeas(response.ideas);
      setHistory(prev => [response, ...prev]);
      toast.success("Custom ideas generated successfully!");
    } catch (error: any) {
      // console.error('Error generating custom ideas:', error);
      toast.error(error.message || 'Failed to generate custom ideas');
    } finally {
      setLoading(false);
    }
  };

  const generateSurpriseIdeas = async () => {
    setLoading(true);
    try {
      const response = await ideaGeneratorService.generateSurprise('linkedin') as LinkedInIdeaGeneration;
      setCurrentIdeas(response.ideas);
      setHistory(prev => [response, ...prev]);
      toast.success("Surprise ideas generated!");
    } catch (error: any) {
      // console.error('Error generating surprise ideas:', error);
      toast.error(error.message || 'Failed to generate surprise ideas');
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

  const renderIdea = (idea: LinkedInIdea) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-medium">{idea.title}</p>
              <p className="text-muted-foreground whitespace-pre-wrap">{idea.content}</p>
            </div>

            {/* Key Points */}
            {idea.key_points && idea.key_points.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">🎯 Key Points</p>
                <div className="space-y-1">
                  {idea.key_points.map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-primary font-medium">•</span>
                      <p className="text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Strategy */}
            {idea.engagement_strategy && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">💡 Engagement Strategy</p>
                <p className="text-sm">{idea.engagement_strategy}</p>
              </div>
            )}

            {/* Hashtags */}
            {idea.hashtags && idea.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {idea.hashtags.map((tag, i) => (
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
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(`${idea.title}\n\n${idea.content}`)}
          className="shrink-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );

  return (
    <ToolLayout>
      <ToolTitle 
        title="LinkedIn Post Generator ✨" 
        description="Generate engaging post ideas that grow your professional network"
      />
      
      <div className="space-y-8 pb-20 max-w-7xl mx-auto">
        <Tabs defaultValue="preferences" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-primary" />
              Custom
            </TabsTrigger>
            <TabsTrigger value="surprise" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Surprise Me
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Select
                  value={preferences.post_type}
                  onValueChange={(value) => handlePreferenceChange('post_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Select
                  value={preferences.topic}
                  onValueChange={(value) => handlePreferenceChange('topic', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_FOCUS.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Select
                  value={preferences.tone_of_voice}
                  onValueChange={(value) => handlePreferenceChange('tone_of_voice', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone of voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_AUDIENCES.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={handlePreferencesSubmit}
                disabled={loading || !preferences.post_type || !preferences.topic || !preferences.tone_of_voice}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Ideas
                  </>
                )}
              </Button>
            </div>
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
                    value={preferences.topic}
                    onChange={(e) => handlePreferenceChange('topic', e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <Button
                    className="w-full"
                    onClick={generateCustomIdeas}
                    disabled={loading || !preferences.topic.trim()}
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
                    onClick={generateSurpriseIdeas}
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
        {currentIdeas.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Generated Ideas</h2>
              </div>
            </div>
            <div className="grid gap-6">
              {currentIdeas.map((idea, index) => (
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
                          onClick={() => {
                            setCurrentIdeas(item.ideas);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          title="View Details"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            try {
                              await ideaGeneratorService.deleteIdea('linkedin', item.id);
                              toast.success("Idea deleted successfully");
                              setHistory(prev => prev.filter(h => h.id !== item.id));
                            } catch (error: any) {
                              toast.error(error.message || 'Failed to delete idea');
                            }
                          }}
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
                          <h3 className="text-lg font-medium">{idea.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{idea.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* View More Button */}
                    {item.ideas.length > 1 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2 hover:bg-secondary/50"
                        onClick={() => {
                          setCurrentIdeas(item.ideas);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
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