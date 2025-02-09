import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/auth';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  is_google_auth?: boolean;
  username?: string;
  bio?: string;
  purpose?: string;
  referral_source?: string;
  is_onboarded?: boolean;
}

interface OnboardingData {
  username: string;
  bio?: string;
  purpose?: string;
  referral_source?: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authApi.verifyToken();
      setUser(response.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await authApi.signIn({ email, password });
    setUser(response.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await authApi.signUp({ name, email, password });
    setUser(response.user);
  };

  const signInWithGoogle = async (credential: string) => {
    const response = await authApi.signInWithGoogle(credential);
    setUser(response.user);
  };

  const signOut = async () => {
    await authApi.signOut();
    setUser(null);
  };

  const completeOnboarding = async (data: OnboardingData) => {
    try {
      const response = await authApi.completeOnboarding(data);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 