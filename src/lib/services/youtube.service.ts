import { API_URL } from '../config';
import { AutomationConfig, AutomationStats, AutoResponse } from '../types/youtube';

class YouTubeService {
  private baseUrl = `${API_URL}/api/v1/youtube`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async checkAuthStatus(): Promise<{ isConnected: boolean; channelId?: string; expiresAt?: string }> {
    const response = await fetch(`${this.baseUrl}/auth/status`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async handleAuth(code: string): Promise<{
    status: string;
    data?: { platform_user_id: string; channel_name: string };
    error?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/auth`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ code })
    });
    return response.json();
  }

  async refreshToken(): Promise<{ access_token: string; expires_at: string }> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    return response.json();
  }

  async startAutoComments(config: AutomationConfig): Promise<{
    automationId: string;
    status: string;
    initialStats: AutomationStats;
  }> {
    const response = await fetch(`${this.baseUrl}/comments/auto`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(config)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to start automation');
    }
    
    const data = await response.json();
    
    // Convert date strings to Date objects
    if (data.initialStats.startTime) {
      data.initialStats.startTime = new Date(data.initialStats.startTime);
    }
    if (data.initialStats.endTime) {
      data.initialStats.endTime = new Date(data.initialStats.endTime);
    }
    
    return data;
  }

  async processInstantComments(config: AutomationConfig): Promise<{
    status: string;
    stats: {
      totalComments: number;
      successfulReplies: number;
      failedReplies: number;
      remainingComments: number;
    };
    logs: Array<{
      id: string;
      text: string;
      timestamp: string;
      type: 'success' | 'error' | 'info';
      userName?: string;
      commentText?: string;
      generatedReply?: string;
    }>;
  }> {
    const response = await fetch(`${this.baseUrl}/comments/instant`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(config)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process comments');
    }
    
    return response.json();
  }

  async getAutomationStatus(automationId: string): Promise<{
    status: string;
    stats: {
      totalComments: number;
      successfulReplies: number;
      failedReplies: number;
      remainingComments: number;
      alreadyReplied: number;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/comments/status/${automationId}`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to get automation status');
    }
    
    return response.json();
  }

  async stopAutomation(automationId: string): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/comments/stop/${automationId}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to stop automation');
    }
    
    return response.json();
  }

  async getCommentHistory(limit: number = 10, offset: number = 0): Promise<{
    history: Array<{
      id: string;
      toolType: string;
      platform: string;
      settings: any;
      stats: {
        totalComments: number;
        successfulReplies: number;
        failedReplies: number;
        remainingComments: number;
        alreadyReplied: number;
      };
      status: string;
      createdAt: string;
      completedAt: string | null;
      error: string | null;
    }>;
  }> {
    const response = await fetch(
      `${this.baseUrl}/comments/history?limit=${limit}&offset=${offset}`,
      {
        headers: this.getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch comment history');
    }
    
    const data = await response.json();
    
    // Convert date strings to Date objects and ensure proper typing
    return {
      history: data.history.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt).toISOString(),
        completedAt: item.completedAt ? new Date(item.completedAt).toISOString() : null,
        stats: {
          totalComments: item.stats.total_comments || 0,
          successfulReplies: item.stats.successful_responses || 0,
          failedReplies: item.stats.failed_responses || 0,
          remainingComments: item.stats.remaining_comments || 0,
          alreadyReplied: item.stats.already_replied || 0
        }
      }))
    };
  }
}

export const youtubeService = new YouTubeService(); 