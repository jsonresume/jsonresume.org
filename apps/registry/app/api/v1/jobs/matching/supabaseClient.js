import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/lib/supabaseConfig';

const supabaseUrl = SUPABASE_URL;

export function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}
