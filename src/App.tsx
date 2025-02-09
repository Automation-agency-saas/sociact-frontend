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

// Landing page components
import { About } from "./components/About";
import { Cta } from "./components/Cta";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { Newsletter } from "./components/Newsletter";
import { Pricing } from "./components/Pricing";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Sponsors } from "./components/Sponsors";
import { Testimonials } from "./components/Testimonials";
import "./App.css";
// Auth pages
import { AuthLayout } from "./pages/auth/AuthLayout";

// App pages
import Home from "./pages/Home";
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Profile } from "./pages/Profile";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}

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
  console.log('App mounting...');
  console.log('Using Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="sociact-theme">
      <GoogleOAuthProvider 
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        onScriptLoadSuccess={() => {
          console.log('Google OAuth script loaded successfully');
          console.log('Current origin:', window.location.origin);
        }}
        onScriptLoadError={() => {
          console.error('Failed to load Google OAuth script');
        }}
      >
        <Router>
          <AuthProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
                success: {
                  iconTheme: {
                    primary: 'hsl(var(--primary))',
                    secondary: 'hsl(var(--primary-foreground))',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'hsl(var(--destructive))',
                    secondary: 'hsl(var(--destructive-foreground))',
                  },
                },
              }}
            />
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
