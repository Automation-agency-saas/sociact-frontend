import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Rocket, ArrowRight } from 'lucide-react';

interface WelcomeBackModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    picture?: string;
  };
}

export function WelcomeBackModal({ isOpen, onClose, user }: WelcomeBackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-8 bg-background/95 backdrop-blur-xl border border-border/50 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 10,
              stiffness: 100,
              restDelta: 0.001
            }
          }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Avatar className="w-28 h-28 border-4 border-primary/20">
                  <AvatarImage src={user.picture} />
                  <AvatarFallback className="bg-gradient-to-br from-[#F596D3] to-[#D247BF] text-2xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute -top-2 -right-2 bg-primary rounded-full p-2"
              >
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center space-x-2">
              <motion.div
                animate={{
                  rotate: [-10, 10, -10],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 3,
                  repeatType: "reverse",
                }}
              >
                👋
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
                Welcome back, {user.name}!
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Ready to continue growing your social media presence?
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full pt-4"
          >
            <Button
              onClick={onClose}
              className="w-full h-12 text-lg bg-gradient-to-r from-[#F596D3] to-[#D247BF] hover:from-[#D247BF] hover:to-[#F596D3] transition-all duration-300 group"
            >
              <span className="mr-2">Let's Go!</span>
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
                <ArrowRight className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 