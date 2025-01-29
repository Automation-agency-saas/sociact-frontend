import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleResponse {
  credential: string;
}

export function SignIn() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const toastId = toast.loading('Signing in...');

    try {
      await signIn(email, password);
      toast.success('Successfully signed in!', { id: toastId });
      const redirectPath = localStorage.getItem('redirectPath') || '/home';
      localStorage.removeItem('redirectPath');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      let errorMessage = 'An error occurred during sign in';
      
      if (err instanceof Error) {
        if (err.message.includes('Google Sign-In')) {
          errorMessage = err.message;
        } else if (err.message.includes('No account found')) {
          errorMessage = 'No account found with this email. Would you like to sign up?';
        } else if (err.message.includes('Incorrect password')) {
          errorMessage = 'Incorrect password. Please try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const toastId = toast.loading('Signing in with Google...');
    try {
      await signInWithGoogle(credentialResponse.credential);
      toast.success('Successfully signed in with Google!', { id: toastId });
      const redirectPath = localStorage.getItem('redirectPath') || '/home';
      localStorage.removeItem('redirectPath');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      let errorMessage = 'Failed to sign in with Google';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            autoComplete="email"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#F596D3] to-[#D247BF] hover:from-[#D247BF] hover:to-[#F596D3]"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              <span className="ml-2">Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Email
            </>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            toast.error('Failed to sign in with Google');
          }}
          useOneTap
          theme="outline"
          size="large"
          text="signin_with"
          width="100%"
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          to="/auth/sign-up"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
} 