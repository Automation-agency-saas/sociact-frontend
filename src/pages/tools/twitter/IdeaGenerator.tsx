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
const THREAD_TYPES = [
  { value: 'personal_story', label: '📖 Personal Story' },
  { value: 'industry_insight', label: '💡 Industry Insight' },
  { value: 'educational', label: '📚 Educational Breakdown' },
  { value: 'hot_take', label: '🔥 Hot Take & Opinion' },
  { value: 'case_study', label: '📊 Case Study' },
  { value: 'listicle', label: '📝 Listicle' },
  { value: 'trend_analysis', label: '📈 Twitter Trend Analysis' }
];

const TOPICS = [
  { value: 'startups', label: '🚀 Startups & Entrepreneurship' },
  { value: 'ai_tech', label: '🤖 AI & Tech' },
  { value: 'finance', label: '💰 Finance & Investing' },
  { value: 'productivity', label: '⚡ Productivity & Self-Improvement' },
  { value: 'marketing', label: '📢 Marketing & Growth Hacks' },
  { value: 'fitness', label: '💪 Fitness & Wellness' },
  { value: 'personal_branding', label: '👤 Personal Branding' }
];

const TONE_OF_VOICE = [
  { value: 'professional', label: '👔 Professional & Informative' },
  { value: 'conversational', label: '💬 Conversational & Engaging' },
  { value: 'thought_provoking', label: '🤔 Thought-Provoking & Controversial' }
];

const loadingMessages = [
  "Analyzing Twitter trends...",
  "Crafting engaging threads...",
  "Optimizing for virality...",
  "Adding hooks and CTAs...",
  "Finalizing your thread ideas..."
];

interface TwitterIdea {
  hook: string;
  outline: string[];
  engagement_hooks?: string;
  hashtags?: string[];
}

interface TwitterIdeaGeneration extends IdeaGeneration {
  ideas: TwitterIdea[];
  preferences: {
    thread_type: string;
    topic: string;
    tone_of_voice: string;
  };
  thread_type?: string;
  topic?: string;
  tone_of_voice?: string;
}

export function TwitterIdeaGeneratorPage() {
  // Form states
  const [threadType, setThreadType] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Loading and results states
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [currentIdeas, setCurrentIdeas] = useState<TwitterIdeaGeneration | null>(null);
  const [history, setHistory] = useState<TwitterIdeaGeneration[]>([]);

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
      const response = await ideaGeneratorService.getHistory('twitter');
      if (response && response.items) {
        setHistory(response.items as TwitterIdeaGeneration[]);
      } else {
        // console.warn('History response is missing items array');
        setHistory([]);
      }
    } catch (error: any) {
      // console.error('Error loading history:', error);
      toast.error(error.message || 'Failed to load history');
      setHistory([]);
    }
  };

  const generateFromPreferences = async () => {
    if (!threadType || !topic || !tone) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }

    setLoading(true);
    try {
      const response = await ideaGeneratorService.generateFromPreferences('twitter', {
        thread_type: threadType,
        topic,
        tone_of_voice: tone
      });
      
      setCurrentIdeas(response as TwitterIdeaGeneration);
      setHistory(prev => [response as TwitterIdeaGeneration, ...prev]);
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
      const response = await ideaGeneratorService.generateCustom('twitter', customPrompt);
      setCurrentIdeas(response as TwitterIdeaGeneration);
      setHistory(prev => [response as TwitterIdeaGeneration, ...prev]);
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
      const response = await ideaGeneratorService.generateSurprise('twitter');
      setCurrentIdeas(response as TwitterIdeaGeneration);
      setHistory(prev => [response as TwitterIdeaGeneration, ...prev]);
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
      await ideaGeneratorService.deleteIdea('twitter', ideaId);
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

  const renderIdea = (idea: TwitterIdea) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-medium">{idea.hook}</p>
              <div className="space-y-2">
                {idea.outline.map((point: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-primary font-medium">{i + 1}.</span>
                    <p className="text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Hooks */}
            {idea.engagement_hooks && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">🎯 Engagement Hooks</p>
                <p className="text-sm">{idea.engagement_hooks}</p>
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
          onClick={() => copyToClipboard(`${idea.hook}\n\n${idea.outline.map((point: string, i: number) => `${i + 1}. ${point}`).join('\n')}`)}
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
        title="Twitter Thread Generator ✨" 
        description="Generate viral thread ideas that grow your audience"
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
                    <label className="text-sm font-medium">Thread Type</label>
                    <Select value={threadType} onValueChange={setThreadType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select thread type" />
                      </SelectTrigger>
                      <SelectContent>
                        {THREAD_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topic/Niche</label>
                    <Select value={topic} onValueChange={setTopic}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOPICS.map(topic => (
                          <SelectItem key={topic.value} value={topic.value}>
                            {topic.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Tone of Voice</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONE_OF_VOICE.map(tone => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={generateFromPreferences}
                  disabled={loading || (!threadType || !topic || !tone)}
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
                    Describe your thread idea in detail. Include any specific requirements, themes, or elements you want to incorporate.
                  </p>
                  <Textarea
                    placeholder="E.g., 'I want to create a viral thread about productivity hacks for entrepreneurs, focusing on practical tips and real examples...'"
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
                        Let AI surprise you with unique and viral thread ideas! Perfect when you're looking for fresh, unexpected content inspiration.
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.thread_type}</span>
                    <span>•</span>
                    <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.topic}</span>
                    <span>•</span>
                    <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.tone_of_voice}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-4">
                {currentIdeas.ideas.map((idea: TwitterIdea, index: number) => (
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
          </Card>
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
                      {item.ideas && item.ideas.length > 0 && item.ideas.slice(0, 1).map((idea, index) => (
                        <div key={index} className="space-y-2">
                          <p className="text-lg font-medium">{idea.hook}</p>
                          {idea.outline && idea.outline.length > 0 && (
                            <div className="space-y-1">
                              {idea.outline.slice(0, 2).map((point, i) => (
                                <p key={i} className="text-sm text-muted-foreground">
                                  {i + 1}. {point}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* View More Button */}
                    {item.ideas && item.ideas.length > 1 && (
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
                  Generate your first thread using the tools above!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
} 