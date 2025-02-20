import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getResumeForUser(username) {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('resume')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching resume:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return JSON.parse(data.resume);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return null;
  }
}
