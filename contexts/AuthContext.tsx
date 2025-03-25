import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError, PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    profileData: { username: string }
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session initialization error:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Unexpected auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    profileData: { username: string }
  ) => {
    setLoading(true);
    try {
      // 1. Create auth account
      const { data: { user, session }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: profileData.username
          }
        }
      });

      if (authError) {
        return { error: authError.message };
      }

      // 2. Create profile if user exists
      if (user) {
        const { error: profileError } = await supabase
          .from('user_details')
          .insert({
            uuid: user.id,
            Username: profileData.username,
            Email: email,
          });

        if (profileError) {
          // Rollback: Delete user if profile creation fails
          if (user) {
            await supabase.auth.admin.deleteUser(user.id);
          }
          return { error: profileError.message };
        }
        await refreshSession();
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error: error instanceof Error ? error.message : 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message || null };
    } catch (error) {
      console.error('Unexpected signin error:', error);
      return { error: error instanceof Error ? error.message : 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setSession(null);
        setUser(null);
      }
      return { error: error?.message || null };
    } catch (error) {
      console.error('Unexpected signout error:', error);
      return { error: error instanceof Error ? error.message : 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};