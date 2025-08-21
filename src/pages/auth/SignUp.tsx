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

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      showError('Das Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }

    if (!turnstileToken) {
      showError('Bitte bestätigen Sie, dass Sie kein Roboter sind.');
      return;
    }

    setIsLoading(true);
    try {
      // Hier würden Sie den Turnstile-Token an Ihren Backend-Dienst senden
      // und auf eine erfolgreiche Validierung warten.
      // Da dies eine React SPA ist, simulieren wir dies oder gehen davon aus,
      // dass ein separater Backend-Dienst dies übernimmt.
      const turnstileVerificationResponse = await fetch('/api/verify-turnstile', { // Dies ist ein Platzhalter-URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: turnstileToken }),
      });

      const verificationResult = await turnstileVerificationResponse.json();

      if (!turnstileVerificationResponse.ok || !verificationResult.success) {
        showError(verificationResult.message || 'Turnstile-Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        setIsLoading(false);
        setTurnstileToken(null); // Token zurücksetzen, um eine neue Verifizierung zu erzwingen
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;

      showSuccess('Konto erstellt! Bitte überprüfen Sie Ihre E-Mails zur Bestätigung.');
      navigate('/login');
    } catch (error: any)      {
      showError(error.error_description || error.message || 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
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
            <TurnstileWidget
              siteKey={import.meta.env.VITE_NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onVerify={setTurnstileToken}
              onError={(code) => showError(`Turnstile-Fehler: ${code}`)}
              onExpire={() => {
                setTurnstileToken(null);
                showError('Turnstile-Token abgelaufen. Bitte versuchen Sie es erneut.');
              }}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading || !turnstileToken}>
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