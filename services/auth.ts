import { supabase } from '../lib/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return {
      user: data?.user ?? null,
      session: data?.session ?? null,
      error,
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error: error as AuthError,
    };
  }
};
export const handleAuthError = (error: AuthError): string => {
  switch (error.status) {
    case 400:
      return 'Invalid email or password';
    case 401:
      return 'Unauthorized - please login again';
    case 404:
      return 'User not found';
    default:
      return error.message || 'An authentication error occurred';
  }
};
// ... [keep all your existing interfaces and functions] ...

const authService = {
  signInWithEmail,
  handleAuthError,
  
  // Future methods can be added here
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
};

export default authService;
// Error handling example


