import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Loader2,
  Trash2,
  History,
  Sparkles,
  Wand2,
  MessageSquare,
  Clock,
  Settings,
  PenLine,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  ideaGeneratorService,
  type IdeaGeneration,
} from "../../../lib/services/idea-generator";
import { LoadingModal } from "@/components/ui/loading-modal";
import { ToolTitle } from "@/components/ui/tool-title";
import { ToolLayout } from "@/components/tool-page/ToolLayout";

// Constants for dropdowns
const GENRES = [
  { value: "tech", label: "💻 Technology" },
  { value: "gaming", label: "🎮 Gaming" },
  { value: "education", label: "📚 Education" },
  { value: "lifestyle", label: "🌟 Lifestyle" },
  { value: "fitness", label: "💪 Fitness" },
  { value: "cooking", label: "🍳 Cooking" },
  { value: "business", label: "💼 Business" },
  { value: "entertainment", label: "🎬 Entertainment" },
];

const TARGET_AUDIENCES = [
  { value: "general", label: "👥 General" },
  { value: "beginners", label: "🌱 Beginners" },
  { value: "intermediate", label: "📈 Intermediate" },
  { value: "advanced", label: "🎯 Advanced" },
  { value: "professionals", label: "👔 Professionals" },
  { value: "students", label: "🎓 Students" },
];

const VIDEO_TYPES = [
  { value: "tutorial", label: "📝 Tutorial" },
  { value: "review", label: "⭐ Review" },
  { value: "vlog", label: "📹 Vlog" },
  { value: "howto", label: "🔧 How-To Guide" },
  { value: "comparison", label: "⚖️ Comparison" },
  { value: "challenge", label: "🏆 Challenge" },
];

const FOCUS_AREAS = [
  { value: "trending", label: "🔥 Trending Topics" },
  { value: "evergreen", label: "🌲 Evergreen Content" },
  { value: "viral", label: "🚀 High Viral Potential" },
  { value: "seo", label: "🔍 SEO-Focused" },
  { value: "educational", label: "📖 Educational" },
];

interface YouTubeIdea {
  title: string;
  description: string;
  estimated_duration: string;
  key_talking_points?: string;
  engagement_potential?: string;
  thumbnail_suggestion: string;
  additional_content?: string;
  difficulty?: string;
  engagement?: string;
  tags?: string[];
}

interface YouTubeIdeaGeneration extends IdeaGeneration {
  ideas: YouTubeIdea[];
  preferences: {
    genre: string;
    target_audience: string;
    video_type: string;
    focus_area: string;
  };
}

