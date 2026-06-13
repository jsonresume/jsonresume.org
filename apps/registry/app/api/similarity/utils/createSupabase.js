import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL: supabaseUrl } = require('../../../../lib/supabaseConfig');

export const createSupabase = () => {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
};
