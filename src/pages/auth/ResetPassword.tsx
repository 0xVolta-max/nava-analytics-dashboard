import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import SafyLogo from '@/assets/logo.svg?react';
import { useAuth } from '@/contexts/AuthContext';


const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the auth context to process the session from the URL fragment
    const timer = setTimeout(() => {
      if (session) {
        setIsReady(true);
      }
    }, 500); // A small delay to ensure the session is set

    // Also check if the session is already present
    if (session) {
        setIsReady(true);
        clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [session]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      showError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      showSuccess('Password has been reset successfully!');
      await supabase.auth.signOut(); // Log the user out after update
      navigate('/login');
    } catch (error: any) {
      showError(error.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="mx-auto max-w-sm w-full bg-white/10 backdrop-blur-xl border border-white/15 text-white">
          <CardHeader>
            <CardTitle>Verifying...</CardTitle>
            <CardDescription>Verifying your password reset request.</CardDescription>
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
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
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
              <Label htmlFor="confirm-password">Confirm New Password</Label>
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
              {isLoading ? 'Resetting password...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;