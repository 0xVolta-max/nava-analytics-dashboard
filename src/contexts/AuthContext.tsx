import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string, turnstileToken: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, turnstileToken: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    console.log('AuthContext: Mounting and setting up auth listener.');

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        console.log('AuthContext: Initial session loaded.', session?.user?.email || 'No user.');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (isMounted) {
          console.log('AuthContext: Auth state changed.', session?.user?.email || 'No user.');
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      console.log('AuthContext: Unmounted and unsubscribed from auth listener.');
    };
  }, []);

  const signIn = async (email: string, password: string, turnstileToken: string) => {
    console.log('AuthContext: Calling backend for sign-in.');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign-in failed.');
      }
      
      const { error } = await supabase.auth.setSession(data.session);
      if (error) {
          throw error;
      }

      return { error: null };

    } catch (error: any) {
      console.error('AuthContext: Error during signIn fetch:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, turnstileToken: string) => {
    console.log('AuthContext: Starting sign-up with Supabase client.');

    // Verify Turnstile token (skip in development mode for testing)
    if (import.meta.env.DEV) {
      console.log('✅ [AuthContext] Skipping Turnstile verification in development mode');
    } else {
      // Production: Verify Turnstile token via backend API (to avoid CORS issues)
      try {
        const response = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        });

        if (!response.ok) {
          throw new Error('CAPTCHA verification failed. Please try again.');
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error('CAPTCHA verification failed. Please try again.');
        }

        console.log('✅ [AuthContext] Turnstile verification successful');
      } catch (error) {
        console.error('Error verifying Turnstile token:', error);
        return { error: error instanceof Error ? error : new Error('CAPTCHA verification failed') };
      }
    }

    // Now proceed with direct Supabase sign-up
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Supabase signup error:', error);
        return { error };
      }

      if (!data.user) {
        return { error: new Error('Signup failed, no user data returned.') };
      }

      console.log('✅ [AuthContext] User successfully signed up with Supabase');
      return { error: null };

    } catch (error: any) {
      console.error('AuthContext: Error during signUp:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const setSessionAndUpdateUser = (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    setSession: setSessionAndUpdateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading application...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
