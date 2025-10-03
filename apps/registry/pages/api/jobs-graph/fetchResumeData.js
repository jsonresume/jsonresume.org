/**
 * Fetches and parses resume data from Supabase
 * @param {string} username - The username to fetch resume for
 * @returns {Promise<Object>} Parsed resume object
 */
export async function fetchResumeData(username) {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
  const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  if (!data || data.length === 0) {
    throw new Error('Resume not found');
  }

  try {
    return JSON.parse(data[0].resume);
  } catch (error) {
    console.error('Error parsing resume JSON:', error);
    throw new Error('Invalid resume format');
  }
}
