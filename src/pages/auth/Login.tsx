import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import TurnstileWidget from '@/components/TurnstileWidget';
import SafyLogo from '@/assets/logo.svg?react';
import { supabase } from '@/lib/supabaseClient';

const LoginPage = () => {
  const { setSession, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  const handleTurnstileVerified = useCallback((token: string) => {
    console.log('🎯 [LOGIN] Turnstile verification successful, token received:', token.substring(0, 20) + '...');
    setTurnstileToken(token);
    setTurnstileError(null);
  }, []);

  const handleTurnstileError = useCallback((error: string) => {
    console.error('❌ [LOGIN] Turnstile error:', error);
    setTurnstileError(error);
    setTurnstileToken(null);
    showError(`Bot verification failed: ${error}`);
  }, []);

  const handleTurnstileExpired = useCallback(() => {
    console.log('⏰ [LOGIN] Turnstile token expired');
    setTurnstileToken(null);
  }, []);

  const handleTurnstileReset = useCallback(() => {
    console.log('🔄 [LOGIN] Turnstile widget reset');
    setTurnstileToken(null);
    setTurnstileError(null);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    // CRITICAL: Prevent any form submission that could cause page reload
    e.preventDefault();
    e.stopPropagation();

    console.log('📋 [LOGIN] Form submitted');
    console.log('🔑 [LOGIN] Current turnstileToken:', turnstileToken ? turnstileToken.substring(0, 20) + '...' : 'NULL');

    if (!turnstileToken) {
      console.error('❌ [LOGIN] No turnstile token available');
      showError('Please complete the bot verification.');
      return;
    }

    console.log('✅ [LOGIN] Token verified, proceeding with login...');

    setIsLoading(true);

    try {
      console.log('🚀 [SUPABASE] Attempting direct Supabase login...');
      
      // Direkte Supabase Authentifizierung
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ [SUPABASE] Login error:', error);
        throw new Error(error.message);
      }

      if (!data.session) {
        throw new Error('No session returned from Supabase');
      }

      console.log('✅ [SUPABASE] Login successful, session:', data.session.user?.email);
      
      // Session wird automatisch durch AuthContext verwaltet
      // setSession(data.session); // Das macht der AuthContext automatisch
      
      showSuccess('Login successful! ✅');

      // Clear form data
      setEmail('');
      setPassword('');
      setTurnstileToken(null);
      setTurnstileError(null);

      console.log('🎯 [LOGIN] Form cleared, navigation should happen via AuthContext');

    } catch (error: any) {
      console.error('❌ [SUPABASE] Login failed:', error);
      showError(error.message || 'Login failed. Please try again.');
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

            {/* Bot Protection - Cloudflare Turnstile */}
            <div className="space-y-2">
              <Label className="text-sm text-white/80">Bot Protection</Label>
              <div className="min-h-[65px]">
                <TurnstileWidget
                  onVerified={handleTurnstileVerified}
                  onError={handleTurnstileError}
                  onExpired={handleTurnstileExpired}
                  onReset={handleTurnstileReset}
                />
              </div>
              {turnstileError && (
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-md">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Bot verification temporarily unavailable</span>
                  </div>
                  <p className="text-xs text-yellow-400/80 mt-1">Proceeding without verification - form will still work</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
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
