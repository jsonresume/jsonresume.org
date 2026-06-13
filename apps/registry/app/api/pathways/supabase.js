import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/lib/supabaseConfig';

export function getSupabase() {
  if (!process.env.SUPABASE_KEY) {
    throw new Error('SUPABASE_KEY environment variable is required');
  }
  return createClient(SUPABASE_URL, process.env.SUPABASE_KEY);
}
