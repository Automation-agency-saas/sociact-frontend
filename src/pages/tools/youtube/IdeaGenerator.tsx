import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Loader2, Trash2, History, Sparkles, Wand2, MessageSquare, Clock, Settings, PenLine, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { containerVariants, itemVariants, cardHoverVariants } from '../../../lib/animations';
import { youtubeService, type YouTubeIdea, type YouTubeIdeaResponse } from '../../../lib/services/youtube';
import { Separator } from '../../../components/ui/separator';
import { LoadingModal } from "@/components/ui/loading-modal";
import { ToolTitle } from "@/components/ui/tool-title";
import { ToolLayout } from "@/components/tool-page/ToolLayout";

// Constants for dropdowns
const GENRES = [
  { value: 'tech', label: '💻 Technology' },
  { value: 'gaming', label: '🎮 Gaming' },
  { value: 'education', label: '📚 Education' },
  { value: 'lifestyle', label: '🌟 Lifestyle' },
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'cooking', label: '🍳 Cooking' },
  { value: 'business', label: '💼 Business' },
  { value: 'entertainment', label: '🎬 Entertainment' }
];

const TARGET_AUDIENCES = [
  { value: 'general', label: '👥 General' },
  { value: 'beginners', label: '🌱 Beginners' },
  { value: 'intermediate', label: '📈 Intermediate' },
  { value: 'advanced', label: '🎯 Advanced' },
  { value: 'professionals', label: '👔 Professionals' },
  { value: 'students', label: '🎓 Students' }
];

const VIDEO_TYPES = [
  { value: 'tutorial', label: '📝 Tutorial' },
  { value: 'review', label: '⭐ Review' },
  { value: 'vlog', label: '📹 Vlog' },
  { value: 'howto', label: '🔧 How-To Guide' },
  { value: 'comparison', label: '⚖️ Comparison' },
  { value: 'challenge', label: '🏆 Challenge' }
];

const FOCUS_AREAS = [
  { value: 'trending', label: '🔥 Trending Topics' },
  { value: 'evergreen', label: '🌲 Evergreen Content' },
  { value: 'viral', label: '🚀 High Viral Potential' },
  { value: 'seo', label: '🔍 SEO-Focused' },
  { value: 'educational', label: '📖 Educational' }
];

export function YouTubeIdeaGeneratorPage() {
  // Form states
  const [genre, setGenre] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [videoType, setVideoType] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Loading and results states
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [currentIdeas, setCurrentIdeas] = useState<YouTubeIdeaResponse | null>(null);
  const [history, setHistory] = useState<YouTubeIdeaResponse[]>([]);

  const loadingMessages = [
    "Analyzing your preferences...",
    "Exploring trending topics...",
    "Crafting unique ideas...",
    "Adding creative touches...",
    "Finalizing your suggestions..."
  ];

  // Simulate loading progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
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
  }, [loading]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await youtubeService.getIdeaHistory();
      setHistory(response.items);
    } catch (error) {
      toast.error("Failed to load idea history");
    }
  };

  const generateFromPreferences = async () => {
    if (!genre || !targetAudience || !videoType || !focusArea) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }

    setLoading(true);
    try {
      const response = await youtubeService.generateIdeasFromPreferences({
        genre,
        target_audience: targetAudience,
        video_type: videoType,
        focus_area: focusArea
      });
      setCurrentIdeas(response);
      setHistory(prev => [response, ...prev]);
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
      const response = await youtubeService.generateCustomIdeas({
        prompt: customPrompt
      });
      setCurrentIdeas(response);
      setHistory(prev => [response, ...prev]);
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
      const response = await youtubeService.generateSurpriseIdeas();
      setCurrentIdeas(response);
      setHistory(prev => [response, ...prev]);
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
      await youtubeService.deleteIdea(ideaId);
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

  const renderIdeas = (ideas: YouTubeIdea[]) => (
    <motion.div variants={containerVariants} className="space-y-3">
      {ideas.map((idea, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover="hover"
          className="relative"
        >
          <Card className="p-4 cursor-pointer group bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <motion.div variants={cardHoverVariants}>
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-semibold text-lg">{idea.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(idea.title)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground">{idea.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {idea.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {idea.estimated_duration}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {idea.engagement}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>🎨 Thumbnail:</strong> {idea.thumbnail_suggestion}
                </div>
                <div className="flex flex-wrap gap-1">
                  {idea.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors"
                      onClick={() => copyToClipboard(tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
  <ToolLayout>
      <ToolTitle 
        title="YouTube Idea Generator ✨" 
        description="Generate engaging video ideas for your YouTube channel"
      />
      
      <div className="space-y-8">
        <Tabs defaultValue="preferences" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4 py-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <PenLine className="h-4 w-4 py-2" />
              Custom
            </TabsTrigger>
            <TabsTrigger value="surprise" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 py-2" />
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
                    <label className="text-sm font-medium">Genre/Niche</label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRES.map(genre => (
                          <SelectItem key={genre.value} value={genre.value}>
                            {genre.label}
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
                    <label className="text-sm font-medium">Video Type</label>
                    <Select value={videoType} onValueChange={setVideoType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {VIDEO_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Focus Area</label>
                    <Select value={focusArea} onValueChange={setFocusArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select focus" />
                      </SelectTrigger>
                      <SelectContent>
                        {FOCUS_AREAS.map(focus => (
                          <SelectItem key={focus.value} value={focus.value}>
                            {focus.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={generateFromPreferences}
                  disabled={loading || (!genre || !targetAudience || !videoType || !focusArea)}
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
                    Describe your video idea in detail. Include any specific requirements, themes, or elements you want to incorporate.
                  </p>
                  <Textarea
                    placeholder="E.g., 'I want to create engaging tech tutorials for beginners focusing on latest smartphone features. The content should be easy to follow and include practical examples.'"
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
                        Let AI surprise you with unique and viral video ideas! Perfect when you're looking for fresh, unexpected content inspiration.
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
                    {currentIdeas.genre} • {currentIdeas.target_audience} • {currentIdeas.video_type} • {currentIdeas.focus_area}
                  </div>
                )}
              </div>
              {renderIdeas(currentIdeas.ideas)}
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
                          {item.genre} • {item.target_audience} • {item.video_type} • {item.focus_area}
                        </div>
                      )}
                    </div>
                    {renderIdeas(item.ideas.slice(0, 2))}
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