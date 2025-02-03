import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';
import { instagramService } from '../../lib/services/instagram.service';
import { facebookService } from '../../lib/services/facebook.service';
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
        const hash = window.location.hash;

        // Clean the code by removing any hash or extra parameters
        const code = rawCode ? rawCode.split('#')[0] : null;

        console.log('Auth Callback - Received params:', { 
          rawCode,
          cleanedCode: code,
          credential, 
          state,
          hash
        });

        if (!code && !credential && !hash) {
          console.error('No code, credential, or hash found in URL');
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
            const authResponse = await instagramService.handleAuthCallback(code);
            console.log('Instagram auth response:', authResponse);
            
            if (authResponse.success) {
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
        } else if (hash) {
          console.log('Processing Facebook auth callback...');
          try {
            // Parse the hash fragment
            const params = new URLSearchParams(hash.replace('#', ''));
            const accessToken = params.get('access_token');
            const longLivedToken = params.get('long_lived_token');
            
            if (!accessToken && !longLivedToken) {
              throw new Error('No access token found in Facebook response');
            }

            const token = longLivedToken || accessToken;
            if (!token) {
              throw new Error('No valid token found in Facebook response');
            }

            const authResponse = await facebookService.handleAuthCallback(token);
            console.log('Facebook auth response:', authResponse);
            
            if (authResponse.success) {
              const savedState = localStorage.getItem('facebook_auth_return_state');
              console.log('Saved Facebook state:', savedState);
              
              if (savedState) {
                try {
                  const parsedState = JSON.parse(savedState);
                  localStorage.removeItem('facebook_auth_return_state');
                  
                  console.log('Facebook auth successful, navigating to home');
                  toast.success('Successfully connected Facebook account');
                  navigate('/home', { 
                    replace: true,
                    state: { 
                      facebookConnected: true,
                      modalState: parsedState
                    }
                  });
                } catch (parseError) {
                  console.error('Error parsing saved state:', parseError);
                  setError('Error restoring previous state. Please try connecting again.');
                }
              } else {
                console.log('No saved state found, navigating to home');
                toast.success('Successfully connected Facebook account');
                navigate('/home', { replace: true });
              }
            } else {
              console.error('Facebook auth failed:', authResponse);
              setError(authResponse.message || 'Failed to connect Facebook account');
            }
          } catch (err: any) {
            console.error('Facebook auth error:', err);
            setError(err.message || 'Failed to connect Facebook account');
          }
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