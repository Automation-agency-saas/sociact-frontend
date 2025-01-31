import axiosInstance from './config';

export type CommentPlatform = 'instagram' | 'youtube' | 'twitter';

interface CommentAutomationRequest {
  post_url: string;
  platform: CommentPlatform;
  tone: string;
  style: string;
}

interface CommentAutomationResponse {
  success: boolean;
  message: string;
  comments_processed?: number;
}

class CommentAutomationService {
  async startAutomation(request: CommentAutomationRequest): Promise<CommentAutomationResponse> {
    try {
      const response = await axiosInstance.post<CommentAutomationResponse>(
        '/api/v1/comment-automation/start',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error starting automation:', error);
      throw error;
    }
  }

  async checkInstagramAuth(): Promise<boolean> {
    try {
      const response = await axiosInstance.get<{ auth_status: boolean }>(
        '/api/v1/comment-automation/instagram/auth/check'
      );
      return response.data.auth_status;
    } catch (error) {
      console.error('Error checking Instagram auth:', error);
      return false;
    }
  }

  async connectInstagram(code: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<{ success: boolean; message: string }>(
        '/api/v1/comment-automation/instagram/auth',
        { code }
      );
      return response.data;
    } catch (error) {
      console.error('Error connecting Instagram:', error);
      throw error;
    }
  }
}

export const commentAutomationService = new CommentAutomationService(); 