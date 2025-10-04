const { createClient } = require('@supabase/supabase-js');

/**
 * Initialize Supabase client with fallback for missing credentials
 */
function initializeSupabase() {
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
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
    // Return mock client for file-only mode
    return {
      from: () => ({
        select: () => ({ data: [] }),
        update: () => ({ error: null }),
      }),
    };
  }
}

module.exports = { initializeSupabase };
