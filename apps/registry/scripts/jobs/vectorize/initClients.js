const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

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

function createOpenAIClient() {
  try {
    console.log('Attempting to create OpenAI client');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client created successfully');
    return openai;
  } catch (error) {
    console.error('Failed to create OpenAI client:', error.message);
    process.exit(1); // Exit if OpenAI fails as it's essential
  }
}

module.exports = { createSupabaseClient, createOpenAIClient };
