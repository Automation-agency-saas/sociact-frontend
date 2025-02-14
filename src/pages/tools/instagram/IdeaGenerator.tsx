import { useState, useEffect } from 'react';
import { Copy, Loader2, Trash2, History, Sparkles, Wand2, MessageSquare, Clock, Settings, PenLine, Lightbulb, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '../../../components/tool-page/ToolLayout';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { LoadingModal } from "@/components/ui/loading-modal";
import { ToolTitle } from "@/components/ui/tool-title";
import { ideaGeneratorService, type IdeaGeneration } from '../../../lib/services/idea-generator';
import { motion } from 'framer-motion';

// Constants for dropdowns
const CONTENT_TYPES = [
  { value: 'trending_challenge', label: '🎯 Trending Challenge' },
  { value: 'behind_scenes', label: '🎬 Behind the Scenes' },
  { value: 'quick_tutorial', label: '📝 Quick Tutorial' },
  { value: 'transformation', label: '✨ Transformation (Before/After)' },
  { value: 'pov', label: '👀 POV (Point of View)' },
  { value: 'meme', label: '😂 Meme/Reaction Video' },
  { value: 'mini_vlog', label: '📹 Mini Vlog' }
];

const NICHES = [
  { value: 'fashion_beauty', label: '👗 Fashion & Beauty' },
  { value: 'fitness_health', label: '💪 Fitness & Health' },
  { value: 'food_cooking', label: '🍳 Food & Cooking' },
  { value: 'tech_gadgets', label: '📱 Tech & Gadgets' },
  { value: 'travel_adventure', label: '✈️ Travel & Adventure' },
  { value: 'business_finance', label: '💼 Business & Finance' },
  { value: 'motivation', label: '🌟 Motivation & Self-improvement' },
  { value: 'educational', label: '📚 Educational & How-To' }
];

const TARGET_AUDIENCES = [
  { value: 'gen_z', label: '🎮 Teens (Gen Z)' },
  { value: 'millennials', label: '📱 Millennials' },
  { value: 'professionals', label: '💼 Professionals' },
  { value: 'general', label: '👥 General Audience' }
];

const ENGAGEMENT_STYLES = [
  { value: 'fun', label: '🎉 Fun & Entertaining' },
  { value: 'informative', label: '📚 Informative' },
  { value: 'emotional', label: '❤️ Emotional/Relatable' },
  { value: 'sales', label: '💰 Sales/Marketing Focused' }
];

const loadingMessages = [
  "Analyzing Instagram trends...",
  "Identifying viral potential...",
  "Crafting engaging ideas...",
  "Optimizing for Instagram...",
  "Finalizing your content ideas..."
];

// Update the type references
interface InstagramIdea {
  content: string;
  visual_elements?: string;
  caption?: string;
  hashtags?: string;
  engagement_strategy?: string;
}

interface InstagramPreferences {
  content_type: string;
  niche: string;
  target_audience: string;
  engagement_style: string;
}

interface InstagramIdeaGeneration extends IdeaGeneration {
  ideas: InstagramIdea[];
  preferences: {
    content_type: string;
    niche: string;
    target_audience: string;
    engagement_style: string;
  };
}

export function InstagramIdeaGeneratorPage() {
  // Form states
  const [contentType, setContentType] = useState('');
  const [niche, setNiche] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [engagementStyle, setEngagementStyle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Loading and results states
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [currentIdeas, setCurrentIdeas] = useState<InstagramIdeaGeneration | null>(null);
  const [history, setHistory] = useState<InstagramIdeaGeneration[]>([]);

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
      const response = await ideaGeneratorService.getHistory('instagram');
      setHistory(response.items as InstagramIdeaGeneration[]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const generateFromPreferences = async () => {
    if (!contentType || !niche || !targetAudience || !engagementStyle) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }

    setLoading(true);
    try {
      const response = await ideaGeneratorService.generateFromPreferences('instagram', {
        content_type: contentType,
        niche,
        target_audience: targetAudience,
        engagement_style: engagementStyle
      });
      
      setCurrentIdeas(response as InstagramIdeaGeneration);
      setHistory(prev => [response as InstagramIdeaGeneration, ...prev]);
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
      const response = await ideaGeneratorService.generateCustom('instagram', customPrompt);
      setCurrentIdeas(response as InstagramIdeaGeneration);
      setHistory(prev => [response as InstagramIdeaGeneration, ...prev]);
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
      const response = await ideaGeneratorService.generateSurprise('instagram');
      setCurrentIdeas(response as InstagramIdeaGeneration);
      setHistory(prev => [response as InstagramIdeaGeneration, ...prev]);
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
      await fetch(`/api/instagram/ideas/${ideaId}`, { method: 'DELETE' });
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

  const renderIdea = (idea: InstagramIdea) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Content Section */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <p className="text-base">{idea.content}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(idea.content)}
            className="shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Visual Elements */}
        {idea.visual_elements && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">🎨 Visual Elements</p>
            <p className="text-sm">{idea.visual_elements}</p>
          </div>
        )}

        {/* Caption */}
        {idea.caption && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">📝 Caption</p>
            <p className="text-sm">{idea.caption}</p>
          </div>
        )}

        {/* Engagement Strategy */}
        {idea.engagement_strategy && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">🎯 Engagement Strategy</p>
            <p className="text-sm">{idea.engagement_strategy}</p>
          </div>
        )}

        {/* Hashtags */}
        {idea.hashtags && (
          <div className="flex flex-wrap gap-2">
            {idea.hashtags.split(' ').map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                onClick={() => copyToClipboard(tag)}
              >
                {tag}
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
        title="Instagram Content Idea Generator ✨" 
        description="Generate engaging content ideas for your Instagram"
      />
      
      <div className="space-y-8 pb-20 max-w-7xl mx-auto">
        <Tabs defaultValue="preferences" className="space-y-8 ">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary " />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-primary " />
              Custom
            </TabsTrigger>
            <TabsTrigger value="surprise" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary " />
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
                    <label className="text-sm font-medium">Content Type</label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Niche/Category</label>
                    <Select value={niche} onValueChange={setNiche}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select niche" />
                      </SelectTrigger>
                      <SelectContent>
                        {NICHES.map(niche => (
                          <SelectItem key={niche.value} value={niche.value}>
                            {niche.label}
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
                    <label className="text-sm font-medium">Engagement Style</label>
                    <Select value={engagementStyle} onValueChange={setEngagementStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {ENGAGEMENT_STYLES.map(style => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={generateFromPreferences}
                  disabled={loading || (!contentType || !niche || !targetAudience || !engagementStyle)}
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
                    Describe your content idea in detail. Include any specific requirements, themes, or elements you want to incorporate.
                  </p>
                  <Textarea
                    placeholder="E.g., 'I want to create engaging Instagram Reels about sustainable fashion tips for eco-conscious millennials...'"
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
                        Let AI surprise you with unique and viral Instagram content ideas! Perfect when you're looking for fresh, unexpected content inspiration.
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
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.content_type}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.niche}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.target_audience}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">{currentIdeas.preferences.engagement_style}</span>
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
                          <p className="text-base">{idea.content}</p>
                          {idea.engagement_strategy && (
                            <p className="text-sm text-muted-foreground">
                              {idea.engagement_strategy}
                            </p>
                          )}
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
                  Generate your first idea using the tools above!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
} 