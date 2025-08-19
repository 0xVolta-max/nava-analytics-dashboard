import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import SafyLogo from '@/assets/logo.svg?react';

const supabase = createClient();

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const recoveryToken = searchParams.get('token');
    if (recoveryToken) {
      setToken(recoveryToken);
    }
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }
    if (!token) {
      showError("Invalid or missing reset token.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('nava_forgot_password_confirm', {
        p_token: token,
        p_new_password: password,
      });
      if (error) throw error;
      showSuccess('Password has been reset successfully!');
      navigate('/login');
    } catch (error: any) {
      showError(error.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="mx-auto max-w-sm w-full bg-white/10 backdrop-blur-xl border border-white/15 text-white">
          <CardHeader>
            <CardTitle>Invalid Token</CardTitle>
            <CardDescription>The password reset link is invalid or has expired.</CardDescription>
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
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;