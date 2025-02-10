import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Rocket, Users, Wand2, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  username: string;
  profilePicture: string;
  purpose: string;
  referralSource: string;
  bio: string;
}

const steps = [
  'Welcome',
  'Profile Setup',
  'Final Details',
  'Preview'
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

// Random username generation helpers
const adjectives = ['Creative', 'Digital', 'Social', 'Dynamic', 'Vibrant', 'Epic', 'Stellar', 'Cosmic'];
const nouns = ['Creator', 'Influencer', 'Guru', 'Master', 'Ninja', 'Wizard', 'Star', 'Legend'];
const generateRandomUsername = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`.toLowerCase();
};

// Random avatar generation using DiceBear
const generateRandomAvatar = () => {
  const styles = ['adventurer', 'avataaars', 'big-ears', 'bottts', 'pixel-art'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  const seed = Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    username: '',
    profilePicture: '',
    purpose: '',
    referralSource: '',
    bio: '',
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setDirection(0);
      setIsSubmitting(false);
      setFormData({
        username: '',
        profilePicture: '',
        purpose: '',
        referralSource: '',
        bio: '',
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    toast.error('Please complete the onboarding to get started');
  };

  const nextStep = () => {
    if (step === 1 && !formData.username) {
      toast.error('Please enter a username');
      return;
    }
    if (step === 2 && !formData.purpose) {
      toast.error('Please select your purpose');
      return;
    }
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = async () => {
    if (!formData.username || !formData.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onComplete(formData);
      toast.success('Welcome to Sociact! Your profile is ready.');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRandomUsername = () => {
    const randomUsername = generateRandomUsername();
    setFormData(prev => ({ ...prev, username: randomUsername }));
    toast.success('Random username generated!');
  };

  const handleRandomAvatar = () => {
    const randomAvatar = generateRandomAvatar();
    setFormData(prev => ({ ...prev, profilePicture: randomAvatar }));
    toast.success('Random avatar generated!');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Uploading image...');

      try {
        // Create FormData
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', 'b4b4f053e22c4701836955e55c3e1e7d');

        // Upload to ImgBB
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Update form with the hosted image URL
          setFormData(prev => ({
            ...prev,
            profilePicture: data.data.url
          }));
          toast.success('Image uploaded successfully!');
        } else {
          throw new Error(data.error?.message || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
      <DialogContent className="w-[95vw] h-[600px] sm:max-w-[600px] p-0 gap-0 bg-background/95 backdrop-blur-xl border border-border/50 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]" onPointerDownOutside={(e) => e.preventDefault()}>
        <style>
          {`
            [data-dialog-close] {
              display: none !important;
              pointer-events: none !important;
              opacity: 0 !important;
            }
            .dialog-no-close::before {
              display: none !important;
            }
          `}
        </style>
        <div className="relative h-full overflow-hidden dialog-no-close">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary/30">
            <motion.div
              className="h-full bg-gradient-to-r from-[#F596D3] to-[#D247BF]"
              initial={{ width: '0%' }}
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 px-6 sm:px-8 py-4 sm:py-8 overflow-y-auto"
            >
              {step === 0 && (
                <div className="min-h-full flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 py-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative"
                  >
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#F596D3] to-[#D247BF] flex items-center justify-center mb-4 sm:mb-6">
                      <Rocket className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                    </div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-[#F596D3]" />
                    </motion.div>
                  </motion.div>
                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
                      Welcome to Sociact
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground">
                      Your journey to social media mastery begins here
                    </p>
                  </div>
                  <Button 
                    onClick={nextStep} 
                    className="mt-4 sm:mt-6 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-[#F596D3] to-[#D247BF] hover:from-[#D247BF] hover:to-[#F596D3] transition-all duration-300 group w-full sm:w-auto"
                  >
                    <span className="mr-2">Let's Get Started</span>
                    <motion.div
                      animate={{
                        x: [0, 4, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </Button>
                </div>
              )}

              {step === 1 && (
                <div className="min-h-full flex flex-col justify-center space-y-6 sm:space-y-8 py-4">
                  <div className="space-y-2 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold">Create Your Profile</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Let's make your presence unique</p>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Label htmlFor="username" className="text-base sm:text-lg">Choose your username</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRandomUsername}
                          className="text-primary hover:text-primary/80"
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="@username"
                        className="text-base sm:text-lg h-10 sm:h-12"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center space-y-4"
                    >
                      <div className="flex items-center justify-between w-full">
                        <Label className="text-base sm:text-lg">Profile Picture</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRandomAvatar}
                          className="text-primary hover:text-primary/80"
                        >
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Random Avatar
                        </Button>
                      </div>
                      <div className="relative group">
                        <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                          <AvatarImage src={formData.profilePicture} />
                          <AvatarFallback className="bg-secondary">
                            <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2">
                          <Label
                            htmlFor="picture"
                            className="cursor-pointer inline-flex items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                            <input
                              id="picture"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </Label>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="min-h-full flex flex-col justify-center space-y-6 sm:space-y-8 py-4">
                  <div className="space-y-2 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold">Final Touches</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Help us personalize your experience</p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="purpose" className="text-base sm:text-lg">I want to use Sociact for...</Label>
                      <Select
                        value={formData.purpose}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select your purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              Personal Brand Growth
                            </div>
                          </SelectItem>
                          <SelectItem value="business">Business Marketing</SelectItem>
                          <SelectItem value="creator">Content Creation</SelectItem>
                          <SelectItem value="agency">Agency Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="bio" className="text-base sm:text-lg">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        className="h-24 resize-none"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="referral" className="text-base sm:text-lg">How did you hear about us?</Label>
                      <Select
                        value={formData.referralSource}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, referralSource: value }))}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select referral source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="search">Search Engine</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="friend">Friend/Colleague</SelectItem>
                          <SelectItem value="advertisement">Advertisement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="min-h-full flex flex-col justify-center items-center space-y-6 sm:space-y-8 py-4">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[90%] sm:max-w-md p-4 sm:p-6 rounded-xl bg-gradient-to-br from-background/80 to-background border border-border/50 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20">
                          <AvatarImage src={formData.profilePicture} />
                          <AvatarFallback className="bg-gradient-to-br from-[#F596D3] to-[#D247BF] text-lg sm:text-xl font-bold text-white">
                            {formData.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center space-y-2"
                      >
                        <h3 className="text-lg sm:text-xl font-semibold">@{formData.username}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">{formData.bio || "No bio yet"}</p>
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-full pt-4 border-t border-border/50"
                      >
                        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                          <span>Purpose:</span>
                          <span className="text-foreground">{formData.purpose}</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center space-y-3 sm:space-y-4"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold">Looking Great! 🎉</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Your profile is ready to shine. Ready to start your journey?
                    </p>
                  </motion.div>
                </div>
              )}

              <div className={cn(
                "absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between",
                step === 0 && "hidden"
              )}>
                {step > 0 && step < 3 && (
                  <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    disabled={isSubmitting}
                    className="hover:bg-secondary/80"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                {step === 0 && <div />}
                {step < 2 ? (
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] hover:from-[#D247BF] hover:to-[#F596D3]"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : step === 2 ? (
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] hover:from-[#D247BF] hover:to-[#F596D3]"
                  >
                    Preview Profile
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleComplete} 
                    className="w-full bg-gradient-to-r from-[#F596D3] to-[#D247BF] hover:from-[#D247BF] hover:to-[#F596D3]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          ⚡
                        </motion.div>
                        Setting up...
                      </span>
                    ) : (
                      <>
                        Complete Setup
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
} 