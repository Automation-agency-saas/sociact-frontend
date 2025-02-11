import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { useAuth } from '../../lib/context/AuthContext';
import { ModeToggle } from '../../components/mode-toggle';
import { LogoIcon } from '../../components/Icons';

export function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  // console.log('AuthLayout - Current path:', location.pathname);

  // Wait for authentication check to complete
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Theme toggle at bottom right */}
      <div className="fixed bottom-4 right-4 z-50">
        <ModeToggle />
      </div>
      
      <div className="flex min-h-screen">
        {/* Left side - Auth Forms */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
                <LogoIcon />
                <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] bg-clip-text text-transparent">
                  Sociact
                </span>
              </Link>
            </div>
            
            <Routes>
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
            </Routes>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block relative flex-1">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url('/auth.webp')`,
              borderTopLeftRadius: '2rem',
              borderBottomLeftRadius: '2rem'
            }}
          >
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#F596D3]/30 to-[#D247BF]/30"
              style={{ 
                borderTopLeftRadius: '2rem',
                borderBottomLeftRadius: '2rem'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 