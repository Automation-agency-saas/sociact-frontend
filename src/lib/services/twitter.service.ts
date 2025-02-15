import { API_URL } from '@/lib/constants';

class TwitterService {
  private baseUrl = `${API_URL}/api/v1/twitter`;
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async checkAuthStatus(): Promise<{ isAuthenticated: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/status`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check auth status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking Twitter auth status:', error);
      return { isAuthenticated: false };
    }
  }

  async getAuthUrl(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/url`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error getting Twitter auth URL:', error);
      throw error;
    }
  }

  async handleAuthCallback(code: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/callback`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete Twitter authentication');
      }

      const data = await response.json();
      return { success: true };
    } catch (error) {
      console.error('Error handling Twitter auth callback:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to complete Twitter authentication' 
      };
    }
  }

  async startAutomation(params: {
    tweet_url: string;
    tone: string;
    length: string;
    strategy: string;
    include_hashtags: boolean;
    custom_prompt?: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/automation/start`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to start automation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting Twitter automation:', error);
      throw error;
    }
  }

  async stopAutomation() {
    try {
      const response = await fetch(`${this.baseUrl}/automation/stop`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });

      if (!response.ok) {
        throw new Error('Failed to stop automation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error stopping Twitter automation:', error);
      throw error;
    }
  }

  async getAutomationLogs() {
    try {
      const response = await fetch(`${this.baseUrl}/automation/logs`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch automation logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Twitter automation logs:', error);
      throw error;
    }
  }
}

export const twitterService = new TwitterService(); 