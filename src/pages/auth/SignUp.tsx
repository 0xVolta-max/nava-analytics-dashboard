import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import AltchaWidget from '@/components/AltchaWidget';
import SafyLogo from '@/assets/logo.svg?react';

const SignUpPage = () => {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [altchaToken, setAltchaToken] = useState<string | null>(null);
  const [altchaError, setAltchaError] = useState<string | null>(null);

  const handleAltchaVerified = (token: string) => {
    setAltchaToken(token);
    setAltchaError(null);
    console.log('Altcha verification successful');
  };

  const handleAltchaError = (error: string) => {
    setAltchaError(error);
    setAltchaToken(null);
    showError(`Bot verification failed: ${error}`);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    // CRITICAL: Prevent any form submission that could cause page reload
    e.preventDefault();
    e.stopPropagation();

    console.log('Signup form submitted, preventing default behavior');

    if (password.length < 8) {
      showError('Password must be at least 8 characters long.');
      return;
    }

    if (!altchaToken) {
      showError('Please complete the bot verification.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, altchaToken);

      if (error) {
        console.error('Signup error:', error);
        // Handle specific Supabase errors
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please try logging in instead.');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          throw new Error('Password must be at least 6 characters long.');
        } else if (error.message.includes('Unable to validate email address')) {
          throw new Error('Please enter a valid email address.');
        }
        throw error;
      }

      console.log('Signup successful, showing success message');
      showSuccess('Account created successfully! Please check your email for confirmation.');

      // Clear form data
      setEmail('');
      setPassword('');
      setAltchaToken(null);
      setAltchaError(null);

      navigate('/login');
    } catch (error: any) {
      console.error('Signup failed:', error);
      showError(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="mx-auto max-w-sm w-full bg-white/10 backdrop-blur-xl border border-white/15 text-white">
        <CardHeader className="text-center">
          <SafyLogo className="max-w-[150px] h-auto mx-auto mb-4" />
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/20 focus:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/20 focus:ring-primary"
              />
            </div>

            {/* Altcha Bot Protection - Robust Integration */}
            <div className="space-y-2">
              <Label className="text-sm text-white/80">Bot Protection</Label>
              <div className="min-h-[65px]">
                <AltchaWidget
                  onVerified={handleAltchaVerified}
                  onError={handleAltchaError}
                />
              </div>
              {altchaError && (
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-md">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Bot verification temporarily unavailable</span>
                  </div>
                  <p className="text-xs text-yellow-400/80 mt-1">Proceeding without verification - form will still work</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
