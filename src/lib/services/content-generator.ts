import axiosInstance from './config';

export type ContentType = 'youtube_script' | 'twitter_thread' | 'linkedin_post' | 'instagram_caption';

interface YouTubeScriptRequest {
  title: string;
  description: string;
  length: string;
}

interface TwitterThreadRequest {
  description: string;
  tweet_count: number;
}

interface LinkedInPostRequest {
  description: string;
  tone: string;
}

interface InstagramCaptionRequest {
  description: string;
  style: string;
  word_count: number;
}

interface ContentRequest {
  content_type: ContentType;
  youtube_script?: YouTubeScriptRequest;
  twitter_thread?: TwitterThreadRequest;
  linkedin_post?: LinkedInPostRequest;
  instagram_caption?: InstagramCaptionRequest;
}

interface ContentResponse {
  content: string;
  status: string;
  message?: string;
}

class ContentGeneratorService {
  private async generateContent(request: ContentRequest): Promise<ContentResponse> {
    const response = await axiosInstance.post<ContentResponse>('/api/v1/content/generate', request);
    return response.data;
  }

  async generateYouTubeScript(title: string, description: string, length: string): Promise<string> {
    const request: ContentRequest = {
      content_type: 'youtube_script',
      youtube_script: {
        title,
        description,
        length
      }
    };
    const response = await this.generateContent(request);
    return response.content;
  }

  async generateTwitterThread(description: string, tweetCount: number): Promise<ContentResponse> {
    const request: ContentRequest = {
      content_type: 'twitter_thread',
      twitter_thread: {
        description,
        tweet_count: tweetCount
      }
    };
    return await this.generateContent(request);
  }

  async generateLinkedInPost(description: string, tone: string): Promise<ContentResponse> {
    const request: ContentRequest = {
      content_type: 'linkedin_post',
      linkedin_post: {
        description,
        tone
      }
    };
    return await this.generateContent(request);
  }

  async generateInstagramCaption(description: string, style: string, wordCount: number): Promise<string> {
    const request: ContentRequest = {
      content_type: 'instagram_caption',
      instagram_caption: {
        description,
        style,
        word_count: wordCount
      }
    };
    const response = await this.generateContent(request);
    return response.content;
  }
}

export const contentGeneratorService = new ContentGeneratorService(); 