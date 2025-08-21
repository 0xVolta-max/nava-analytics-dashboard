"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import SafyLogo from '@/assets/logo.svg?react';
import { useAuth } from '@/contexts/AuthContext';

const supabase = createClient();

const ResetPasswordPage = () => {
  const router = useRouter();
  const { session } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Warten Sie, bis der Auth-Kontext die Sitzung aus dem URL-Fragment verarbeitet hat
    const timer = setTimeout(() => {
      if (session) {
        setIsReady(true);
      }
    }, 500); // Eine kleine Verzögerung, um sicherzustellen, dass die Sitzung festgelegt ist

    // Überprüfen Sie auch, ob die Sitzung bereits vorhanden ist
    if (session) {
        setIsReady(true);
        clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [session]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      showError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Die Passwörter stimmen nicht überein.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      showSuccess('Das Passwort wurde erfolgreich zurückgesetzt!');
      await supabase.auth.signOut(); // Melden Sie den Benutzer nach der Aktualisierung ab
      router.push('/auth/login');
    } catch (error: any) {
      showError(error.message || 'Das Passwort konnte nicht zurückgesetzt werden.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="mx-auto max-w-sm w-full bg-white/10 backdrop-blur-xl border border-white/15 text-white">
          <CardHeader>
            <CardTitle>Wird überprüft...</CardTitle>
            <CardDescription>Überprüfung Ihrer Anfrage zum Zurücksetzen des Passworts.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="mx-auto max-w-sm w-full bg-white/10 backdrop-blur-xl border border-white/15 text-white">
        <CardHeader className="text-center">
          <SafyLogo className="max-w-[150px] h-auto mx-auto mb-4" />
          <CardTitle className="text-2xl">Passwort zurücksetzen</CardTitle>
          <CardDescription>Geben Sie unten Ihr neues Passwort ein.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Neues Passwort</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/20 focus:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Neues Passwort bestätigen</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/5 border-white/20 focus:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Wird zurückgesetzt...' : 'Passwort zurücksetzen'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;