export const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const cardHoverVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  }
};

export const springVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

export const loadingSpinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Common types for history items
export type BaseHistoryItem = {
  id: string;
  timestamp: Date;
};

export type IdeaHistoryItem = BaseHistoryItem & {
  niche: string;
  ideas: string[];
};

export type ScriptHistoryItem = BaseHistoryItem & {
  title: string;
  description: string;
  script: string;
};

export type CaptionHistoryItem = BaseHistoryItem & {
  topic: string;
  caption: string;
  hashtags: string[];
};

export type ThreadHistoryItem = BaseHistoryItem & {
  topic: string;
  tweets: string[];
};

export type SEOHistoryItem = BaseHistoryItem & {
  content: string;
  optimizedContent: {
    title: string;
    description: string;
    keywords: string[];
    score: number;
  };
};

export type ThumbnailHistoryItem = BaseHistoryItem & {
  prompt: string;
  imageUrl: string;
  style: string;
};

export type CommentHistoryItem = BaseHistoryItem & {
  postUrl: string;
  comment: string;
  mode: 'scheduled' | 'instant';
  schedule?: string;
}; 