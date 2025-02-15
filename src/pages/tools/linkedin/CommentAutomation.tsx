import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { MessageCircle, History, Sparkles, Link, Clock, CheckCircle2, XCircle, Linkedin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { ToolLayout } from "@/components/tool-page/ToolLayout";
import { ToolTitle } from "@/components/ui/tool-title";
import { cn } from "@/lib/utils";
import { linkedinService } from "@/lib/services/linkedin.service";
import { useLocation } from 'react-router-dom';

// Constants for dropdown options
const RESPONSE_TONES = [
  'Professional',
  'Friendly',
  'Engaging',
  'Supportive',
  'Insightful',
  'Expert'
];

const RESPONSE_LENGTHS = [
  'Brief (1-2 sentences)',
  'Concise (3-4 sentences)',
  'Detailed (5+ sentences)'
];

interface AutoResponse {
  id: string;
  text: string;
  timestamp: Date;
  type?: 'success' | 'info' | 'error';
  commentText?: string;
  userName?: string;
  generatedReply?: string;
}

interface AutomationStats {
  totalComments: number;
  successfulReplies: number;
  failedReplies: number;
  remainingComments: number;
}

interface ResponseGeneration {
  mode: 'instant';
  postUrl: string;
  useLatestPost: boolean;
  responseTone: string;
  responseLength: string;
  customPrompt: string;
  responses: AutoResponse[];
  includeEmojis: boolean;
  stats?: AutomationStats;
}

interface AutomationLog {
  id: string;
  created_at: string;
  completed_at?: string;
  status: string;
  stats: {
    comments_processed: number;
    successful_responses: number;
    failed_responses: number;
  };
  post_url?: string;
  settings: {
    tone: string;
    style: string;
  };
}

export function LinkedInPostCreator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [enhance, setEnhance] = useState(true);
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await linkedinService.checkAuthStatus();
      setIsAuthenticated(response.auth_status);
    } catch (error) {
      console.error('Failed to check LinkedIn auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    try {
      setIsLoading(true);
      const authUrl = await linkedinService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Failed to initiate LinkedIn auth:', error);
      toast.error(error.message || 'Failed to connect LinkedIn account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      toast.error('Please enter post content');
      return;
    }

    try {
      setIsLoading(true);
      const response = await linkedinService.createPost({
        content,
        enhance,
        tone
      });

      if (response.success) {
        toast.success('Post created successfully!');
        setContent('');
        setPreviewContent(response.enhanced_content || '');
      } else {
        toast.error(response.error || 'Failed to create post');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <ToolLayout>
        <ToolTitle 
          title="LinkedIn Post Creator 💼" 
          description="Create and enhance LinkedIn posts with AI"
        />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Connect Your LinkedIn Account</CardTitle>
            <CardDescription>
              To create posts, please connect your LinkedIn account first.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Linkedin className="w-16 h-16 text-[#0A66C2] mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              Connect your LinkedIn account to start creating AI-enhanced posts.
            </p>
            <Button 
              onClick={handleConnectLinkedIn} 
              disabled={isLoading}
              className="bg-[#0A66C2] hover:bg-[#004182]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </div>
              ) : (
                <>Connect LinkedIn Account</>
              )}
            </Button>
          </CardContent>
        </Card>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout>
      <ToolTitle 
        title="LinkedIn Post Creator" 
        description="Create engaging LinkedIn posts enhanced by AI"
      />

      <div className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Write your post and let AI enhance it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Post Content</label>
              <Textarea
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content Tone</label>
              <Select
                value={tone}
                onValueChange={setTone}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">AI Enhancement</p>
                <p className="text-sm text-muted-foreground">Let AI improve your post</p>
              </div>
              <Switch
                checked={enhance}
                onCheckedChange={setEnhance}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreatePost}
              disabled={isLoading || !content.trim()}
              className="w-full bg-[#0A66C2] hover:bg-[#004182]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Post...
                </div>
              ) : (
                <>
                  <Linkedin className="mr-2 h-5 w-5" />
                  Create Post
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {previewContent && (
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Post Preview</CardTitle>
              <CardDescription>AI-enhanced version of your post</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-secondary/10 rounded-lg">
                <p className="whitespace-pre-wrap">{previewContent}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
} 