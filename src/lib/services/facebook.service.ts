import { API_URL } from '../config';

const FACEBOOK_CLIENT_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
const FACEBOOK_REDIRECT_URI = import.meta.env.VITE_FACEBOOK_REDIRECT_URI;

interface FacebookAuthResponse {
  success: boolean;
  message: string;
  auth_status: boolean;
}

interface FacebookUserDetails {
  user_id: string;
  username: string;
  id: string;
}

class FacebookService {
  private baseUrl = `${API_URL}/api/v1`;
  private static isAuthenticating = false;
  private static authTimeoutId: NodeJS.Timeout | null = null;
  private static lastAuthAttempt: number = 0;
  private static MIN_AUTH_INTERVAL = 2000;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  private clearAuthState() {
    if (FacebookService.authTimeoutId) {
      clearTimeout(FacebookService.authTimeoutId);
      FacebookService.authTimeoutId = null;
    }
    FacebookService.isAuthenticating = false;
  }

  async getAuthUrl(): Promise<string> {
    
    // Define required scopes for Facebook Business Login
    const scope = [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_show_list',
      'pages_read_engagement'
    ].join(',');
    
    // Construct auth URL according to Facebook docs
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth` +
      `?client_id=${FACEBOOK_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}` +
      `&display=page` +
      `&extras=${encodeURIComponent(JSON.stringify({"setup":{"channel":"IG_API_ONBOARDING"}}))}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scope)}`;
    
    return authUrl;
  }

  async handleAuthCallback(token: string): Promise<FacebookAuthResponse> {
    const now = Date.now();
    const timeSinceLastAttempt = now - FacebookService.lastAuthAttempt;

    if (timeSinceLastAttempt < FacebookService.MIN_AUTH_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, FacebookService.MIN_AUTH_INTERVAL - timeSinceLastAttempt));
    }

    if (FacebookService.isAuthenticating) {
      await new Promise(resolve => setTimeout(resolve, FacebookService.MIN_AUTH_INTERVAL));
      
      if (FacebookService.isAuthenticating) {
        console.error('Authentication still in progress after waiting');
        throw new Error('Authentication already in progress');
      }
    }

    try {
      FacebookService.isAuthenticating = true;
      FacebookService.lastAuthAttempt = Date.now();
            
      const response = await fetch(`${this.baseUrl}/comment-automation/facebook/auth`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_token: token }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Facebook auth error:', data);
        throw new Error(data.detail || 'Failed to authenticate with Facebook');
      }

      return data;
    } catch (error) {
      console.error('Facebook auth error:', error);
      throw error;
    } finally {
      FacebookService.authTimeoutId = setTimeout(() => {
        this.clearAuthState();
      }, FacebookService.MIN_AUTH_INTERVAL);
    }
  }

  async checkAuthStatus(): Promise<FacebookAuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/comment-automation/facebook/auth/check`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Auth status check error:', error);
        throw new Error(error.detail || 'Failed to check auth status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Auth status check error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/facebook/disconnect`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect Facebook account');
      }
    } catch (error) {
      console.error('Facebook disconnect error:', error);
      throw error;
    }
  }

  async getUserDetails(): Promise<FacebookUserDetails> {
    try {
      const response = await fetch(`${this.baseUrl}/comment-automation/facebook/user`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch user details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }
}

export const facebookService = new FacebookService(); 