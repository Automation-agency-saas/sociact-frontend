import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { MessageCircle, Copy, Trash2, Settings2, History, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { ToolLayout } from "@/components/tool-page/ToolLayout";
import { ToolTitle } from "@/components/ui/tool-title";
import { LoadingModal } from "@/components/ui/loading-modal";

// Constants for dropdown options
const RESPONSE_TONES = [
  'Friendly',
  'Professional',
  'Casual',
  'Enthusiastic',
  'Supportive',
  'Engaging'
];

const COMMENT_TYPES = [
  'General Engagement',
  'Question Response',
  'Appreciation',
  'Story Reply',
  'Feedback'
];

const RESPONSE_LENGTHS = [
  'Brief (1-2 words)',
  'Short (3-5 words)',
  'Medium (6-10 words)',
  'Long (10+ words)'
];

interface AutoResponse {
  id: string;
  text: string;
  timestamp: Date;
}

interface ResponseGeneration {
  commentType: string;
  responseTone: string;
  responseLength: string;
  customPrompt: string;
  responses: AutoResponse[];
}

export function InstagramCommentAutomationPage() {
  const [activeTab, setActiveTab] = useState('preferences');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [responseGeneration, setResponseGeneration] = useState<ResponseGeneration>({
    commentType: '',
    responseTone: '',
    responseLength: '',
    customPrompt: '',
    responses: []
  });

  const generateFromPreferences = async () => {
    if (!responseGeneration.commentType || !responseGeneration.responseTone || !responseGeneration.responseLength) {
      toast.error('Please select all preferences');
      return;
    }

    setIsGenerating(true);
    simulateLoading();

    // Simulated response generation
    setTimeout(() => {
      const newResponse: AutoResponse = {
        id: Date.now().toString(),
        text: 'This is a simulated response based on your preferences! 🎯',
        timestamp: new Date()
      };

      setResponseGeneration(prev => ({
        ...prev,
        responses: [newResponse, ...prev.responses]
      }));

      setIsGenerating(false);
      toast.success('Response generated successfully!');
    }, 3000);
  };

  const generateCustomResponses = async () => {
    if (!responseGeneration.customPrompt) {
      toast.error('Please enter a custom prompt');
      return;
    }

    setIsGenerating(true);
    simulateLoading();

    // Simulated response generation
    setTimeout(() => {
      const newResponse: AutoResponse = {
        id: Date.now().toString(),
        text: 'This is a custom generated response based on your prompt! 💫',
        timestamp: new Date()
      };

      setResponseGeneration(prev => ({
        ...prev,
        responses: [newResponse, ...prev.responses]
      }));

      setIsGenerating(false);
      toast.success('Custom response generated successfully!');
    }, 3000);
  };

  const simulateLoading = () => {
    const messages = [
      'Analyzing engagement patterns...',
      'Crafting personalized responses...',
      'Optimizing for engagement...',
      'Finalizing response generation...'
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setGenerationProgress(progress);
      setLoadingMessage(messages[progress/25 - 1]);
      
      if (progress === 100) {
        clearInterval(interval);
      }
    }, 750);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const deleteResponse = (id: string) => {
    setResponseGeneration(prev => ({
      ...prev,
      responses: prev.responses.filter(response => response.id !== id)
    }));
    toast.success('Response deleted');
  };

  return (
    <ToolLayout>
      <ToolTitle 
        title="Instagram Comment Automation 📸" 
        description="Generate engaging responses to Instagram comments and mentions"
      />
      
      <div className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preferences">
              <Settings2 className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Sparkles className="w-4 h-4 mr-2" />
              Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Response Preferences</CardTitle>
                <CardDescription>
                  Configure your automated response preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comment Type</label>
                  <Select
                    value={responseGeneration.commentType}
                    onValueChange={(value) => setResponseGeneration(prev => ({ ...prev, commentType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select comment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Response Tone</label>
                  <Select
                    value={responseGeneration.responseTone}
                    onValueChange={(value) => setResponseGeneration(prev => ({ ...prev, responseTone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select response tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSE_TONES.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Response Length</label>
                  <Select
                    value={responseGeneration.responseLength}
                    onValueChange={(value) => setResponseGeneration(prev => ({ ...prev, responseLength: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select response length" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSE_LENGTHS.map((length) => (
                        <SelectItem key={length} value={length}>
                          {length}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateFromPreferences}
                  disabled={isGenerating}
                  className="w-full mt-4"
                >
                  {isGenerating ? 'Generating...' : 'Generate Responses'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Response</CardTitle>
                <CardDescription>
                  Generate responses using your custom prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Prompt</label>
                  <Textarea
                    placeholder="Enter your custom prompt..."
                    value={responseGeneration.customPrompt}
                    onChange={(e) => setResponseGeneration(prev => ({ ...prev, customPrompt: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={generateCustomResponses}
                  disabled={isGenerating}
                  className="w-full mt-4"
                >
                  {isGenerating ? 'Generating...' : 'Generate Custom Responses'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {isGenerating && (
            <Card className="mt-4">
              <CardContent className="py-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{loadingMessage}</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${generationProgress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${generationProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {responseGeneration.responses.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Generated Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {responseGeneration.responses.map((response) => (
                  <div
                    key={response.id}
                    className="p-4 rounded-lg border bg-card text-card-foreground"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-sm">{response.text}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(response.text)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteResponse(response.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Generated {response.timestamp.toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
    </ToolLayout>
  );
} 