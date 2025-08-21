import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import SafyLogo from '@/assets/logo.svg?react';
import { renderTurnstile, resetTurnstile, executeTurnstile } from '@/lib/turnstile';

const supabase = createClient();

const LOGIN_ATTEMPT_LIMIT = 3; // Number of failed attempts before Turnstile is required

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | undefined>(undefined);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  const isTurnstileRequired = failedAttempts >= LOGIN_ATTEMPT_LIMIT;

  useEffect(() => {
    if (isTurnstileRequired && turnstileContainerRef.current && !turnstileWidgetId) {
      const id = renderTurnstile(
        turnstileContainerRef.current.id,
        (token) => setTurnstileToken(token),
        () => showError('Turnstile verification failed. Please try again.'),
        'normal' // Use 'normal' size for visibility when required
      );
      setTurnstileWidgetId(id);
    } else if (!isTurnstileRequired && turnstileWidgetId) {
      // If Turnstile is no longer required, remove the widget
      if (window.turnstile) {
        window.turnstile.reset(turnstileWidgetId);
        window.turnstile.remove(turnstileWidgetId);
      }
      setTurnstileWidgetId(undefined);
    }
  }, [isTurnstileRequired, turnstileWidgetId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isTurnstileRequired) {
      setTurnstileToken(null); // Reset token before execution
      if (turnstileWidgetId) {
        executeTurnstile(turnstileWidgetId); // Manually execute Turnstile
      } else {
        showError('Turnstile widget not loaded. Please refresh the page.');
        setIsLoading(false);
        return;
      }
    } else {
      // If Turnstile is not required, proceed directly
      await attemptLogin();
    }
  };

  const attemptLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setFailedAttempts(prev => prev + 1); // Increment failed attempts
        if (error.message.includes('Email not confirmed')) {
          showError('Bitte bestätigen Sie Ihre E-Mail-Adresse, bevor Sie sich anmelden.');
          return;
        }
        throw error;
      }

      showSuccess('Logged in successfully!');
      setFailedAttempts(0); // Reset failed attempts on success
      navigate('/');
    } catch (error: any) {
      showError(error.message || 'An unknown error occurred.');
      if (isTurnstileRequired && turnstileWidgetId) {
        resetTurnstile(turnstileWidgetId); // Reset Turnstile on error
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyAndLogin = async () => {
      if (!turnstileToken) return; // Wait for token to be set

      try {
        const response = await fetch(import.meta.env.VITE_VERIFY_TURNSTILE_API_URL || '/api/verify-turnstile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: turnstileToken }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Turnstile verification failed.');
        }

        // Proceed with Supabase login after Turnstile verification
        await attemptLogin();
      } catch (error: any) {
        showError(error.message || 'Ein unbekannter Fehler ist aufgetreten.');
        if (turnstileWidgetId) {
          resetTurnstile(turnstileWidgetId); // Reset Turnstile on error
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (turnstileToken && isTurnstileRequired) {
      verifyAndLogin();
    }
  }, [turnstileToken, isTurnstileRequired, turnstileWidgetId]);

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
            {isTurnstileRequired && (
              <div ref={turnstileContainerRef} id="login-turnstile-container" className="mt-2 flex justify-center"></div>
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