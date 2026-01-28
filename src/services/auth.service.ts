import { supabase } from '../lib/supabase';

export const authService = {
  async signUp(email: string, password: string, userData: {
    name: string;
    handle: string;
    community_id: string;
  }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email,
      name: userData.name,
      handle: userData.handle,
      community_id: userData.community_id,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      role: 'resident',
      property_unit: '',
    });

    if (profileError) throw profileError;

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, communities(*)')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async verifyCommunityCode(code: string) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('code', code.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
