import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./lib/context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./lib/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./components/theme-provider";
import { AuthCallback } from "./pages/auth/AuthCallback";
import { OnboardingModal } from "./components/onboarding/OnboardingModal";
import { WelcomeBackModal } from "./components/onboarding/WelcomeBackModal";
import { useState, useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import "./App.css";
import { AuthLayout } from "./pages/auth/AuthLayout";

// App pages
import Home from "./pages/Home";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { Profile } from "./pages/Profile";

// Import tool pages
import { YouTubeIdeaGeneratorPage } from "./pages/tools/youtube/IdeaGenerator";
import { YouTubeScriptGeneratorPage } from "./pages/tools/youtube/ScriptGenerator";
// import { YouTubeThumbnailGeneratorPage } from "./pages/tools/youtube/ThumbnailGenerator";
import { ThumbnailGenPage } from "./pages/tools/youtube/ThumbnailGenModal";
import { YouTubeSEOOptimizerPage } from "./pages/tools/youtube/SEOOptimizer";
import { YouTubeCommentAutomationPage } from "./pages/tools/youtube/CommentAutomation";
import { InstagramIdeaGeneratorPage } from "./pages/tools/instagram/IdeaGenerator";
import { InstagramCaptionGeneratorPage } from "./pages/tools/instagram/CaptionGenerator";
import { InstagramCommentAutomationPage } from "./pages/tools/instagram/CommentAutomation";
import { TwitterCommentAutomationPage } from "./pages/tools/twitter/CommentAutomation";
import { LinkedInIdeaGeneratorPage } from "./pages/tools/linkedin/IdeaGenerator";
import { LinkedInPostGeneratorPage } from "./pages/tools/linkedin/PostGenerator";
import { LinkedInCommentAutomationPage } from "./pages/tools/linkedin/CommentAutomation";
import { FacebookCommentAutomationPage } from "./pages/tools/facebook/CommentAutomation";
import { TwitterIdeaGeneratorPage } from "./pages/tools/twitter/IdeaGenerator";
import { TwitterThreadGeneratorPage } from "./pages/tools/twitter/ThreadGenerator";

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
        const lastVisit = localStorage.getItem("lastVisit");
        const now = new Date().toISOString();
        if (
          !lastVisit ||
          new Date(lastVisit).getDate() !== new Date(now).getDate()
        ) {
          setShowWelcomeBack(true);
          localStorage.setItem("lastVisit", now);
        }
      }
    }
  }, [isAuthenticated, user]);

  const handleOnboardingComplete = async (data: any) => {
    try {
      await completeOnboarding(data);
      setShowOnboarding(false);
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />}
        />

        {/* Auth Routes */}
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Instagram Auth Callback - Separate from regular auth flow */}
        <Route path="/auth/instagram/callback" element={<AuthCallback />} />
        <Route path="/auth/youtube/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/me"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Tool Routes */}
        <Route
          path="/youtube/idea-generator"
          element={
            <ProtectedRoute>
              <YouTubeIdeaGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/youtube/script-generator"
          element={
            <ProtectedRoute>
              <YouTubeScriptGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/youtube/thumbnail-generator"
          element={
            <ProtectedRoute>
              <ThumbnailGenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/youtube/seo-optimizer"
          element={
            <ProtectedRoute>
              <YouTubeSEOOptimizerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/youtube/comment-automation"
          element={
            <ProtectedRoute>
              <YouTubeCommentAutomationPage />
            </ProtectedRoute>
          }
        />

        {/* Instagram Tools */}
        <Route
          path="/instagram/idea-generator"
          element={
            <ProtectedRoute>
              <InstagramIdeaGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instagram/caption-generator"
          element={
            <ProtectedRoute>
              <InstagramCaptionGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instagram/comment-automation"
          element={
            <ProtectedRoute>
              <InstagramCommentAutomationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/twitter/comment-automation"
          element={
            <ProtectedRoute>
              <TwitterCommentAutomationPage />
            </ProtectedRoute>
          }
        />
        {/* Twitter Tools */}
        <Route
          path="/twitter/idea-generator"
          element={
            <ProtectedRoute>
              <TwitterIdeaGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/twitter/thread-generator"
          element={
            <ProtectedRoute>
              <TwitterThreadGeneratorPage />
            </ProtectedRoute>
          }
        />

        {/* LinkedIn Tools */}
        <Route
          path="/linkedin/idea-generator"
          element={
            <ProtectedRoute>
              <LinkedInIdeaGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/linkedin/post-generator"
          element={
            <ProtectedRoute>
              <LinkedInPostGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/linkedin/comment-automation"
          element={
            <ProtectedRoute>
              <LinkedInCommentAutomationPage />
            </ProtectedRoute>
          }
        />

        {/* Facebook Tools */}
        <Route
          path="/facebook/comment-automation"
          element={
            <ProtectedRoute>
              <FacebookCommentAutomationPage />
            </ProtectedRoute>
          }
        />

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
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      onScriptLoadSuccess={() => {
      }}
      onScriptLoadError={() => {
      }}
    >
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
