import { supabase } from './supabase';

/**
 * Headers for calling registry API routes as the signed-in user. The server
 * verifies this Supabase access token instead of trusting ids in the request.
 * @returns {Promise<Object>}
 */
export const authHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };
};
