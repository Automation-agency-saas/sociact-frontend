import { Youtube, Instagram, Twitter, Linkedin, Sparkles, Zap, Video, FileText, MessageCircle, Search, Image, BarChart3, MessageSquare } from 'lucide-react';
import { IconType } from 'react-icons';
import { Platform, Category } from '../types';

export interface Tool {
  name: string;
  description: string;
  icon: IconType;
  category: Category;
  platforms: Platform[];
  comingSoon?: boolean;
}

export const tools: Tool[] = [
  {
    name: 'IdeaForge',
    description: 'Generate viral video ideas tailored to your niche',
    icon: Sparkles,
    category: 'ideation',
    platforms: ['youtube'],
  },
  {
    name: 'ReelSpark',
    description: 'Create engaging reel concepts that capture attention',
    icon: Video,
    category: 'ideation',
    platforms: ['instagram'],
  },
  {
    name: 'ThreadMind',
    description: 'Generate viral thread ideas for Twitter',
    icon: MessageCircle,
    category: 'ideation',
    platforms: ['twitter'],
  },
  {
    name: 'ProMind',
    description: 'Generate professional post ideas for LinkedIn',
    icon: FileText,
    category: 'ideation',
    platforms: ['linkedin'],
  },
  {
    name: 'ScriptCraft',
    description: 'Create engaging video scripts with AI',
    icon: FileText,
    category: 'content',
    platforms: ['youtube'],
  },
  {
    name: 'CaptionCraft',
    description: 'Generate engaging captions for your posts',
    icon: FileText,
    category: 'content',
    platforms: ['instagram'],
  },
  {
    name: 'ThreadCraft',
    description: 'Create viral Twitter threads with AI',
    icon: MessageCircle,
    category: 'content',
    platforms: ['twitter'],
  },
  {
    name: 'ProCraft',
    description: 'Create professional LinkedIn posts',
    icon: FileText,
    category: 'content',
    platforms: ['linkedin'],
  },
  {
    name: 'SEOPro',
    description: 'Optimize your content for better visibility',
    icon: Search,
    category: 'analytics',
    platforms: ['youtube', 'instagram', 'twitter', 'linkedin'],
  },
  {
    name: 'CommentPro',
    description: 'Automate engaging responses to comments on your posts',
    icon: MessageSquare,
    category: 'engagement',
    platforms: ['instagram', 'youtube', 'twitter'],
  },
];

export const platformConfig = {
  all: {
    icon: Zap,
    name: 'All Platforms',
    color: 'text-primary',
  },
  youtube: {
    icon: Youtube,
    name: 'YouTube',
    color: 'text-[#FF0000]',
  },
  instagram: {
    icon: Instagram,
    name: 'Instagram',
    color: 'text-[#E4405F]',
  },
  twitter: {
    icon: Twitter,
    name: 'Twitter',
    color: 'text-[#1DA1F2]',
  },
  linkedin: {
    icon: Linkedin,
    name: 'LinkedIn',
    color: 'text-[#0A66C2]',
  },
}; 