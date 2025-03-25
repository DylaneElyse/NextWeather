import { supabase } from './supabase';

export const register = async (email, password) => {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return user;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    throw error;
  }
};

const AuthService = () => null;
export default AuthService;