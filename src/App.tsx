import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './lib/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './components/theme-provider';
import { AuthCallback } from './pages/auth/AuthCallback';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { WelcomeBackModal } from './components/onboarding/WelcomeBackModal';
import { useState, useEffect } from 'react';

import LandingPage from './pages/LandingPage';
// Landing page components
import "./App.css";
// Auth pages
import { AuthLayout } from "./pages/auth/AuthLayout";

// App pages
import Home from "./pages/Home";
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Profile } from "./pages/Profile";

// Import tool pages
import { YouTubeIdeaGeneratorPage } from "./pages/tools/youtube/IdeaGenerator";
import { YouTubeScriptGeneratorPage } from "./pages/tools/youtube/ScriptGenerator";
import { YouTubeThumbnailGeneratorPage } from "./pages/tools/youtube/ThumbnailGenerator";
import { YouTubeSEOOptimizerPage } from "./pages/tools/youtube/SEOOptimizer";
import { InstagramIdeaGeneratorPage } from './pages/tools/instagram/IdeaGenerator';
import { InstagramCaptionGeneratorPage } from './pages/tools/instagram/CaptionGenerator';
import { InstagramCommentAutomationPage } from './pages/tools/instagram/CommentAutomation';
// import { TwitterIdeaGeneratorPage } from './pages/tools/twitter/IdeaGenerator';
import { LinkedInIdeaGeneratorPage } from './pages/tools/linkedin/IdeaGenerator';
import { LinkedInPostGeneratorPage } from './pages/tools/linkedin/PostGenerator';
import { FacebookCommentAutomationPage } from './pages/tools/facebook/CommentAutomation';
import { TwitterIdeaGeneratorPage } from './pages/tools/twitter/IdeaGenerator';
import {TwitterThreadGeneratorPage} from './pages/tools/twitter/ThreadGenerator'



function AppRoutes() {
  const { isAuthenticated, user, completeOnboarding } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.is_onboarded) {
        setShowOnboarding(true);
      } else {
        // Show welcome back modal if user is returning
        const lastVisit = localStorage.getItem('lastVisit');
        const now = new Date().toISOString();
        if (!lastVisit || new Date(lastVisit).getDate() !== new Date(now).getDate()) {
          setShowWelcomeBack(true);
          localStorage.setItem('lastVisit', now);
        }
      }
    }
  }, [isAuthenticated, user]);

  const handleOnboardingComplete = async (data: any) => {
    try {
      await completeOnboarding(data);
      setShowOnboarding(false);
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/home" /> : <LandingPage />
        } />
        
        {/* Auth Routes */}
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Instagram Auth Callback - Separate from regular auth flow */}
        <Route path="/auth/instagram/callback" element={<AuthCallback />} />
        <Route path="/auth/youtube/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile/me" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Tool Routes */}
        <Route path="/youtube/idea-generator" element={
          <ProtectedRoute>
            <YouTubeIdeaGeneratorPage />
          </ProtectedRoute>
        } />
        <Route path="/youtube/script-generator" element={
          <ProtectedRoute>
            <YouTubeScriptGeneratorPage />
          </ProtectedRoute>
        } />
        <Route path="/youtube/thumbnail-generator" element={
          <ProtectedRoute>
            <YouTubeThumbnailGeneratorPage />
          </ProtectedRoute>
        } />
        <Route path="/youtube/seo-optimizer" element={
          <ProtectedRoute>
            <YouTubeSEOOptimizerPage />
          </ProtectedRoute>
        } />
        
        {/* Instagram Tools */}
        <Route path="/instagram/idea-generator" element={
          <ProtectedRoute>
            <InstagramIdeaGeneratorPage />
          </ProtectedRoute>
        } />
        <Route path="/instagram/caption-generator" element={
          <ProtectedRoute>
            <InstagramCaptionGeneratorPage />
          </ProtectedRoute>
        } />
        <Route path="/instagram/comment-automation" element={
          <ProtectedRoute>
            <InstagramCommentAutomationPage />
          </ProtectedRoute>
        } />
        
        {/* Twitter Tools */}
        <Route path="/twitter/idea-generator" element={
          <ProtectedRoute>
            <TwitterIdeaGeneratorPage />
          </ProtectedRoute>
        } />
        <Route path="/twitter/thread-generator" element={
          <ProtectedRoute>
            <TwitterThreadGeneratorPage />
          </ProtectedRoute>
        } />
        
        {/* LinkedIn Tools */}
        <Route path="/linkedin/idea-generator" element={
          <ProtectedRoute>
            <LinkedInIdeaGeneratorPage />
          </ProtectedRoute>
        } />
        <Route path="/linkedin/post-generator" element={
          <ProtectedRoute>
            <LinkedInPostGeneratorPage />
          </ProtectedRoute>
        } />
        
        {/* Facebook Tools */}
        <Route path="/facebook/comment-automation" element={
          <ProtectedRoute>
            <FacebookCommentAutomationPage />
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      {user && (
        <WelcomeBackModal
          isOpen={showWelcomeBack}
          onClose={() => setShowWelcomeBack(false)}
          user={user}
        />
      )}
    </>
  );
}

function App() {
  // console.log('App mounting...');
  // console.log('Using Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="sociact-theme">
      <GoogleOAuthProvider 
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        onScriptLoadSuccess={() => {
          // console.log('Google OAuth script loaded successfully');
          // console.log('Current origin:', window.location.origin);
        }}
        onScriptLoadError={() => {
          // console.error('Failed to load Google OAuth script');
        }}
      >
        <Router>
          <AuthProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
