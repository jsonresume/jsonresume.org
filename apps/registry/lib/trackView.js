const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

const trackView = async (username) => {
  // Skip tracking if Supabase key is not configured (e.g., in CI/test environments)
  if (!supabaseKey) {
    console.log('Skipping view tracking: SUPABASE_KEY not configured');
    return;
  }

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
    console.error('Failed to insert profile view:', error);
  }
};

export default trackView;
