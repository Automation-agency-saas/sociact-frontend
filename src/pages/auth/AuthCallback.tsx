import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const credential = searchParams.get('credential');

        if (credential) {
          // Handle Google Sign-In
          await signInWithGoogle(credential);
          const redirectPath = localStorage.getItem('redirectPath') || '/home';
          localStorage.removeItem('redirectPath');
          navigate(redirectPath, { replace: true });
        } else if (code) {
          // Handle other OAuth providers if needed
          setError('OAuth provider not supported');
        } else {
          setError('Invalid callback parameters');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during authentication');
      }
    };

    handleCallback();
  }, [navigate, searchParams, signInWithGoogle]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
    </div>
  );
} 