/**
 * Cookie-session Supabase client for App Router route handlers.
 *
 * Replaces the deprecated `@supabase/auth-helpers-nextjs`
 * `createRouteHandlerClient` with the `@supabase/ssr` equivalent
 * (`createServerClient` + the getAll/setAll cookie adapter from the
 * official Next.js App Router docs). See issue #480.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig';

/**
 * Create a Supabase client bound to the request's auth cookies.
 * Route handlers may set cookies, so session refreshes persist.
 */
export async function createRouteHandlerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });
}
