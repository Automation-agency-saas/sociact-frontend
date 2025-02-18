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
  image?: string;
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
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855169/Screenshot_2025-02-18_at_10.30.41_AM_fwys2r.png',
  },
  {
    name: 'ReelSpark',
    title: 'Reel Spark',
    description: 'Create engaging reel concepts that capture attention',
    icon: Sparkles,
    category: 'ideation',
    platforms: ['instagram'],
    url: '/instagram/idea-generator',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855170/Screenshot_2025-02-18_at_10.31.48_AM_folrx3.png',
  },
  {
    name: 'ThreadMind',
    title: 'Thread Mind',
    description: 'Generate viral ideas for twitter',
    icon: Sparkles,
    category: 'ideation',
    platforms: ['twitter'],
    url: '/twitter/idea-generator',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855170/Screenshot_2025-02-18_at_10.32.31_AM_ht7ynv.png',
  },
  {
    name: 'ProMind',
    title: 'Pro Mind',
    description: 'Generate professional posts for linkedin',
    icon: Sparkles,
    category: 'ideation',
    platforms: ['linkedin'],
    url: '/linkedin/idea-generator',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855496/af0x11nuag0igjq0xii4.png',
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
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855169/Screenshot_2025-02-18_at_10.30.55_AM_zwkldi.png',
  },
  {
    name: 'CaptionCraft',
    title: 'Caption Craft',
    description: 'Generate engaging captions for your posts',
    icon: MessageSquare,
    category: 'content',
    platforms: ['instagram'],
    url: '/instagram/caption-generator',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855770/orokzg5dy4hivg7aznc0.png',
  },
  {
    name: 'ThreadCraft',
    title: 'Thread Craft',
    description: 'Create viral thread for twitter with AI',
    icon: MessageSquare,
    category: 'content',
    platforms: ['twitter'],
    url: '/twitter/thread-generator',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855493/ebxkrek7jbbetqn6ebgl.png',
  },
  {
    name: 'ProCraft',
    title: 'Pro Craft',
    description: 'Create professional post ideas for linkedin',
    icon: MessageSquare,
    category: 'content',
    platforms: ['linkedin'],
    url: '/linkedin/post-generator',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855776/ls37k0lq9h3uadu19hiy.png',
  },
  {
    name: 'ThumbnailGen',
    title: 'Thumbnail Gen',
    description: 'Create stunning thumbnails from text description',
    icon: Palette,
    category: 'content',
    platforms: ['youtube'],
    url: '/youtube/thumbnail-generator',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855769/h2v1bvv5zmgq4aulmgkd.png',
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
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855169/Screenshot_2025-02-18_at_10.32.09_AM_mzfkag.png',
  },
  {
    name: 'YoutubeCommentPro',
    title: 'Auto Comment',
    description: 'Automate engaging responses to comments on your videos',
    icon: Sparkles,
    category: 'engagement',
    platforms: ['youtube'],
    url: '/youtube/comment-automation',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855170/Screenshot_2025-02-18_at_10.31.15_AM_vlnary.png',
  },
  {
    name: 'TwitterCommentPro',
    title: 'Auto Comment',
    description: 'Automate engaging responses to comments on your tweets',
    icon: Sparkles,
    category: 'engagement',
    platforms: ['twitter'],
    url: '/twitter/comment-automation',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855171/Screenshot_2025-02-18_at_10.32.51_AM_hzddyg.png',
  },
  {
    name: 'LinkedinPostPro',
    title: 'Linkedin Post Assistant',
    description: 'Enhance your LinkedIn posts with AI and post them automatically',
    icon: Sparkles,
    category: 'engagement',
    platforms: ['linkedin'],
    url: '/linkedin/post-automation',
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855492/hlkkbk6d8kj5mmsljtmx.png',
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
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855498/v3efwdbfbyyxwzooa8rt.png',
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
    image: 'https://res.cloudinary.com/dvuohzc5b/image/upload/v1739855171/Screenshot_2025-02-18_at_10.31.38_AM_w2uojt.png',
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