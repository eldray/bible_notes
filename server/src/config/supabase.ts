import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('SUPABASE_URL:', supabaseUrl); // Debug log
console.log('SUPABASE_KEY:', supabaseKey ? 'Set' : 'Missing'); // Debug log

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Supabase configuration error: ${!supabaseUrl ? 'SUPABASE_URL' : ''}${!supabaseUrl && !supabaseKey ? ' and ' : ''}${!supabaseKey ? 'SUPABASE_KEY' : ''} missing`);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
