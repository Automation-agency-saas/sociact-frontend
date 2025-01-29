import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 