import { API_URL } from '../config';

export type CommentPlatform = 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'linkedin';

interface AutomationRequest {
  tone: string;
  style: string;
  platform: CommentPlatform;
  post_url?: string;
  use_latest_post?: boolean;
}

interface AutomationResponse {
  success: boolean;
  message: string;
  log_id: string;
  post_url?: string;
  stats: {
    comments_processed: number;
    successful_responses: number;
    failed_responses: number;
  };
}

interface AutomationLog {
  id: string;
  user_id: string;
  tool_type: string;
  platform: string;
  post_url?: string;
  settings: {
    tone: string;
    style: string;
  };
  stats: {
    comments_processed: number;
    successful_responses: number;
    failed_responses: number;
  };
  created_at: string;
  completed_at?: string;
  status: string;
  error?: string;
}

class CommentAutomationService {
  private baseUrl = `${API_URL}/api/v1/comment-automation`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async startAutomation(request: AutomationRequest): Promise<AutomationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/start`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
        credentials: 'include',
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

  async getLogs(): Promise<AutomationLog[]> {
    try {
      const response = await fetch(`${this.baseUrl}/logs`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch automation logs');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching automation logs:', error);
      throw error;
    }
  }

  async getAutomationStats(sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/automation/stats/${sessionId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch automation stats');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching automation stats:', error);
      throw error;
    }
  }

  async validatePostUrl(platform: CommentPlatform, postUrl: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${platform}/posts/validate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ post_url: postUrl }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to validate post URL');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error validating post URL:', error);
      throw error;
    }
  }

  async getLatestPost(platform: CommentPlatform): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${platform}/posts/latest`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch latest post');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching latest post:', error);
      throw error;
    }
  }
}

export const commentAutomationService = new CommentAutomationService(); 