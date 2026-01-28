import { supabase } from '../lib/supabase';

export interface CreateGuestLinkParams {
  guest_name: string;
  start_date: string;
  end_date: string;
  permissions: {
    canOpenDoors: boolean;
    canBookSports: boolean;
  };
}

export const guestService = {
  async getOwnerGuestLinks(ownerId: string) {
    const { data, error } = await supabase
      .from('guest_links')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createGuestLink(ownerId: string, params: CreateGuestLinkParams) {
    const token = `gk_${Math.random().toString(36).substr(2, 9)}${Date.now().toString(36)}`;
    const link = `${window.location.origin}/guest/${token}`;

    const { data, error } = await supabase
      .from('guest_links')
      .insert({
        token,
        owner_id: ownerId,
        guest_name: params.guest_name,
        start_date: params.start_date,
        end_date: params.end_date,
        status: 'ACTIVE',
        permissions: params.permissions,
        link,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async revokeGuestLink(linkId: string) {
    const { error } = await supabase
      .from('guest_links')
      .update({ status: 'REVOKED' })
      .eq('id', linkId);

    if (error) throw error;
  },

  async validateGuestToken(token: string) {
    const { data, error } = await supabase
      .from('guest_links')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const today = new Date().toISOString().split('T')[0];
    if (data.status !== 'ACTIVE' || data.end_date < today) {
      return null;
    }

    return data;
  },

  async updateGuestLinkStatus() {
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('guest_links')
      .update({ status: 'EXPIRED' })
      .eq('status', 'ACTIVE')
      .lt('end_date', today);

    if (error) throw error;
  },
};
