import { API_URL } from '../config';

export enum CommentPlatform {
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  TWITTER = 'twitter'
}

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
  stats: AutomationStats;
}

class CommentAutomationService {
  private baseUrl = `${API_URL}/api/v1`;

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async startAutomation(request: CommentAutomationRequest): Promise<CommentAutomationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/comment-automation/start`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start automation');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error starting automation:', error);
      throw error;
    }
  }
}

export const commentAutomationService = new CommentAutomationService(); 