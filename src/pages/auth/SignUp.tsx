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

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | undefined>(undefined);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (turnstileContainerRef.current && !turnstileWidgetId) {
      const id = renderTurnstile(
        turnstileContainerRef.current.id,
        (token) => setTurnstileToken(token),
        () => showError('Turnstile verification failed. Please try again.'),
        'invisible'
      );
      setTurnstileWidgetId(id);
    }
  }, [turnstileWidgetId]);

  useEffect(() => {
    const verifyAndSignUp = async () => {
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

        // Proceed with Supabase signup
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (error) throw error;

        showSuccess('Konto erstellt! Bitte überprüfen Sie Ihre E-Mails zur Bestätigung.');
        navigate('/login');
      } catch (error: any) {
        showError(error.message || 'Ein unbekannter Fehler ist aufgetreten.');
        if (turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(turnstileWidgetId); // Reset Turnstile on error
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (turnstileToken) {
      verifyAndSignUp();
    }
  }, [turnstileToken, email, password, navigate, turnstileWidgetId]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      showError('Das Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }

    setIsLoading(true);
    setTurnstileToken(null); // Reset token before execution
    if (turnstileWidgetId) {
      executeTurnstile(turnstileWidgetId); // Manually execute invisible Turnstile
    } else {
      showError('Turnstile widget not loaded. Please refresh the page.');
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="mx-auto max-w-sm w-full bg-white/10 backdrop-blur-xl border border-white/15 text-white">
        <CardHeader className="text-center">
          <SafyLogo className="max-w-[150px] h-auto mx-auto mb-4" />
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Geben Sie Ihre Informationen ein, um ein Konto zu erstellen</CardDescription>
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
            {/* Turnstile container */}
            <div ref={turnstileContainerRef} id="signup-turnstile-container" className="min-h-[1px]"></div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Konto wird erstellt...' : 'Konto erstellen'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Haben Sie bereits ein Konto?{' '}
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