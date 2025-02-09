import api from './config';

interface Credentials {
  email: string;
  password: string;
}

interface UserData {
  email: string;
  password: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  is_google_auth?: boolean;
  created_at?: string;
  updated_at?: string;
  username?: string;
  bio?: string;
  purpose?: string;
  referral_source?: string;
  is_onboarded?: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

interface OnboardingData {
  username: string;
  bio?: string;
  purpose?: string;
  referralSource?: string;
  profilePicture?: string;
}

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
class AuthApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/v1/auth';
  }

  /**
   * Convert backend user object to frontend User interface
   */
  private normalizeUser(user: any): User {
    // Handle SQLAlchemy model
    if (user && typeof user === 'object') {
      // Convert UUID to string if needed
      const id = user.id?.toString() || user.id || '';
      
      return {
        id: id,
        email: user.email || '',
        name: user.name || '',
        picture: user.picture || undefined,
        is_google_auth: user.is_google_auth || false,
        created_at: user.created_at ? new Date(user.created_at).toISOString() : undefined,
        updated_at: user.updated_at ? new Date(user.updated_at).toISOString() : undefined,
        username: user.username || undefined,
        bio: user.bio || undefined,
        purpose: user.purpose || undefined,
        referral_source: user.referral_source || undefined,
        is_onboarded: user.is_onboarded || false
      };
    }

    // Return default user if input is invalid
    return {
      id: '',
      email: '',
      name: '',
      is_google_auth: false
    };
  }

  /**
   * Sign in a user
   * @param credentials - User credentials
   * @returns User data and token
   */
  async signIn(credentials: Credentials): Promise<AuthResponse> {
    try {
      const response = await api.post<any>(`${this.baseUrl}/login`, {
        email: credentials.email,
        password: credentials.password
      });
      
      const normalizedResponse: AuthResponse = {
        token: response.data.token || response.data.access_token,
        user: this.normalizeUser(response.data.user),
        message: response.data.message || 'Successfully signed in'
      };

      if (normalizedResponse.token) {
        localStorage.setItem('token', normalizedResponse.token);
        localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      }
      
      return normalizedResponse;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  /**
   * Sign up a new user
   * @param userData - New user data
   * @returns Created user data
   */
  async signUp(userData: UserData): Promise<AuthResponse> {
    try {
      const response = await api.post<any>(`${this.baseUrl}/register`, {
        email: userData.email,
        password: userData.password,
        name: userData.name
      });

      // Log the response for debugging
      console.log('Register response:', response.data);

      const normalizedResponse: AuthResponse = {
        token: response.data.token || response.data.access_token,
        user: this.normalizeUser(response.data.user),
        message: response.data.message || 'Successfully registered'
      };

      if (normalizedResponse.token) {
        localStorage.setItem('token', normalizedResponse.token);
        localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      }

      return normalizedResponse;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  /**
   * Sign in with Google
   * @param credential - Google credential token
   * @returns User data and token
   */
  async signInWithGoogle(credential: string): Promise<AuthResponse> {
    try {
      const response = await api.post<any>(`${this.baseUrl}/google`, { credential });

      const normalizedResponse: AuthResponse = {
        token: response.data.token || response.data.access_token,
        user: this.normalizeUser(response.data.user),
        message: response.data.message || 'Successfully authenticated with Google'
      };

      if (normalizedResponse.token) {
        localStorage.setItem('token', normalizedResponse.token);
        localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      }

      return normalizedResponse;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Verify the current auth token
   * @returns Verification result
   */
  async verifyToken(): Promise<{ authenticated: boolean; user: User }> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await api.get<any>(`${this.baseUrl}/check`);
      
      const normalizedResponse = {
        authenticated: response.data.authenticated || false,
        user: this.normalizeUser(response.data.user)
      };
      
      // Verify that the response contains the expected data
      if (!normalizedResponse.authenticated || !normalizedResponse.user) {
        throw new Error('Invalid auth response');
      }
      
      // Update stored user data in case it changed
      localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      
      return normalizedResponse;
    } catch (error) {
      console.error('Error verifying token:', error);
      // Clear auth data on verification failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  /**
   * Get the current authenticated user
   * @returns User data or null if not authenticated
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if a user is authenticated
   * @returns True if authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Complete user onboarding
   * @param data - Onboarding data
   * @returns Updated user data
   */
  async completeOnboarding(data: OnboardingData): Promise<AuthResponse> {
    try {
      const requestData = {
        username: data.username,
        bio: data.bio,
        purpose: data.purpose,
        referral_source: data.referralSource,
        picture: data.profilePicture
      };

      // Log the data being sent
      console.log('Sending onboarding data:', {
        ...requestData,
        picture: requestData.picture ? 'URL present' : 'No picture'
      });

      const response = await api.post<any>(`${this.baseUrl}/onboarding`, requestData);
      
      // Log the response
      console.log('Onboarding response:', {
        ...response.data,
        user: response.data.user ? {
          ...response.data.user,
          picture: response.data.user.picture ? 'URL present' : 'No picture'
        } : null
      });

      const normalizedResponse: AuthResponse = {
        token: response.data.token || response.data.access_token,
        user: this.normalizeUser(response.data.user),
        message: response.data.message || 'Successfully completed onboarding'
      };

      if (normalizedResponse.user) {
        localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      }

      return normalizedResponse;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const authApi = new AuthApi();

// Export the class for testing purposes
export default AuthApi; 