import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import SafyLogo from '@/assets/logo.svg?react';
import AltchaWidget from '@/components/AltchaWidget'; // Import AltchaWidget

const supabase = createClient();

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [altchaResponse, setAltchaResponse] = useState<string | null>(null); // State for Altcha response
  const [showAltcha, setShowAltcha] = useState(false); // Control Altcha visibility

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAltchaResponse(null); // Reset Altcha response on new attempt
    setShowAltcha(true); // Show Altcha widget to get a new challenge
  };

  const attemptLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          showError('Bitte bestätigen Sie Ihre E-Mail-Adresse, bevor Sie sich anmelden.');
          return;
        }
        throw error;
      }

      showSuccess('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      showError(error.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyAltchaAndLogin = async () => {
      if (!altchaResponse) return; // Wait for Altcha response to be set

      try {
        const response = await fetch(import.meta.env.VITE_ALTCHA_VERIFY_API_URL || '/api/verify-altcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ challenge: altchaResponse }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Altcha verification failed.');
        }

        // Proceed with Supabase login after Altcha verification
        await attemptLogin();
      } catch (error: any) {
        showError(error.message || 'Ein unbekannter Fehler ist aufgetreten.');
      } finally {
        setIsLoading(false);
        setShowAltcha(false); // Hide Altcha after attempt
      }
    };

    if (altchaResponse) {
      verifyAltchaAndLogin();
    }
  }, [altchaResponse]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="mx-auto max-w-sm w-full bg-white/10 backdrop-blur-xl border border-white/15 text-white">
        <CardHeader className="text-center">
          <SafyLogo className="max-w-[150px] h-auto mx-auto mb-4" />
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/20 focus:ring-primary"
              />
            </div>
            {showAltcha && (
              <AltchaWidget
                onVerified={setAltchaResponse}
                onError={(msg) => {
                  showError(msg);
                  setIsLoading(false);
                  setShowAltcha(false);
                }}
                auto={false} // Set to false to manually trigger verification on form submit
              />
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;