import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '../../lib/supabaseConfig';

// Anon key is browser-safe (public). Prefer env var, fall back to the
// documented public anon key so the client keeps working if unset.
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHVodnZ3cnlldXp1eWlocGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5OTA4NjQsImV4cCI6MjAyMzU2Njg2NH0.oEs0H2aumAHsiLn6i9ic1-iwWDo3bJkFkC7NCeUrIfA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
