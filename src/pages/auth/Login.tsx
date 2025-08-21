"use client";

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import SafyLogo from '@/assets/logo.svg?react';
import TurnstileWidget from '@/components/auth/TurnstileWidget';

const supabase = createClient();

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  // In einer echten Anwendung würde die Anzahl der Fehlversuche serverseitig verwaltet
  // und dem Client mitgeteilt, wann Turnstile angezeigt werden soll.
  // Für diese SPA-Implementierung zeigen wir Turnstile immer an.
  const [showTurnstile, setShowTurnstile] = useState(true); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (showTurnstile && !turnstileToken) {
      showError('Bitte bestätigen Sie, dass Sie kein Roboter sind.');
      setIsLoading(false);
      return;
    }

    try {
      // Serverseitige Turnstile-Validierung (Platzhalter)
      // In einer Next.js-Anwendung würde dies eine API-Route aufrufen,
      // die den Turnstile-Token validiert und auch die Rate-Limiting-Logik enthält.
      // Die Rate-Limiting-Logik würde entscheiden, ob Turnstile überhaupt erforderlich ist.
      // Da dies eine SPA ist, wird die serverseitige Validierung hier nicht direkt aufgerufen.
      // Sie müssten einen separaten Backend-Dienst dafür einrichten.
      // Für diese Demo gehen wir davon aus, dass der Turnstile-Token clientseitig generiert wird.

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
                  to="/auth/forgot-password"
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
            {showTurnstile && (
              <TurnstileWidget
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY as string}
                onVerify={setTurnstileToken}
                onError={(code) => showError(`Turnstile-Fehler: ${code}`)}
                onExpire={() => {
                  setTurnstileToken(null);
                  showError('Turnstile-Token abgelaufen. Bitte versuchen Sie es erneut.');
                }}
              />
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading || (showTurnstile && !turnstileToken)}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;