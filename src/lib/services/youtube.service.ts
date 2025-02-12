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
    return response.json();
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
}

export const youtubeService = new YouTubeService(); 