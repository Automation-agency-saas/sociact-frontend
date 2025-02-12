import { Youtube, Instagram, Twitter, Linkedin, Sparkles, Zap, Video, FileText, MessageCircle, Search, Image, BarChart3, MessageSquare, Facebook, Palette } from 'lucide-react';
import { IconType } from 'react-icons';
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
    icon: Video,
    category: 'ideation',
    platforms: ['instagram'],
    url: '/instagram/idea-generator',
  },
  {
    name: 'ThreadMind',
    title: 'Thread Mind',
    description: 'Generate viral thread ideas for Twitter',
    icon: MessageCircle,
    category: 'ideation',
    platforms: ['twitter'],
    url: '/twitter/idea-generator',
  },
  {
    name: 'ProMind',
    title: 'Pro Mind',
    description: 'Generate professional post ideas for LinkedIn',
    icon: FileText,
    category: 'ideation',
    platforms: ['linkedin'],
    url: '/linkedin/idea-generator',
  },

  // Content Tools
  {
    name: 'ScriptCraft',
    title: 'Script Craft',
    description: 'Create engaging video scripts with AI',
    icon: FileText,
    category: 'content',
    platforms: ['youtube'],
    url: '/youtube/script-generator',
  },
  {
    name: 'CaptionCraft',
    title: 'Caption Craft',
    description: 'Generate engaging captions for your posts',
    icon: FileText,
    category: 'content',
    platforms: ['instagram'],
    url: '/instagram/caption-generator',
  },
  {
    name: 'ThreadCraft',
    title: 'Thread Craft',
    description: 'Create viral thread ideas for twitter with AI',
    icon: MessageCircle,
    category: 'content',
    platforms: ['twitter'],
    url: '/twitter/thread-generator',
  },
  {
    name: 'ProCraft',
    title: 'Pro Craft',
    description: 'Create professional post ideas for linkedin',
    icon: FileText,
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
    name: 'CommentPro - Instagram',
    title: 'Comment Pro - Instagram',
    description: 'Automate engaging responses to comments on your instagram posts',
    icon: MessageSquare,
    category: 'engagement',
    platforms: ['instagram'],
    url: '/instagram/comment-automation',
  },
  {
    name: 'CommentPro - YouTube',
    title: 'Comment Pro - YouTube',
    description: 'Automate engaging responses to comments on your videos',
    icon: MessageSquare,
    category: 'engagement',
    platforms: ['youtube'],
    url: '/youtube/comment-automation',
  },
  {
    name: 'CommentPro - Twitter',
    title: 'Comment Pro - Twitter',
    description: 'Automate engaging responses to tweets and replies',
    icon: MessageSquare,
    category: 'engagement',
    platforms: ['twitter'],
    url: '/twitter/comment-automation',
  },
  {
    name: 'CommentPro - LinkedIn',
    title: 'Comment Pro - LinkedIn',
    description: 'Automate engaging responses to comments on your LinkedIn posts',
    icon: MessageSquare,
    category: 'engagement',
    platforms: ['linkedin'],
    url: '/linkedin/comment-automation',
  },
  {
    name: 'CommentPro - Facebook',
    title: 'Comment Pro - Facebook',
    description: 'Automate engaging responses to comments on your Facebook posts',
    icon: MessageSquare,
    category: 'engagement',
    platforms: ['facebook'],
    url: '/facebook/comment-automation',
  },

  // Analytics Tools
  {
    name: 'SEOPro',
    title: 'SEO Pro',
    description: 'Optimize your content for better visibility',
    icon: Search,
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

export const platformConfig = {
  all: {
    icon: Youtube,
    name: 'All Platforms',
    color: 'text-primary',
  },
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
  facebook: {
    icon: Facebook,
    name: 'Facebook',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/10'
  },
}; 