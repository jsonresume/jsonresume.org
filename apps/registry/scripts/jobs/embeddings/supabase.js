const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL: supabaseUrl } = require('../../../lib/supabaseConfig');

function createSupabaseClient() {
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseKey) {
    throw new Error('SUPABASE_KEY environment variable is required');
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
  } catch (error) {
    throw new Error(`Failed to create Supabase client: ${error.message}`);
  }
}

module.exports = { createSupabaseClient };
