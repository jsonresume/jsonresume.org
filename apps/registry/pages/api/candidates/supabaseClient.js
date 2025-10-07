export const createSupabaseClient = () => {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
};
