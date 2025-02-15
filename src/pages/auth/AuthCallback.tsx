import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';
import { instagramService } from '../../lib/services/instagram.service';
import { facebookService } from '../../lib/services/facebook.service';
import { youtubeService } from '../../lib/services/youtube.service';
import { toast } from 'react-hot-toast';
import { twitterService } from '../../lib/services/twitter.service';
import { linkedinService } from '../../lib/services/linkedin.service';

export function AuthCallback() {
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processedCode = useRef<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (isProcessing) {
        return;
      }

      try {
        const rawCode = searchParams.get('code');
        const credential = searchParams.get('credential');
        const state = searchParams.get('state');
        const hash = window.location.hash;
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // If there's an OAuth error, show it
        if (error) {
          setError(errorDescription || error);
          return;
        }

        // Clean the code by removing any hash or extra parameters
        const code = rawCode ? rawCode.split('#')[0] : null;

        // Prevent reprocessing the same code
        if (code && processedCode.current === code) {
          return;
        }

        setIsProcessing(true);
        processedCode.current = code;

        if (!code && !credential && !hash) {
          setError('No authentication code found');
          return;
        }

        if (credential) {
          try {
            await signInWithGoogle(credential);
            toast.success('Successfully signed in with Google!');
            const redirectPath = localStorage.getItem('redirectPath') || '/home';
            localStorage.removeItem('redirectPath');
            navigate(redirectPath, { replace: true });
          } catch (err: any) {
            toast.error(err.message || 'Failed to authenticate with Google');
            setError(err.message || 'Failed to authenticate with Google');
            navigate('/auth/sign-in', { replace: true });
          }
        } else if (code && state === 'instagram') {
          try {
            const authResponse = await instagramService.handleAuthCallback(code);
            
            if (authResponse.success) {
              const savedState = localStorage.getItem('instagram_auth_return_state');
              
              if (savedState) {
                try {
                  const parsedState = JSON.parse(savedState);
                  localStorage.removeItem('instagram_auth_return_state');
                  

                  toast.success('Successfully connected Instagram account');
                  navigate('/home', { 
                    replace: true,
                    state: { 
                      instagramConnected: true,
                      modalState: parsedState
                    }
                  });
                } catch (parseError) {
                  // console.error('Error parsing saved state:', parseError);
                  setError('Error restoring previous state. Please try connecting again.');
                }
              } else {
                toast.success('Successfully connected Instagram account');
                navigate('/home', { replace: true });
              }
            } else {
              setError(authResponse.message || 'Failed to connect Instagram account');
            }
          } catch (err: any) {
            setError(err.message || 'Failed to connect Instagram account');
          }
        } else if (code && state === 'twitter') {
          try {
            const authResponse = await twitterService.handleAuthCallback(code);
            
            if (authResponse.success) {
              const savedState = localStorage.getItem('twitter_auth_return_state');
              
              if (savedState) {
                try {
                  const parsedState = JSON.parse(savedState);
                  localStorage.removeItem('twitter_auth_return_state');
                  
                  toast.success('Successfully connected Twitter account');
                  navigate('/home', { 
                    replace: true,
                    state: { 
                      twitterConnected: true,
                      modalState: parsedState
                    }
                  });
                } catch (parseError) {
                  setError('Error restoring previous state. Please try connecting again.');
                }
              } else {
                toast.success('Successfully connected Twitter account');
                navigate('/home', { replace: true });
              }
            } else {
              setError(authResponse.message || 'Failed to connect Twitter account');
            }
          } catch (err: any) {
            setError(err.message || 'Failed to connect Twitter account');
          }
        } else if (code && state === 'youtube') {
          try {
            const authResponse = await youtubeService.handleAuth(code);
            
            if (authResponse.status === 'success') {
              const savedState = localStorage.getItem('youtube_auth_return_state');
              
              if (savedState) {
                try {
                  const parsedState = JSON.parse(savedState);
                  localStorage.removeItem('youtube_auth_return_state');
                  
        
                  toast.success('Successfully connected YouTube account');
                  navigate('/home', { 
                    replace: true,
                    state: { 
                      youtubeConnected: true,
                      modalState: parsedState
                    }
                  });
                } catch (parseError) {
                  // console.error('Error parsing saved state:', parseError);
                  setError('Error restoring previous state. Please try connecting again.');
                }
              } else {
                toast.success('Successfully connected YouTube account');
                navigate('/home', { replace: true });
              }
            } else {
              setError(authResponse.error || 'Failed to connect YouTube account');
            }
          } catch (err: any) {
            // console.error('YouTube auth error:', err);
            setError(err.message || 'Failed to connect YouTube account');
          }
        } else if (code && state) {
          try {
            // Get the stored state from localStorage
            const savedState = localStorage.getItem('linkedin_auth_state');
            
            if (!savedState || savedState !== state) {
              setError('Invalid state parameter. Please try connecting again.');
              return;
            }

            console.log('Handling LinkedIn callback with code:', code);
            const authResponse = await linkedinService.handleAuthCallback(code);
            
            if (authResponse.success) {
              const savedReturnState = localStorage.getItem('linkedin_auth_return_state');
              
              // Clean up stored state
              localStorage.removeItem('linkedin_auth_state');
              
              if (savedReturnState) {
                try {
                  const parsedState = JSON.parse(savedReturnState);
                  localStorage.removeItem('linkedin_auth_return_state');
                  
                  toast.success('Successfully connected LinkedIn account');
                  navigate('/home', { 
                    replace: true,
                    state: { 
                      linkedinConnected: true,
                      modalState: parsedState
                    }
                  });
                } catch (parseError) {
                  setError('Error restoring previous state. Please try connecting again.');
                }
              } else {
                toast.success('Successfully connected LinkedIn account');
                navigate('/home', { replace: true });
              }
            } else {
              setError(authResponse.message || 'Failed to connect LinkedIn account');
            }
          } catch (err: any) {
            console.error('LinkedIn auth error:', err);
            setError(err.message || 'Failed to connect LinkedIn account');
            toast.error(err.message || 'Failed to connect LinkedIn account');
          }
        } else if (hash) {
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
            
            if (authResponse.success) {
              const savedState = localStorage.getItem('facebook_auth_return_state');
              
              if (savedState) {
                try {
                  const parsedState = JSON.parse(savedState);
                  localStorage.removeItem('facebook_auth_return_state');
                  
                  toast.success('Successfully connected Facebook account');
                  navigate('/home', { 
                    replace: true,
                    state: { 
                      facebookConnected: true,
                      modalState: parsedState
                    }
                  });
                } catch (parseError) {
                  // console.error('Error parsing saved state:', parseError);
                  setError('Error restoring previous state. Please try connecting again.');
                }
              } else {
                toast.success('Successfully connected Facebook account');
                navigate('/home', { replace: true });
              }
            } else {
              // console.error('Facebook auth failed:', authResponse);
              setError(authResponse.message || 'Failed to connect Facebook account');
            }
          } catch (err: any) {
            // console.error('Facebook auth error:', err);
            setError(err.message || 'Failed to connect Facebook account');
          }
        } else {
          // console.error('Invalid callback parameters');
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
      {isProcessing && <div className="mt-4 text-sm text-gray-600">Processing authentication...</div>}
    </div>
  );
} 