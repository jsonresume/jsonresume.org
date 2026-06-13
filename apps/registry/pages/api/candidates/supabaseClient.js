export const createSupabaseClient = () => {
  const { createClient } = require('@supabase/supabase-js');
  const { SUPABASE_URL: supabaseUrl } = require('../../../lib/supabaseConfig');
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
};
