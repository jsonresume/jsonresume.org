const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function createSupabaseClient() {
  const supabaseKey =
    process.env.SUPABASE_KEY || 'MISSING_KEY_USING_FILE_ONLY_MODE';

  try {
    console.log('Attempting to create Supabase client with:', {
      supabaseUrl,
      keyLength: supabaseKey ? supabaseKey.length : 0,
    });
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully');
    return supabase;
  } catch (error) {
    console.error('Failed to create Supabase client:', error.message);
    console.log('Will continue in file-only mode without database access');
    return {
      from: () => ({
        select: () => ({ data: [] }),
        update: () => ({ error: null }),
      }),
    };
  }
}

module.exports = { createSupabaseClient };
