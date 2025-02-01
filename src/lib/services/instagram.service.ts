import { API_URL } from '../config';

// Hardcoded Instagram credentials (for testing only)
const INSTAGRAM_CLIENT_ID = import.meta.env.VITE_INSTAGRAM_CLIENT_ID ;
const INSTAGRAM_REDIRECT_URI = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI;

interface InstagramAuthResponse {
  success: boolean;
  message: string;
  auth_status: boolean;
}

interface InstagramUserDetails {
  user_id: string;
  username: string;
  id: string;
}

class InstagramService {
  private baseUrl = `${API_URL}/api/v1`;
  private static isAuthenticating = false;
  private static authTimeoutId: NodeJS.Timeout | null = null;
  private static lastAuthAttempt: number = 0;
  private static MIN_AUTH_INTERVAL = 2000; // Minimum time between auth attempts in ms

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  private clearAuthState() {
    if (InstagramService.authTimeoutId) {
      clearTimeout(InstagramService.authTimeoutId);
      InstagramService.authTimeoutId = null;
    }
    InstagramService.isAuthenticating = false;
  }

  async getAuthUrl(): Promise<string> {
    console.log('Generating Instagram auth URL...');
    
    // Define required scopes exactly as per Instagram docs
    const scope = [
      'instagram_business_basic',
      'instagram_business_manage_messages',
      'instagram_business_manage_comments',
      'instagram_business_content_publish'
    ].join(',');
    
    // Construct auth URL according to Instagram docs
    const authUrl = `https://www.instagram.com/oauth/authorize` +
      `?client_id=${INSTAGRAM_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(INSTAGRAM_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=instagram`;  // Add state parameter back for our callback handling
    
    console.log('Generated auth URL:', authUrl);
    console.log('Redirect URI:', INSTAGRAM_REDIRECT_URI);
    console.log('Scopes:', scope);
    
    return authUrl;
  }

  async handleAuthCallback(code: string): Promise<InstagramAuthResponse> {
    const now = Date.now();
    const timeSinceLastAttempt = now - InstagramService.lastAuthAttempt;

    // Check if we're trying to authenticate too quickly
    if (timeSinceLastAttempt < InstagramService.MIN_AUTH_INTERVAL) {
      console.log('Auth attempt too soon after last attempt, waiting...');
      await new Promise(resolve => setTimeout(resolve, InstagramService.MIN_AUTH_INTERVAL - timeSinceLastAttempt));
    }

    // Check if authentication is already in progress
    if (InstagramService.isAuthenticating) {
      console.log('Authentication already in progress, waiting...');
      await new Promise(resolve => setTimeout(resolve, InstagramService.MIN_AUTH_INTERVAL));
      
      if (InstagramService.isAuthenticating) {
        console.error('Authentication still in progress after waiting');
        throw new Error('Authentication already in progress');
      }
    }

    try {
      InstagramService.isAuthenticating = true;
      InstagramService.lastAuthAttempt = Date.now();
      
      console.log('Handling Instagram auth callback with code:', code);
      
      // Clean the code by removing any hash fragments as per Instagram docs
      const cleanCode = code.split('#')[0];
      console.log('Cleaned auth code:', cleanCode);
      
      // Exchange the code for tokens via backend
      const response = await fetch(`${this.baseUrl}/comment-automation/instagram/auth`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: cleanCode }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Instagram auth error:', data);
        throw new Error(data.detail || 'Failed to authenticate with Instagram');
      }

      console.log('Instagram auth success:', data);
      return data;
    } catch (error) {
      console.error('Instagram auth error:', error);
      throw error;
    } finally {
      // Set a timeout to reset the auth state
      InstagramService.authTimeoutId = setTimeout(() => {
        this.clearAuthState();
      }, InstagramService.MIN_AUTH_INTERVAL);
    }
  }

  async checkAuthStatus(): Promise<InstagramAuthResponse> {
    try {
      console.log('Checking Instagram auth status...');
      const response = await fetch(`${this.baseUrl}/comment-automation/instagram/auth/check`, {
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
      console.log('Auth status response:', data);
      return data;
    } catch (error) {
      console.error('Auth status check error:', error);
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

  async getUserDetails(): Promise<InstagramUserDetails> {
    try {
      const response = await fetch(`${this.baseUrl}/comment-automation/instagram/user`, {
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

export const instagramService = new InstagramService(); 