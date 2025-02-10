import { useState } from 'react';
import { ToolPageWrapper } from '../../../components/tool-page/ToolPageWrapper';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { MessageCircle, Play, Pause, Settings2, RefreshCw, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

type CommentMode = 'scheduled' | 'instant';

export function InstagramCommentAutomationPage() {
  const [postUrl, setPostUrl] = useState('');
  const [commentText, setCommentText] = useState('');
  const [mode, setMode] = useState<CommentMode>('instant');
  const [schedule, setSchedule] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!postUrl || !commentText) {
      toast.error('Please provide both post URL and comment text');
      return;
    }

    try {
      setIsRunning(true);
      // TODO: Replace with actual API call
      toast.success('Comment automation started successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start automation';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    toast.success('Comment automation stopped');
  };

  const handleReset = () => {
    setPostUrl('');
    setCommentText('');
    setMode('instant');
    setSchedule('');
    setIsRunning(false);
    setError(null);
  };

  return (
    <ToolPageWrapper
      title="Instagram Comment Automation"
      description="Automate your Instagram engagement with smart commenting"
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Comment Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Comment Settings
              </CardTitle>
              <CardDescription>
                Configure your automated comments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Post URL</label>
                <Input
                  placeholder="Enter the Instagram post URL..."
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Comment Text</label>
                <Textarea
                  placeholder="Enter your comment text..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isRunning}
                />
              </div>
            </CardContent>
          </Card>

          {/* Automation Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Automation Settings
              </CardTitle>
              <CardDescription>
                Configure timing and automation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Comment Mode</label>
                <Select
                  value={mode}
                  onValueChange={(value) => setMode(value as CommentMode)}
                  disabled={isRunning}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select comment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">
                      <div className="flex flex-col">
                        <span className="font-medium">Instant</span>
                        <span className="text-xs text-muted-foreground">
                          Comment immediately
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="scheduled">
                      <div className="flex flex-col">
                        <span className="font-medium">Scheduled</span>
                        <span className="text-xs text-muted-foreground">
                          Comment at specific times
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {mode === 'scheduled' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Schedule</label>
                  <Input
                    type="datetime-local"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    disabled={isRunning}
                  />
                </div>
              )}

              <div className="pt-4 space-y-4">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    disabled={!postUrl || !commentText}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Automation
                  </Button>
                ) : (
                  <Button
                    onClick={handleStop}
                    variant="destructive"
                    className="w-full"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Stop Automation
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                  disabled={isRunning}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Card */}
        {isRunning && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Automation Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Active</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {mode === 'scheduled'
                    ? `Scheduled for ${new Date(schedule).toLocaleString()}`
                    : 'Running in instant mode'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
} 