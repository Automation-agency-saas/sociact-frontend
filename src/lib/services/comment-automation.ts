import { API_URL } from '../config';

export type CommentPlatform = 'instagram' | 'facebook';

export interface CommentAutomationRequest {
  platform: CommentPlatform;
  tone: string;
  style: string;
}

export interface AutomationStats {
  comments_processed: number;
  successful_responses: number;
  failed_responses: number;
}

export interface CommentAutomationResponse {
  success: boolean;
  message: string;
  log_id: string;
  post_url: string;
  stats: AutomationStats;
}

class CommentAutomationService {
  private baseUrl = `${API_URL}/api/v1`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async startAutomation(params: {
    tone: string;
    style: string;
    platform: CommentPlatform;
  }): Promise<CommentAutomationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/comment-automation/start`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(params),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start automation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting automation:', error);
      throw error;
    }
  }
}

export const commentAutomationService = new CommentAutomationService(); 