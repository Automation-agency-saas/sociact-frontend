export interface YouTubeAuthResponse {
  status: string;
  data?: {
    platform_user_id: string;
    channel_name: string;
  };
  error?: string;
}

export interface YouTubeComment {
  id: string;
  authorDisplayName: string;
  authorChannelId: string;
  textDisplay: string;
  publishedAt: string;
  updatedAt: string;
}

export interface AutomationConfig {
  mode: 'auto' | 'instant';
  videoUrl?: string;
  useLatestVideo: boolean;
  checkInterval: string;
  responseTone: string;
  responseLength: string;
  customPrompt: string;
  includeEmojis: boolean;
  maxRepliesPerHour: number;
}

export interface AutomationStats {
  totalComments: number;
  successfulReplies: number;
  failedReplies: number;
  remainingComments: number;
  startTime?: string;
  endTime?: string;
}

export interface AutoResponse {
  id: string;
  text: string;
  timestamp: string;
  type?: 'success' | 'info' | 'error';
  commentText?: string;
  userName?: string;
  generatedReply?: string;
} 