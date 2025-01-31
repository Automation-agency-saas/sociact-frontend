import { API_URL, INSTAGRAM_CLIENT_ID, INSTAGRAM_REDIRECT_URI } from '../config';

interface InstagramAuthResponse {
  success: boolean;
  message: string;
  auth_status: boolean;
}

class InstagramService {
  private baseUrl = `${API_URL}/api/v1`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async getAuthUrl(): Promise<string> {
    const scope = [
      'instagram_business_basic',
      'instagram_business_manage_messages',
      'instagram_business_manage_comments',
      'instagram_business_content_publish',
      'instagram_business_manage_insights'
    ].join(',');
    
    return `https://www.instagram.com/oauth/authorize?` + 
      `enable_fb_login=0` +
      `&force_authentication=1` +
      `&client_id=${INSTAGRAM_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(INSTAGRAM_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&state=instagram`;
  }

  async handleAuthCallback(code: string): Promise<InstagramAuthResponse> {
    try {
      console.log('Handling Instagram auth callback with code:', code);
      
      // First, exchange the code for tokens
      const response = await fetch(`${this.baseUrl}/comment-automation/instagram/auth?code=${encodeURIComponent(code)}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Instagram auth error response:', errorData);
        throw new Error('Failed to authenticate with Instagram');
      }

      const data = await response.json();
      console.log('Instagram auth success response:', data);

      // Check if we got a successful response
      if (!data.success) {
        console.error('Instagram auth failed:', data.message);
        throw new Error(data.message || 'Failed to authenticate with Instagram');
      }

      // Now check the auth status to confirm everything is set up
      const authStatus = await this.checkAuthStatus();
      console.log('Final Instagram auth status:', authStatus);

      return authStatus;
    } catch (error) {
      console.error('Instagram auth error:', error);
      throw error;
    }
  }

  async checkAuthStatus(): Promise<InstagramAuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/comment-automation/instagram/auth/check`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to check Instagram auth status');
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram auth status check error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/instagram/disconnect`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect Instagram account');
      }
    } catch (error) {
      console.error('Instagram disconnect error:', error);
      throw error;
    }
  }
}

export const instagramService = new InstagramService(); 