import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

export const createSupabaseClient = () => {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
};
