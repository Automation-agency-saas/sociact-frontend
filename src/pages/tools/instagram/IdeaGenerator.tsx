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
  const [currentIdeas, setCurrentIdeas] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/instagram/ideas/history');
      const data = await response.json();
      setHistory(data.items);
    } catch (error) {
      toast.error("Failed to load idea history");
    }
  };

  const generateFromPreferences = async () => {
    if (!contentType || !niche || !targetAudience || !engagementStyle) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/instagram/ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: contentType,
          niche,
          target_audience: targetAudience,
          engagement_style: engagementStyle
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
      const response = await fetch('/api/instagram/ideas/custom', {
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
      const response = await fetch('/api/instagram/ideas/surprise');
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

  return (
    <ToolLayout>
      <ToolTitle 
        title="Instagram Content Idea Generator ✨" 
        description="Generate engaging content ideas for your Instagram"
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
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Generated Ideas</h2>
                </div>
                {currentIdeas.generation_type === 'preferences' && (
                  <div className="text-sm text-muted-foreground">
                    {currentIdeas.content_type} • {currentIdeas.niche} • {currentIdeas.target_audience} • {currentIdeas.engagement_style}
                  </div>
                )}
              </div>
              <div className="grid gap-4">
                {currentIdeas.ideas.map((idea: any, index: number) => (
                  <Card key={index} className="p-4 relative group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base">{idea.content}</p>
                          {idea.hashtags && (
                            <p className="text-sm text-muted-foreground">
                              {idea.hashtags}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(idea.content)}
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
                          {item.content_type} • {item.niche} • {item.target_audience} • {item.engagement_style}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {item.ideas.slice(0, 2).map((idea: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">{idea.content}</p>
                        </div>
                      ))}
                      {item.ideas.length > 2 && (
                        <Button
                          variant="ghost"
                          className="w-full text-muted-foreground hover:text-primary"
                          onClick={() => setCurrentIdeas(item)}
                        >
                          View {item.ideas.length - 2} more ideas
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