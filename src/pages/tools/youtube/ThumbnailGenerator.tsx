import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { ToolPageWrapper } from "../../../components/tool-page/ToolPageWrapper";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { HistorySection } from "../../../components/shared/HistorySection";
import { containerVariants, itemVariants, cardHoverVariants, ThumbnailHistoryItem } from "../../../lib/animations";
import { ToolLayout } from "../../../components/tool-page/ToolLayout";
import { ToolTitle } from "@/components/ui/tool-title";
const thumbnailStyles = [
  { value: "modern", label: "Modern & Clean" },
  { value: "bold", label: "Bold & Striking" },
  { value: "minimal", label: "Minimal & Elegant" },
  { value: "vibrant", label: "Vibrant & Energetic" },
  { value: "professional", label: "Professional & Corporate" }
];

export function YouTubeThumbnailGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("modern");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [history, setHistory] = useState<ThumbnailHistoryItem[]>([]);

  const generateThumbnail = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // For demo purposes, using a placeholder image
      const imageUrl = "https://placehold.co/1280x720/random";
      
      setGeneratedImage(imageUrl);
      const historyItem: ThumbnailHistoryItem = {
        id: uuidv4(),
        timestamp: new Date(),
        prompt,
        imageUrl,
        style
      };
      setHistory(prev => [historyItem, ...prev]);
      toast.success("Thumbnail generated successfully!");
    } catch (error) {
      toast.error("Failed to generate thumbnail. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `thumbnail-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success("Thumbnail downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download thumbnail");
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success("History item deleted");
  };

  return (
    // <ToolPageWrapper
    //   title="YouTube Thumbnail Generator"
    //   description="Create eye-catching thumbnails for your videos using AI"
    // >
    <ToolLayout>
      <ToolTitle
      title="YouTube Thumbnail Generator"
      description="Create eye-catching thumbnails for your videos using AI"
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
              <h2 className="text-2xl font-semibold tracking-tight">Generate Thumbnail</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea
                    placeholder="Describe your ideal thumbnail..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Style</label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {thumbnailStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={generateThumbnail}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Thumbnail...
                    </>
                  ) : (
                    "Generate Thumbnail"
                  )}
                </Button>
              </div>

              {generatedImage && (
                <motion.div
                  variants={containerVariants}
                  className="space-y-3"
                >
                  <Card className="p-4 group">
                    <motion.div variants={cardHoverVariants}>
                      <div className="space-y-4">
                        <img
                          src={generatedImage}
                          alt="Generated thumbnail"
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                        <Button
                          className="w-full"
                          onClick={() => downloadImage(generatedImage)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Thumbnail
                        </Button>
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </Card>
        </motion.div>

        <HistorySection<ThumbnailHistoryItem>
          title="Generated Thumbnails History"
          items={history}
          onDelete={deleteHistoryItem}
          renderPreview={(item) => (
            <div className="space-y-2">
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="text-sm text-muted-foreground line-clamp-2">
                {item.prompt}
              </div>
              <div className="text-xs text-muted-foreground">
                Style: {thumbnailStyles.find(s => s.value === item.style)?.label}
              </div>
            </div>
          )}
        />
      </div>
      </ToolLayout>
    // </ToolPageWrapper>
  );
} 