/**
 * Centralized Supabase configuration.
 *
 * Single source of truth for the Supabase project URL and client factories.
 * Previously the project URL was hardcoded in ~57 files across the registry app;
 * this module replaces all of those literals.
 *
 * Env vars (see apps/registry/.env.example):
 *   - NEXT_PUBLIC_SUPABASE_URL       Public project URL (client + server)
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY  Public anon key (browser-safe reads)
 *   - SUPABASE_KEY                   Service-role key (server-only, never exposed)
 *
 * The hardcoded URL below is a documented fallback so the app keeps working if
 * the env var is unset. The project ref persists across pause/restore, so this
 * value is stable.
 *
 * Uses the triple-export CommonJS pattern so it works from both ESM
 * (`import { SUPABASE_URL } from '...'`) and CommonJS (`require`) callers.
 */

const { createClient } = require('@supabase/supabase-js');

/** Documented fallback URL — project ref is stable across pause/restore. */
const DEFAULT_SUPABASE_URL = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

/** Public Supabase project URL. */
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;

/**
 * Create a Supabase client with the service-role key (server-only).
 * Throws if SUPABASE_KEY is not configured.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
function createServiceClient() {
  if (!process.env.SUPABASE_KEY) {
    throw new Error('SUPABASE_KEY environment variable is required');
  }
  return createClient(SUPABASE_URL, process.env.SUPABASE_KEY);
}

/**
 * Create a Supabase client with the public anon key (browser-safe).
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
function createAnonClient() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required'
    );
  }
  return createClient(SUPABASE_URL, anonKey);
}

module.exports = {
  SUPABASE_URL,
  DEFAULT_SUPABASE_URL,
  createServiceClient,
  createAnonClient,
};
module.exports.SUPABASE_URL = SUPABASE_URL;
module.exports.DEFAULT_SUPABASE_URL = DEFAULT_SUPABASE_URL;
module.exports.createServiceClient = createServiceClient;
module.exports.createAnonClient = createAnonClient;
module.exports.default = module.exports;
