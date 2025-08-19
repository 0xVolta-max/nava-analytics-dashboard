import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import SafyLogo from '@/assets/logo.svg?react';

const supabase = createClient();

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('nava_forgot_password_request', {
        p_email: email,
      });
      if (error) throw error;
      showSuccess('Password reset link sent!');
      setIsSubmitted(true);
    } catch (error: any) {
      showError(error.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="mx-auto max-w-sm w-full bg-white/10 backdrop-blur-xl border border-white/15 text-white">
        <CardHeader className="text-center">
          <SafyLogo className="max-w-[150px] h-auto mx-auto mb-4" />
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            {isSubmitted
              ? "If an account exists, an email will be sent with instructions."
              : "Enter your email to receive a password reset link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center">
              <p className="text-sm mb-4">Please check your inbox (and spam folder).</p>
              <Button asChild variant="outline" className="w-full bg-transparent hover:bg-white/10">
                <Link to="/login">Back to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordResetRequest} className="grid gap-4">
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <div className="mt-4 text-center text-sm">
                Remember your password?{' '}
                <Link to="/login" className="underline">
                  Login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;