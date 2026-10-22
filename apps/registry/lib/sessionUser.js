import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@/lib/supabaseServer';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabaseConfig';

/**
 * Resolve the Supabase auth user id of the caller.
 *
 * Per-user rows (job states, pathways preferences) are keyed by the auth user
 * id, and the routes write with the
 * service-role key (bypassing RLS), so the id must come from a verified
 * session — never from the request body or query string.
 *
 * Accepts `Authorization: Bearer <Supabase access token>` (the browser keeps
 * its session in localStorage) and falls back to the Supabase cookie session.
 *
 * @param {Request} request
 * @returns {Promise<string|null>} auth user id, or null when not signed in.
 */
export async function getSessionUserId(request) {
  const header = request?.headers?.get('authorization');
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7).trim();
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user?.id) return data.user.id;
    } catch {
      // fall through to the cookie session
    }
  }

  try {
    const supabase = await createRouteHandlerClient();
    const { data, error } = await supabase.auth.getUser();
    return error ? null : data?.user?.id || null;
  } catch {
    return null;
  }
}
