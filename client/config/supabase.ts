// client side supabase.ts
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseKey = Constants.expoConfig?.extra?.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Supabase configuration error: ${!supabaseUrl ? 'SUPABASE_URL' : ''}${!supabaseUrl && !supabaseKey ? ' and ' : ''}${!supabaseKey ? 'SUPABASE_KEY' : ''} missing`);
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});