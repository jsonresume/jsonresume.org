import logger from '../logger';

export const cacheResume = async (username, resume) => {
  // Skip caching if Supabase key is not configured (e.g., in CI/test environments)
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseKey) {
    logger.debug('Skipping resume caching: SUPABASE_KEY not configured');
    return;
  }

  try {
    // Lazy load Supabase client only when needed
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from('resumes')
      .upsert(
        {
          username,
          resume: JSON.stringify(resume),
          updated_at: new Date(),
        },
        { onConflict: 'username' }
      )
      .select();
  } catch (error) {
    logger.error({ error: error.message, username }, 'Failed to cache resume');
  }
};
