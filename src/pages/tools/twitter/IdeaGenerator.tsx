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
  const [currentIdeas, setCurrentIdeas] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/twitter/ideas/history');
      const data = await response.json();
      setHistory(data.items);
    } catch (error) {
      toast.error("Failed to load idea history");
    }
  };

  const generateFromPreferences = async () => {
    if (!threadType || !topic || !tone) {
      toast.error("Please fill in all fields or use custom prompt");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/twitter/ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_type: threadType,
          topic,
          tone_of_voice: tone
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
      const response = await fetch('/api/twitter/ideas/custom', {
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
      const response = await fetch('/api/twitter/ideas/surprise');
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
      await fetch(`/api/twitter/ideas/${ideaId}`, { method: 'DELETE' });
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
                  <div className="text-sm text-muted-foreground">
                    {currentIdeas.thread_type} • {currentIdeas.topic} • {currentIdeas.tone_of_voice}
                  </div>
                )}
              </div>
              <div className="grid gap-4">
                {currentIdeas.threads.map((thread: any, index: number) => (
                  <Card key={index} className="p-4 relative group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-base font-medium">{thread.hook}</p>
                          <div className="space-y-1">
                            {thread.outline.map((point: string, i: number) => (
                              <p key={i} className="text-sm text-muted-foreground">
                                {i + 1}. {point}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(`${thread.hook}\n\n${thread.outline.map((point: string, i: number) => `${i + 1}. ${point}`).join('\n')}`)}
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
                          {item.thread_type} • {item.topic} • {item.tone_of_voice}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {item.threads.slice(0, 2).map((thread: any, index: number) => (
                        <div key={index} className="space-y-1">
                          <p className="text-sm font-medium">{thread.hook}</p>
                          <div className="text-xs text-muted-foreground">
                            {thread.outline.length} points
                          </div>
                        </div>
                      ))}
                      {item.threads.length > 2 && (
                        <Button
                          variant="ghost"
                          className="w-full text-muted-foreground hover:text-primary"
                          onClick={() => setCurrentIdeas(item)}
                        >
                          View {item.threads.length - 2} more threads
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