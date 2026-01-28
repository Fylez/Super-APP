import { supabase } from '../lib/supabase';
import { Community } from '../types';

interface AuthCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export const useAuth = () => {
  const signUp = async (
    credentials: AuthCredentials & { fullName: string },
    community: Community
  ) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError || !authData.user) {
        return { success: false, error: authError?.message || 'Sign up failed' };
      }

      const userId = authData.user.id;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          community_id: community.id,
          full_name: credentials.fullName,
          role: 'resident',
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return { success: false, error: 'Failed to create user profile' };
      }

      return { success: true, userId };
    } catch (err) {
      console.error('Unexpected error signing up:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (credentials: AuthCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Sign in failed' };
      }

      return { success: true, userId: data.user.id };
    } catch (err) {
      console.error('Unexpected error signing in:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (err) {
      console.error('Unexpected error signing out:', err);
      return { success: false, error: 'Failed to sign out' };
    }
  };

  return { signUp, signIn, signOut };
};
