import axiosInstance from './config';

export interface YouTubeIdea {
  title: string;
  description: string;
  engagement: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  thumbnail_suggestion: string;
  tags: string[];
  estimated_duration: string;
}

export interface YouTubeIdeaResponse {
  id: string;
  generation_type: 'preferences' | 'custom' | 'surprise';
  genre?: string;
  target_audience?: string;
  video_type?: string;
  focus_area?: string;
  custom_prompt?: string;
  ideas: YouTubeIdea[];
  created_at: string;
}

export interface YouTubePreferencesRequest {
  genre: string;
  target_audience: string;
  video_type: string;
  focus_area: string;
}

export interface YouTubeCustomRequest {
  prompt: string;
}

export interface YouTubeIdeaHistoryResponse {
  items: YouTubeIdeaResponse[];
}

class YouTubeService {
  async generateIdeasFromPreferences(data: YouTubePreferencesRequest): Promise<YouTubeIdeaResponse> {
    const response = await axiosInstance.post('/api/v1/youtube/generate-from-preferences', data);
    return response.data;
  }

  async generateCustomIdeas(data: YouTubeCustomRequest): Promise<YouTubeIdeaResponse> {
    const response = await axiosInstance.post('/api/v1/youtube/generate-custom', data);
    return response.data;
  }

  async generateSurpriseIdeas(): Promise<YouTubeIdeaResponse> {
    const response = await axiosInstance.post('/api/v1/youtube/generate-surprise', {});
    return response.data;
  }

  async getIdeaHistory(limit: number = 10, generation_type?: string): Promise<YouTubeIdeaHistoryResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (generation_type) params.append('generation_type', generation_type);

    const response = await axiosInstance.get(`/api/v1/youtube/history?${params.toString()}`);
    return response.data;
  }

  async deleteIdea(ideaId: string): Promise<void> {
    await axiosInstance.delete(`/api/v1/youtube/history/${ideaId}`);
  }
}

export const youtubeService = new YouTubeService(); 