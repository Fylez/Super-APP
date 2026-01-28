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
    console.log('🔵 INTENTANDO REGISTRO REAL EN SUPABASE:', credentials.email);
    console.log('📋 Comunidad ID:', community.id);
    console.log('🔑 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

    if (!import.meta.env.VITE_SUPABASE_URL) {
      const msg = '❌ ERROR CRÍTICO: FALTA VITE_SUPABASE_URL en .env';
      console.error(msg);
      alert(msg);
      return { success: false, error: msg };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('🔍 Respuesta de signUp:', { authData, authError });

      if (authError) {
        const errorMsg = `❌ ERROR DE SUPABASE SIGNUP: ${authError.message}`;
        console.error(errorMsg);
        alert(errorMsg);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        const errorMsg = '❌ ERROR: No se creó usuario en Supabase';
        console.error(errorMsg);
        alert(errorMsg);
        return { success: false, error: errorMsg };
      }

      const userId = authData.user.id;
      console.log('✅ Usuario creado en Supabase. ID:', userId);

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          community_id: community.id,
          full_name: credentials.fullName,
          role: 'resident',
        });

      if (profileError) {
        const errorMsg = `❌ ERROR AL CREAR PERFIL: ${profileError.message}`;
        console.error(errorMsg);
        alert(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('✅ ÉXITO COMPLETO. Usuario registrado y perfil creado.');
      return { success: true, userId };
    } catch (err) {
      const errorMsg = `❌ ERROR INESPERADO: ${err instanceof Error ? err.message : String(err)}`;
      console.error(errorMsg);
      alert(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signIn = async (credentials: AuthCredentials) => {
    console.log('🔵 INTENTANDO LOGIN EN SUPABASE:', credentials.email);

    if (!import.meta.env.VITE_SUPABASE_URL) {
      const msg = '❌ ERROR CRÍTICO: FALTA VITE_SUPABASE_URL en .env';
      console.error(msg);
      alert(msg);
      return { success: false, error: msg };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('🔍 Respuesta de signIn:', { data, error });

      if (error) {
        const errorMsg = `❌ ERROR DE SUPABASE LOGIN: ${error.message}`;
        console.error(errorMsg);
        alert(errorMsg);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        const errorMsg = '❌ ERROR: No se autenticó el usuario';
        console.error(errorMsg);
        alert(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('✅ LOGIN EXITOSO. Usuario ID:', data.user.id);
      return { success: true, userId: data.user.id };
    } catch (err) {
      const errorMsg = `❌ ERROR INESPERADO: ${err instanceof Error ? err.message : String(err)}`;
      console.error(errorMsg);
      alert(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signOut = async () => {
    console.log('🔵 INTENTANDO LOGOUT EN SUPABASE');

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        const errorMsg = `❌ ERROR DE SUPABASE LOGOUT: ${error.message}`;
        console.error(errorMsg);
        alert(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('✅ LOGOUT EXITOSO');
      return { success: true };
    } catch (err) {
      const errorMsg = `❌ ERROR INESPERADO: ${err instanceof Error ? err.message : String(err)}`;
      console.error(errorMsg);
      alert(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return { signUp, signIn, signOut };
};
