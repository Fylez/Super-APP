import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  name: string;
  handle: string | null;
  avatar_url: string;
  community_id: string | null;
  role: string;
  property_unit: string;
  communities?: {
    id: string;
    code: string;
    name: string;
    background_image: string;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.warn('[useAuth] Supabase client not available');
      setLoading(false);
      return;
    }

    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setLoading(false);
        }
      }).catch((err) => {
        console.error('[useAuth] Error getting session:', err);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        (() => {
          (async () => {
            setUser(session?.user ?? null);
            if (session?.user) {
              await loadProfile(session.user.id);
            } else {
              setProfile(null);
              setLoading(false);
            }
          })();
        })();
      });

      return () => subscription?.unsubscribe();
    } catch (err) {
      console.error('[useAuth] Initialization error:', err);
      setLoading(false);
    }
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*, communities(*)')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('[useAuth] Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
  };
};
