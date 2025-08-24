import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';


interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string, altchaToken: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, altchaToken: string) => Promise<{ error: any }>;
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
    let loadingTimeout: NodeJS.Timeout;

    const getSession = async () => {
      try {
        console.log('AuthContext: Getting session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('AuthContext: Error getting session:', error);
        }

        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          console.log('AuthContext: Session loaded, user:', session?.user?.email || 'none');
        }
      } catch (error) {
        console.error('AuthContext: Exception getting session:', error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Start loading session
    getSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (isMounted) {
          console.log('AuthContext: Auth state changed, user:', session?.user?.email || 'none');
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false); // Ensure loading is set to false on auth state changes
        }
      }
    );

    // Add timeout to prevent infinite loading - set after initial session load
    loadingTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn('AuthContext: Loading timeout reached, forcing completion');
        setIsLoading(false);
      }
    }, 5000); // Reduced to 5 second timeout

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [isLoading]); // Added isLoading as dependency to handle timeout properly

  const signIn = async (email: string, password: string, altchaToken: string) => {
    const verifyResponse = await fetch('/api/verify-altcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ challenge: altchaToken }),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.message || 'ALTCHA verification failed.');
    }

    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, altchaToken: string) => {
    const verifyResponse = await fetch('/api/verify-altcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ challenge: altchaToken }),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.message || 'ALTCHA verification failed.');
    }

    return supabase.auth.signUp({ email, password });
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
