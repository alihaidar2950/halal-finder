'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'facebook' | 'twitter', redirectTo?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ user: User | null; session: Session | null; } | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Refresh session periodically to ensure it stays valid
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;
    
    if (session) {
      // Set up auto-refresh every 10 minutes
      refreshInterval = setInterval(() => {
        console.log('Auto-refreshing session...');
        refreshSession();
      }, 10 * 60 * 1000); // 10 minutes
    }
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [session]);

  useEffect(() => {
    // Get session from local storage
    const getSession = async () => {
      setIsLoading(true);
      
      try {
        console.log('Fetching current auth session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session data:', session ? 'Session exists' : 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
      
      // Set up auth state listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          
          // Refresh the router on auth changes
          router.refresh();
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    getSession();
  }, [router]);

  const refreshSession = async () => {
    try {
      console.log('Manually refreshing session...');
      // Try to refresh the session
      const { data } = await supabase.auth.refreshSession();
      console.log('Session refresh result:', data.session ? 'Success' : 'Failed');
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      return data;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        router.refresh();
        await refreshSession();
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'facebook' | 'twitter', redirectTo?: string) => {
    try {
      console.log(`Starting OAuth sign-in with ${provider}...`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        },
      });
      
      return { error };
    } catch (error) {
      console.error(`OAuth sign-in error with ${provider}:`, error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 