import logger from './logger';

const trackView = async (username) => {
  // Skip tracking if Supabase key is not configured (e.g., in CI/test environments)
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseKey) {
    logger.debug('Skipping view tracking: SUPABASE_KEY not configured');
    return;
  }

  // Lazy load Supabase client only when needed
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

  // insert a view record into the database
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase
      .from('views')
      .insert({
        username,
        created_at: new Date(),
      })
      .select();
  } catch (error) {
    logger.error({ error: error.message, username }, 'Failed to track view');
  }
};

export default trackView;
