const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get all jobs from the last 90 days, sorted by creation date descending
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 90 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
}
