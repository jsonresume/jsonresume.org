const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const trackView = async (username) => {
  // insert a view record into the database
  try {
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
