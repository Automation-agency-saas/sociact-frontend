import { API_URL } from '../config';

interface LinkedInAuthResponse {
  auth_status: boolean;
  message?: string;
  success: boolean;
}

interface AutomationLog {
  id: string;
  created_at: string;
  completed_at?: string;
  status: string;
  stats: {
    comments_processed: number;
    successful_responses: number;
    failed_responses: number;
  };
  post_url?: string;
  settings: {
    tone: string;
    style: string;
  };
}

interface AutomationResponse {
  success: boolean;
  message: string;
  stats: {
    comments_processed: number;
    successful_responses: number;
    failed_responses: number;
  };
}

interface StartAutomationParams {
  postUrl?: string;
  useLatestPost: boolean;
  tone: string;
  style: string;
}

interface PostValidationResponse {
  isValid: boolean;
  postId?: string;
  error?: string;
}

interface CreatePostRequest {
  content: string;
  enhance?: boolean;
  tone?: string;
}

interface CreatePostResponse {
  success: boolean;
  post_id?: string;
  enhanced_content?: string;
  error?: string;
}

class LinkedInService {
  private baseUrl = `${API_URL}/api/v1/linkedin`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async checkAuthStatus(): Promise<LinkedInAuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/status`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to check LinkedIn auth status');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error checking LinkedIn auth status:', error);
      throw error;
    }
  }

  async getAuthUrl(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/url`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get LinkedIn auth URL');
      }

      const data = await response.json();
      
      // Save the state for verification during callback
      localStorage.setItem('linkedin_auth_state', data.state);
      localStorage.setItem('linkedin_auth_return_state', JSON.stringify({ platform: 'linkedin' }));
      
      return data.auth_url;
    } catch (error: any) {
      console.error('Error getting LinkedIn auth URL:', error);
      throw error;
    }
  }

  async handleAuthCallback(code: string): Promise<LinkedInAuthResponse> {
    try {
      // Get the stored state from localStorage
      const storedState = localStorage.getItem('linkedin_auth_state');
      if (!storedState) {
        throw new Error('No state found. Please try connecting again.');
      }

      // At this point, TypeScript knows storedState is a string
      const response = await fetch(
        `${this.baseUrl}/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(storedState)}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('LinkedIn auth error response:', data);
        throw new Error(data.detail || data.message || 'Failed to authenticate with LinkedIn');
      }

      // Clean up stored state after successful callback
      localStorage.removeItem('linkedin_auth_state');

      console.log('LinkedIn auth response:', data);
      return {
        ...data,
        success: data.success === true,
        auth_status: data.auth_status === true
      };
    } catch (error: any) {
      console.error('Error handling LinkedIn auth callback:', error);
      throw error;
    }
  }

  async getLatestPost(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/latest-post`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch latest LinkedIn post');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching latest LinkedIn post:', error);
      throw error;
    }
  }

  async getAutomationLogs(): Promise<AutomationLog[]> {
    try {
      const response = await fetch(`${this.baseUrl}/automation/logs`, {
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

  async startAutomation(params: StartAutomationParams): Promise<AutomationResponse> {
    try {
      let postId: string;

      if (params.useLatestPost) {
        const latestPost = await this.getLatestPost();
        postId = latestPost.id;
      } else if (params.postUrl) {
        const validationResponse = await this.validatePostUrl(params.postUrl);
        if (!validationResponse.isValid) {
          throw new Error(validationResponse.error || 'Invalid post URL');
        }
        postId = validationResponse.postId;
      } else {
        throw new Error('Either post URL or use latest post must be specified');
      }

      const response = await fetch(`${this.baseUrl}/automate-replies`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ 
          post_id: postId,
          settings: {
            tone: params.tone,
            style: params.style
          }
        }),
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

  async validatePostUrl(postUrl: string): Promise<PostValidationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/validate-post`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ post_url: postUrl }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to validate LinkedIn post URL');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error validating LinkedIn post URL:', error);
      throw error;
    }
  }

  async createPost(params: CreatePostRequest): Promise<CreatePostResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/post`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(params),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create LinkedIn post');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error creating LinkedIn post:', error);
      throw error;
    }
  }
}

export const linkedinService = new LinkedInService(); 