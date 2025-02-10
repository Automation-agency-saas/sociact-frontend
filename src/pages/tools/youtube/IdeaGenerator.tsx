import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { HistorySection } from '../../../components/shared/HistorySection';
import { containerVariants, itemVariants, cardHoverVariants, IdeaHistoryItem } from '../../../lib/animations';

export function YouTubeIdeaGeneratorPage() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [history, setHistory] = useState<IdeaHistoryItem[]>([]);

  const generateIdeas = async () => {
    if (!niche) {
      toast.error("Please enter a niche");
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const generatedIdeas = [
        "10 Hidden Features in [Niche Product] You Need to Know About",
        "The Ultimate Beginner's Guide to [Niche Topic]",
        "Why Most People Fail at [Niche Activity] (And How to Succeed)",
        "5 Game-Changing [Niche] Tips the Pros Don't Want You to Know",
        "I Tried [Niche Method] for 30 Days - Here's What Happened"
      ].map(idea => idea.replace(/\[Niche.*?\]/g, niche));

      setIdeas(generatedIdeas);
      const historyItem: IdeaHistoryItem = {
        id: uuidv4(),
        timestamp: new Date(),
        niche,
        ideas: generatedIdeas
      };
      setHistory(prev => [historyItem, ...prev]);
      toast.success("Ideas generated successfully!");
    } catch (error) {
      toast.error("Failed to generate ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success("History item deleted");
  };

  return (
    <ToolPageWrapper
      title="YouTube Idea Generator"
      description="Generate engaging video ideas for your YouTube channel based on your niche"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <Card className="p-6 bg-background/60 backdrop-blur-lg">
            <motion.div variants={containerVariants} className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Generate Ideas</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Niche</label>
                  <Input
                    placeholder="e.g. productivity, cooking, tech reviews"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={generateIdeas}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Ideas...
                    </>
                  ) : (
                    "Generate Ideas"
                  )}
                </Button>
              </div>

              {ideas.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  className="space-y-3"
                >
                  {ideas.map((idea, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover="hover"
                      className="relative"
                    >
                      <Card
                        className="p-4 cursor-pointer group"
                        onClick={() => copyToClipboard(idea)}
                      >
                        <motion.div variants={cardHoverVariants}>
                          <div className="flex justify-between items-start gap-4">
                            <p className="flex-1">{idea}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </Card>
        </motion.div>

        <HistorySection<IdeaHistoryItem>
          title="Generated Ideas History"
          items={history}
          onDelete={deleteHistoryItem}
          renderPreview={(item) => (
            <div className="space-y-2">
              <div className="font-medium">Niche: {item.niche}</div>
              <div className="text-sm text-muted-foreground">
                {item.ideas.slice(0, 3).map((idea, index) => (
                  <div key={index} className="truncate">
                    • {idea}
                  </div>
                ))}
                {item.ideas.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{item.ideas.length - 3} more ideas
                  </div>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </ToolPageWrapper>
  );
} 