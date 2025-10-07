import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

export const createSupabase = () => {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
};
