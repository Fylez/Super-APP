import { Community } from '../types';
import { supabase } from '../lib/supabase';

export const useCommunity = () => {
  const verifyCommunityCode = async (code: string): Promise<Community | null> => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, code, name, background_image')
        .eq('code', code.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error('Error verifying community code:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        code: data.code,
        name: data.name,
        backgroundImage: data.background_image,
      };
    } catch (err) {
      console.error('Unexpected error verifying community:', err);
      return null;
    }
  };

  return { verifyCommunityCode };
};
