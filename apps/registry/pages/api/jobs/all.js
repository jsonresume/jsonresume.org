const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL: supabaseUrl } = require('../../../lib/supabaseConfig');
import logger from '../../../lib/logger';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // During build time or when SUPABASE_KEY is not available
  if (!process.env.SUPABASE_KEY) {
    return res.status(503).json({ message: 'API not available during build' });
  }

  try {
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    // Get all jobs from the last 90 days, sorted by creation date descending
    const { data: jobs, error } = await supabase
      .from('jobs')
      // Skip the embedding vectors (~40KB per row)
      .select(
        'id, uuid, created_at, posted_at, url, type, content, gpt_content, salary_usd, salary_min, salary_max, salary_currency'
      )
      .gte(
        'created_at',
        new Date(Date.now() - 60 * 24 * 60 * 90 * 1000).toISOString()
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(jobs || []);
  } catch (error) {
    logger.error({ error: error.message }, 'Error fetching jobs');
    return res.status(500).json({ message: 'Internal server error' });
  }
}
