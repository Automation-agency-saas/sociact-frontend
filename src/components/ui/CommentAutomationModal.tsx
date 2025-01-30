import { useState } from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Input } from './input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Instagram, Youtube, Twitter, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CommentPlatform } from '../../lib/types';

export type PlatformType = 'instagram' | 'youtube' | 'twitter';

interface CommentAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: CommentPlatform;
}

type Step = 'auth_check' | 'input' | 'running';

const platformConfig = {
  instagram: {
    title: 'Instagram Comment Automation',
    description: 'Automatically respond to comments on your Instagram posts',
    icon: Instagram,
    color: 'text-pink-500',
    authCheckMessage: 'To use Instagram comment automation, you need to connect your Instagram account first.',
    inputPlaceholder: 'Enter Instagram post URL (e.g., https://instagram.com/p/...)',
  },
  youtube: {
    title: 'YouTube Comment Automation',
    description: 'Automatically respond to comments on your YouTube videos',
    icon: Youtube,
    color: 'text-red-500',
    authCheckMessage: 'To use YouTube comment automation, you need to connect your YouTube account first.',
    inputPlaceholder: 'Enter YouTube video URL',
  },
  twitter: {
    title: 'Twitter Comment Automation',
    description: 'Automatically respond to replies on your tweets',
    icon: Twitter,
    color: 'text-blue-400',
    authCheckMessage: 'To use Twitter comment automation, you need to connect your Twitter account first.',
    inputPlaceholder: 'Enter Tweet URL',
  },
};

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
];

const styleOptions = [
  { value: 'concise', label: 'Concise' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'emoji', label: 'With Emojis' },
  { value: 'questions', label: 'Engaging Questions' },
];

export function CommentAutomationModal({ isOpen, onClose, platform }: CommentAutomationModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('auth_check');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const [tone, setTone] = useState('professional');
  const [style, setStyle] = useState('concise');
  const [isLoading, setIsLoading] = useState(false);

  const config = platformConfig[platform];

  const handleClose = () => {
    setCurrentStep('auth_check');
    setPostUrl('');
    setTone('professional');
    setStyle('concise');
    onClose();
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      setIsAuthenticated(true);
      setCurrentStep('input');
      setIsLoading(false);
    }, 1500);
  };

  const handleStartAutomation = async () => {
    setIsLoading(true);
    setCurrentStep('running');
    // Simulate starting automation
    setTimeout(() => {
      setIsLoading(false);
      handleClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <config.icon className={cn("h-5 w-5", config.color)} />
            <DialogTitle>{config.title}</DialogTitle>
          </div>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {currentStep === 'auth_check' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 rounded-lg border p-4">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-muted-foreground">{config.authCheckMessage}</p>
              </div>

              <Button 
                onClick={handleAuthenticate}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {currentStep === 'input' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Post URL</label>
                <Input
                  placeholder={config.inputPlaceholder}
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Response Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Response Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 'running' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Starting comment automation...
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          {currentStep === 'input' && (
            <Button 
              onClick={handleStartAutomation}
              disabled={!postUrl || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                'Start Automation'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 