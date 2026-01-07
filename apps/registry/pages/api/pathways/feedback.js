import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, jobId, feedback, sentiment, jobTitle, jobCompany } =
      req.body;

    if (!userId || !jobId || !feedback) {
      return res.status(400).json({
        error: 'userId, jobId, and feedback are required',
      });
    }

    const { data, error } = await supabase
      .from('pathways_job_feedback')
      .insert({
        user_id: userId,
        job_id: jobId,
        feedback,
        sentiment: sentiment || 'dismissed',
        job_title: jobTitle || null,
        job_company: jobCompany || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving feedback:', error);
      return res.status(500).json({ error: 'Failed to save feedback' });
    }

    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'GET') {
    const { userId, jobId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    let query = supabase
      .from('pathways_job_feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (jobId) {
      query = query.eq('job_id', jobId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading feedback:', error);
      return res.status(500).json({ error: 'Failed to load feedback' });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
