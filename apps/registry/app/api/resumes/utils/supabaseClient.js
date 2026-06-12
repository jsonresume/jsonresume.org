import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL: supabaseUrl } = require('../../../../lib/supabaseConfig');

export const createSupabaseClient = () => {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
};