export function YouTubeIdeaGeneratorPage() {
  // Form states
  const [genre, setGenre] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [videoType, setVideoType] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  // Loading and results states
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [currentIdeas, setCurrentIdeas] =
    useState<YouTubeIdeaGeneration | null>(null);
  const [history, setHistory] = useState<YouTubeIdeaGeneration[]>([]);

  const loadingMessages = [
    "Analyzing your preferences...",
    "Exploring trending topics...",
    "Crafting unique ideas...",
    "Adding creative touches...",
    "Finalizing your suggestions...",
  ];

  // Simulate loading progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          // Slower increment for longer API time
          const increment =
            prev < 30
              ? 0.7 // Initial phase
              : prev < 60
              ? 0.5 // Middle phase
              : prev < 80
              ? 0.3 // Later phase
              : 0.1; // Final phase
          return Math.round((prev + increment) * 10) / 10; // Round to 1 decimal place
        });

        setLoadingMessageIndex((prev) =>
          loadingProgress < 20
            ? 0
            : loadingProgress < 40
            ? 1
            : loadingProgress < 60
            ? 2
            : loadingProgress < 80
            ? 3
            : 4
        );
      }, 100);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
      setLoadingMessageIndex(0);
    }
  }, [loading, loadingProgress]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await ideaGeneratorService.getHistory("youtube");
      setHistory(response.items as YouTubeIdeaGeneration[]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const generateFromPreferences = async () => {
    if (!genre || !targetAudience || !videoType || !focusArea) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }

    setLoading(true);
    try {
      const response = await ideaGeneratorService.generateFromPreferences(
        "youtube",
        {
          genre,
          target_audience: targetAudience,
          video_type: videoType,
          focus_area: focusArea,
        }
      );

      setCurrentIdeas(response as YouTubeIdeaGeneration);
      setHistory((prev) => [response as YouTubeIdeaGeneration, ...prev]);
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
      const response = await ideaGeneratorService.generateCustom(
        "youtube",
        customPrompt
      );
      setCurrentIdeas(response as YouTubeIdeaGeneration);
      setHistory((prev) => [response as YouTubeIdeaGeneration, ...prev]);
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
      const response = await ideaGeneratorService.generateSurprise("youtube");
      setCurrentIdeas(response as YouTubeIdeaGeneration);
      setHistory((prev) => [response as YouTubeIdeaGeneration, ...prev]);
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
      await ideaGeneratorService.deleteIdea("youtube", ideaId);
      setHistory((prev) => prev.filter((item) => item.id !== ideaId));
      toast.success("Idea deleted successfully");
    } catch (error) {
      toast.error("Failed to delete idea");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderIdea = (idea: YouTubeIdea) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Title Section */}
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-semibold">{idea.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(idea.title)}
            className="shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Description */}
        {idea.description && (
          <p className="text-muted-foreground text-base">{idea.description}</p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">⏱️ Duration</p>
            <p className="font-medium">
              {idea.estimated_duration || "10-15 minutes"}
            </p>
          </div>
          {idea.engagement_potential && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">📈 Engagement</p>
              <p className="font-medium">{idea.engagement_potential}</p>
            </div>
          )}
        </div>

        {/* Key Points */}
        {idea.key_talking_points && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">🎯 Key Points</p>
            <p className="text-sm">{idea.key_talking_points}</p>
          </div>
        )}

        {/* Thumbnail */}
        {idea.thumbnail_suggestion && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              🎨 Thumbnail Suggestion
            </p>
            <p className="text-sm">{idea.thumbnail_suggestion}</p>
          </div>
        )}

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag, i) => (
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
        title="YouTube Idea Generator ✨"
        description="Generate engaging video ideas for your YouTube channel"
      />

      <div className="space-y-8 pb-20 max-w-7xl mx-auto">
        <Tabs defaultValue="preferences" className="space-y-8 ">
          <TabsList className="grid max-w-lg mx-auto grid-cols-3 ">
            <TabsTrigger
              value="preferences"
              className="flex justify-center items-center gap-2"
            >
              <Settings className="h-4 w-4 text-primary " />
              <span>
                Preferences
              </span>
              
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="flex justify-center items-center gap-2"
            >
              <PenLine className="h-4 w-4 text-primary " />
              Custom
            </TabsTrigger>
            <TabsTrigger
              value="surprise"
              className="flex justify-center items-center gap-2"
            >
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
                  <h2 className="text-xl font-semibold">
                    Generate with Preferences
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Genre/Niche</label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRES.map((genre) => (
                          <SelectItem key={genre.value} value={genre.value}>
                            {genre.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Target Audience
                    </label>
                    <Select
                      value={targetAudience}
                      onValueChange={setTargetAudience}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {TARGET_AUDIENCES.map((audience) => (
                          <SelectItem
                            key={audience.value}
                            value={audience.value}
                          >
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
                        {VIDEO_TYPES.map((type) => (
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
                        {FOCUS_AREAS.map((focus) => (
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
                  disabled={
                    loading ||
                    !genre ||
                    !targetAudience ||
                    !videoType ||
                    !focusArea
                  }
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
                    Describe your video idea in detail. Include any specific
                    requirements, themes, or elements you want to incorporate.
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
                      <h3 className="text-lg font-medium">
                        Get Creative Inspiration
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Let AI surprise you with unique and viral video ideas!
                        Perfect when you're looking for fresh, unexpected
                        content inspiration.
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
              {currentIdeas.generation_type === "preferences" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 rounded-full bg-secondary/50">
                    {currentIdeas.preferences.genre}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">
                    {currentIdeas.preferences.target_audience}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">
                    {currentIdeas.preferences.video_type}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-full bg-secondary/50">
                    {currentIdeas.preferences.focus_area}
                  </span>
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
              <h2 className="text-xl font-semibold">
                Previously Generated Ideas
              </h2>
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
                          <h3 className="text-lg font-semibold">
                            {idea.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2">
                            {idea.description}
                          </p>
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="text-primary">
                              {idea.estimated_duration}
                            </span>
                            {idea.engagement_potential && (
                              <>
                                <span>•</span>
                                <span className="text-primary">
                                  {idea.engagement_potential}
                                </span>
                              </>
                            )}
                          </div>
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
