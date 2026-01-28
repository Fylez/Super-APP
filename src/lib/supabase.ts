import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase] URL:', supabaseUrl ? '✓ Configured' : '✗ Missing');
console.log('[Supabase] ANON_KEY:', supabaseAnonKey ? '✓ Configured' : '✗ Missing');

let supabase: any = null;
let initError: string | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('[Supabase] Client initialized successfully');
  } catch (err: any) {
    initError = err?.message || 'Unknown error initializing Supabase';
    console.error('[Supabase] Initialization error:', initError);
  }
} else {
  initError = `Missing Supabase credentials: ${!supabaseUrl ? 'URL ' : ''}${!supabaseAnonKey ? 'KEY' : ''}`.trim();
  console.warn('[Supabase] Offline Mode:', initError);
}

export { supabase, initError };

export interface Database {
  public: {
    Tables: {
      communities: {
        Row: {
          id: string;
          code: string;
          name: string;
          background_image: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['communities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['communities']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          handle: string | null;
          avatar_url: string;
          community_id: string | null;
          role: 'owner' | 'resident' | 'admin';
          property_unit: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          activity_name: string;
          court_name: string;
          date: string;
          start_time: string;
          end_time: string;
          status: 'CONFIRMED' | 'CANCELLED';
          qr_code: string;
          image: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      guest_links: {
        Row: {
          id: string;
          token: string;
          owner_id: string;
          guest_name: string;
          start_date: string;
          end_date: string;
          status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
          permissions: {
            canOpenDoors: boolean;
            canBookSports: boolean;
          };
          link: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['guest_links']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['guest_links']['Insert']>;
      };
    };
  };
}
