import { useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';
import { CommentPlatform, commentAutomationService } from '@/lib/services/comment-automation';
import { toast } from 'react-hot-toast';
import { instagramService } from '@/lib/services/instagram.service';
import { INSTAGRAM_CLIENT_ID, INSTAGRAM_REDIRECT_URI } from '@/lib/config';
import { useLocation } from 'react-router-dom';

export type PlatformType = CommentPlatform;

interface CommentAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformType;
}

type Step = 'auth_check' | 'input' | 'running';

const URL_PATTERNS = {
  youtube: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/,
  instagram: /^(https?:\/\/)?(www\.)?(instagram\.com\/p\/)[a-zA-Z0-9_-]{11}$/,
  twitter: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/[0-9]+$/,
};

const platformConfig = {
  instagram: {
    title: 'Instagram Comment Automation',
    description: 'Automatically respond to comments on your Instagram posts',
    icon: Instagram,
    color: 'text-pink-500',
    authCheckMessage: 'To use Instagram comment automation, you need to connect your Instagram account first.',
    inputPlaceholder: 'Enter Instagram post URL (e.g., https://instagram.com/p/ABC123xyz...)',
    urlError: 'Please enter a valid Instagram post URL',
  },
  youtube: {
    title: 'YouTube Comment Automation',
    description: 'Automatically respond to comments on your YouTube videos',
    icon: Youtube,
    color: 'text-red-500',
    authCheckMessage: 'To use YouTube comment automation, you need to connect your YouTube account first.',
    inputPlaceholder: 'Enter YouTube video URL (e.g., https://youtube.com/watch?v=...)',
    urlError: 'Please enter a valid YouTube video URL',
  },
  twitter: {
    title: 'Twitter Comment Automation',
    description: 'Automatically respond to replies on your tweets',
    icon: Twitter,
    color: 'text-blue-400',
    authCheckMessage: 'To use Twitter comment automation, you need to connect your Twitter account first.',
    inputPlaceholder: 'Enter Tweet URL (e.g., https://twitter.com/user/status/...)',
    urlError: 'Please enter a valid Tweet URL',
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
  const [urlError, setUrlError] = useState<string | null>(null);
  const [tone, setTone] = useState('professional');
  const [style, setStyle] = useState('concise');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const config = platformConfig[platform];

  useEffect(() => {
    // Check if we're returning from Instagram auth
    const state = location.state as { instagramConnected?: boolean; modalState?: any };
    if (state?.instagramConnected && state?.modalState) {
      console.log('Restoring modal state after Instagram auth:', state.modalState);
      setPostUrl(state.modalState.postUrl || '');
      setTone(state.modalState.tone || 'professional');
      setStyle(state.modalState.style || 'concise');
      setCurrentStep('input');
      setIsAuthenticated(true);
      
      // Clear the state
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  useEffect(() => {
    const checkInstagramAuth = async () => {
      try {
        console.log('Checking Instagram auth status...');
        const response = await instagramService.checkAuthStatus();
        console.log('Instagram auth status response:', response);
        setIsAuthenticated(response.auth_status);
        if (response.auth_status) {
          setCurrentStep('input');
        }
      } catch (error) {
        console.error('Failed to check Instagram auth status:', error);
        setIsAuthenticated(false);
      }
    };

    if (isOpen && platform === 'instagram') {
      checkInstagramAuth();
    }
  }, [isOpen, platform]);

  const validateUrl = (url: string) => {
    if (!url) {
      setUrlError('URL is required');
      return false;
    }
    
    const pattern = URL_PATTERNS[platform];
    if (!pattern.test(url)) {
      setUrlError(config.urlError);
      return false;
    }
    
    setUrlError(null);
    return true;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setPostUrl(newUrl);
    if (newUrl) {
      validateUrl(newUrl);
    } else {
      setUrlError(null);
    }
  };

  const handleClose = () => {
    setCurrentStep('auth_check');
    setPostUrl('');
    setUrlError(null);
    setTone('professional');
    setStyle('concise');
    onClose();
  };

  const handleAuthenticate = async () => {
    try {
      setIsLoading(true);
      
      // Store current modal state in localStorage
      localStorage.setItem('instagram_auth_return_state', JSON.stringify({
        postUrl,
        tone,
        style
      }));

      // Initiate Instagram auth
      const authUrl = await instagramService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect Instagram account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAutomation = async () => {
    if (!validateUrl(postUrl)) {
      return;
    }

    try {
      setIsLoading(true);
      setCurrentStep('running');

      const response = await commentAutomationService.startAutomation({
        post_url: postUrl,
        tone,
        style,
        platform
      });

      if (response.success) {
        toast.success(`Successfully processed ${response.comments_processed} comments`);
        handleClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start automation');
      setCurrentStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const initiateInstagramAuth = () => {
    const redirectUri = encodeURIComponent(INSTAGRAM_REDIRECT_URI);
    const scope = [
      'instagram_business_basic',
      'instagram_business_manage_messages',
      'instagram_business_manage_comments',
      'instagram_business_content_publish',
      'instagram_business_manage_insights'
    ].join(',');
    
    const authUrl = `https://www.instagram.com/oauth/authorize?` + 
      `enable_fb_login=0` +
      `&force_authentication=1` +
      `&client_id=${INSTAGRAM_CLIENT_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&state=instagram`;
    
    window.location.href = authUrl;
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
                  onChange={handleUrlChange}
                  className={cn(urlError && "border-destructive")}
                />
                {urlError && (
                  <p className="text-sm text-destructive">{urlError}</p>
                )}
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
              disabled={!postUrl || !!urlError || isLoading}
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