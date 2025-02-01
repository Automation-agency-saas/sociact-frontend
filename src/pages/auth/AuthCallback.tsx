import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';
import { instagramService } from '../../lib/services';
import { toast } from 'react-hot-toast';

export function AuthCallback() {
  console.log('AuthCallback component mounted');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Log all URL and search parameters immediately
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  console.log('Current search:', window.location.search);
  console.log('Current hash:', window.location.hash);
  console.log('All search params:', Object.fromEntries(searchParams.entries()));
  console.log('Auth token in localStorage:', localStorage.getItem('token'));

  useEffect(() => {
    console.log('AuthCallback useEffect triggered');
    
    const handleCallback = async () => {
      if (isProcessing) {
        console.log('Already processing callback, skipping...');
        return;
      }

      try {
        setIsProcessing(true);
        const rawCode = searchParams.get('code');
        const credential = searchParams.get('credential');
        const state = searchParams.get('state');

        // Clean the code by removing any hash or extra parameters
        const code = rawCode ? rawCode.split('#')[0] : null;

        console.log('Auth Callback - Received params:', { 
          rawCode,
          cleanedCode: code,
          credential, 
          state 
        });

        if (!code && !credential) {
          console.error('No code or credential found in URL');
          setError('No authentication code found');
          return;
        }

        if (credential) {
          console.log('Processing Google auth...');
          await signInWithGoogle(credential);
          const redirectPath = localStorage.getItem('redirectPath') || '/home';
          localStorage.removeItem('redirectPath');
          navigate(redirectPath, { replace: true });
        } else if (code && state === 'instagram') {
          console.log('Processing Instagram auth callback...');
          try {
            // Connect Instagram account with cleaned code
            console.log('Calling handleAuthCallback with cleaned code:', code);
            const authResponse = await instagramService.handleAuthCallback(code);
            console.log('Instagram auth response:', authResponse);
            
            if (authResponse.success) {
              // Restore modal state if it exists
              const savedState = localStorage.getItem('instagram_auth_return_state');
              console.log('Saved Instagram state:', savedState);
              
              if (savedState) {
                try {
                  const parsedState = JSON.parse(savedState);
                  localStorage.removeItem('instagram_auth_return_state');
                  
                  console.log('Instagram auth successful, navigating to home');
                  toast.success('Successfully connected Instagram account');
                  navigate('/home', { 
                    replace: true,
                    state: { 
                      instagramConnected: true,
                      modalState: parsedState
                    }
                  });
                } catch (parseError) {
                  console.error('Error parsing saved state:', parseError);
                  setError('Error restoring previous state. Please try connecting again.');
                }
              } else {
                console.log('No saved state found, navigating to home');
                toast.success('Successfully connected Instagram account');
                navigate('/home', { replace: true });
              }
            } else {
              console.error('Instagram auth failed:', authResponse);
              setError(authResponse.message || 'Failed to connect Instagram account');
            }
          } catch (err: any) {
            console.error('Instagram auth error:', err);
            setError(err.message || 'Failed to connect Instagram account');
          }
        } else if (code) {
          console.error('Invalid state parameter for Instagram auth');
          setError('Invalid authentication state');
        } else {
          console.error('Invalid callback parameters');
          setError('Invalid callback parameters');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during authentication');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, searchParams, signInWithGoogle, isProcessing]);

  console.log('AuthCallback rendering, error state:', error, 'isProcessing:', isProcessing);

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
      {isProcessing && <div className="mt-4 text-sm text-gray-600">Processing authentication...</div>}
    </div>
  );
} 