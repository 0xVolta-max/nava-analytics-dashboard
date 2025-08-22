import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import SafyLogo from '@/assets/logo.svg?react';

const SignUpPage = () => {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      showError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password);

      if (error) {
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

      showSuccess('Account created successfully! Please check your email for confirmation.');
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      showError(error.message || 'An error occurred during signup. Please try again.');
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
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
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
