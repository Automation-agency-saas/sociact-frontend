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
import { containerVariants, itemVariants, cardHoverVariants, ScriptHistoryItem } from '../../../lib/animations';
import {ToolLayout} from "../../../components/tool-page/ToolLayout";
import { ToolTitle } from '@/components/ui/tool-title';
import{contentGeneratorService } from "../../../lib/services/content-generator";

export function YouTubeScriptGeneratorPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState('');
  const [history, setHistory] = useState<ScriptHistoryItem[]>([]);

  const generateScript = async () => {
    if (!title || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const generatedScript = await contentGeneratorService.generateYouTubeScript(title, description, '00:10:00');
      setScript(generatedScript);
      const historyItem: ScriptHistoryItem = {
        id: uuidv4(),
        timestamp: new Date(),
        title,
        description,
        script: generatedScript
      };
      setHistory(prev => [historyItem, ...prev]);
      toast.success('Script generated successfully!');
    } catch (error) {
      toast.error('Failed to generate script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success('History item deleted');
  };

  return (
    // <ToolPageWrapper
    //   title="YouTube Script Generator"
    //   description="Generate professional video scripts based on your title and description"
    // >
    <ToolLayout>
        <ToolTitle 
        title="YouTube Script Generator" 
        description="Generate professional video scripts based on your title and description"
      />
        <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <Card className="p-6 bg-background/60 backdrop-blur-lg">
            <motion.div variants={containerVariants} className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Generate Script</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Title</label>
                  <Input
                    placeholder="e.g. How to Build a Website in 2024"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Description</label>
                  <Textarea
                    placeholder="Describe what your video will be about..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={generateScript}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Script...
                    </>
                  ) : (
                    'Generate Script'
                  )}
                </Button>
              </div>

              {script && (
                <motion.div
                  variants={containerVariants}
                  className="space-y-3"
                >
                  <Card
                    className="p-4 cursor-pointer group"
                    onClick={() => copyToClipboard(script)}
                  >
                    <motion.div variants={cardHoverVariants}>
                      <div className="flex justify-between items-start gap-4">
                        <pre className="flex-1 whitespace-pre-wrap font-sans text-sm">
                          {script}
                        </pre>
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
              )}
            </motion.div>
          </Card>
        </motion.div>

        <HistorySection<ScriptHistoryItem>
          title="Generated Scripts History"
          items={history}
          onDelete={deleteHistoryItem}
          renderPreview={(item) => (
            <div className="space-y-2">
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </div>
              <div className="text-xs text-muted-foreground">
                Click to view full script
              </div>
            </div>
          )}
        />
      </div>
      </ToolLayout>

    // </ToolPageWrapper>
  );
} 