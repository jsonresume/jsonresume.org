import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

let supabase;
function getSupabase() {
  if (!supabase) {
    supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);
  }
  return supabase;
}

/**
 * Authenticate request via Bearer token (API key).
 * Returns { username } or null.
 */
export async function authenticate(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const key = authHeader.slice(7);
  if (!key) return null;

  const db = getSupabase();
  const { data, error } = await db
    .from('api_keys')
    .select('username')
    .eq('key', key)
    .single();

  if (error || !data) return null;

  // Update last_used_at (fire and forget)
  db.from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key', key)
    .then();

  return { username: data.username };
}
