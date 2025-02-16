import { Youtube, Instagram, Twitter, Linkedin, Sparkles, MessageSquare, BarChart3, Palette, Facebook, Globe } from 'lucide-react';
import { Platform, Category } from '../types';

export interface Tool {
  name: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: Category;
  platforms: Platform[];
  url: string;
  comingSoon?: boolean;
}

export const tools: Tool[] = [
  // Ideation Tools
  {
    name: 'IdeaForge',
    title: 'Idea Forge',
    description: 'Generate viral video ideas tailored to your niche',
    icon: Sparkles,
    category: 'ideation',
    platforms: ['youtube'],
    url: '/youtube/idea-generator',
  },
  {
    name: 'ReelSpark',
    title: 'Reel Spark',
    description: 'Create engaging reel concepts that capture attention',
    icon: Sparkles,
    category: 'ideation',
    platforms: ['instagram'],
    url: '/instagram/idea-generator',
  },
  {
    name: 'ThreadMind',
    title: 'Thread Mind',
    description: 'Generate viral ideas for twitter',
    icon: Sparkles,
    category: 'ideation',
    platforms: ['twitter'],
    url: '/twitter/idea-generator',
  },
  {
    name: 'ProMind',
    title: 'Pro Mind',
    description: 'Generate professional posts for linkedin',
    icon: Sparkles,
    category: 'ideation',
    platforms: ['linkedin'],
    url: '/linkedin/idea-generator',
  },

  // Content Tools
  {
    name: 'ScriptCraft',
    title: 'Script Craft',
    description: 'Create engaging video scripts with AI',
    icon: MessageSquare,
    category: 'content',
    platforms: ['youtube'],
    url: '/youtube/script-generator',
  },
  {
    name: 'CaptionCraft',
    title: 'Caption Craft',
    description: 'Generate engaging captions for your posts',
    icon: MessageSquare,
    category: 'content',
    platforms: ['instagram'],
    url: '/instagram/caption-generator',
  },
  {
    name: 'ThreadCraft',
    title: 'Thread Craft',
    description: 'Create viral thread ideas for twitter with AI',
    icon: MessageSquare,
    category: 'content',
    platforms: ['twitter'],
    url: '/twitter/thread-generator',
  },
  {
    name: 'ProCraft',
    title: 'Pro Craft',
    description: 'Create professional post ideas for linkedin',
    icon: MessageSquare,
    category: 'content',
    platforms: ['linkedin'],
    url: '/linkedin/post-generator',
  },
  {
    name: 'ThumbnailGen',
    title: 'Thumbnail Gen',
    description: 'Create stunning thumbnails from text description',
    icon: Palette,
    category: 'content',
    platforms: ['youtube'],
    url: '/youtube/thumbnail-generator',
  },

  // Engagement Tools
  {
    name: 'InstagramCommentPro',
    title: 'Auto Comment',
    description: 'Automate engaging responses to comments on your posts',
    icon: Sparkles,
    category: 'engagement',
    platforms: ['instagram'],
    url: '/instagram/comment-automation',
  },
  {
    name: 'YoutubeCommentPro',
    title: 'Auto Comment',
    description: 'Automate engaging responses to comments on your videos',
    icon: Sparkles,
    category: 'engagement',
    platforms: ['youtube'],
    url: '/youtube/comment-automation',
  },
  {
    name: 'TwitterCommentPro',
    title: 'Auto Comment',
    description: 'Automate engaging responses to comments on your tweets',
    icon: Sparkles,
    category: 'engagement',
    platforms: ['twitter'],
    url: '/twitter/comment-automation',
  },
  {
    name: 'LinkedinPostPro',
    title: 'Linkedin Post Assistant',
    description: 'Enhance your LinkedIn posts with AI and post them automatically',
    icon: Sparkles,
    category: 'engagement',
    platforms: ['linkedin'],
    url: '/linkedin/post-automation',
  },
  {
    name: 'FacebookCommentPro',
    title: 'Auto Comment',
    description: 'Automate engaging responses to comments on your Facebook posts',
    icon: Sparkles,
    category: 'engagement',
    platforms: ['facebook'],
    url: '/facebook/comment-automation',
    comingSoon: true,
  },

  // Analytics Tools
  {
    name: 'SEOPro',
    title: 'Seo Pro',
    description: 'Optimize your content for better visibility',
    icon: BarChart3,
    category: 'analytics',
    platforms: ['youtube'],
    url: '/youtube/seo-optimizer',
  },
];

export const categories = [
  {
    title: 'Ideation',
    icon: Sparkles,
  },
  {
    title: 'Content',
    icon: MessageSquare,
  },
  {
    title: 'Engagement',
    icon: Sparkles,
  },
  {
    title: 'Analytics',
    icon: BarChart3,
  },
];

interface PlatformConfig {
  icon: any;
  name: string;
  color: string;
  bgColor?: string;
}

export const platformConfig: Record<string, PlatformConfig> = {
  youtube: {
    icon: Youtube,
    name: 'YouTube',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  instagram: {
    icon: Instagram,
    name: 'Instagram',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  },
  twitter: {
    icon: Twitter,
    name: 'Twitter',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  linkedin: {
    icon: Linkedin,
    name: 'LinkedIn',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10'
  },
  all: {
    icon: Globe,
    name: 'All Platforms',
    color: 'text-primary'
  }
}; 