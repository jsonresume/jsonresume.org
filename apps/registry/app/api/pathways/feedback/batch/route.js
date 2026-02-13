import { getSupabase } from '../../supabase';
import { logger } from '@/lib/logger';

/**
 * POST - Save feedback for multiple jobs at once
 * Used by bulk job actions (e.g., "mark all jobs under 150k as read because salary too low")
 */
export async function POST(request) {
  const supabase = getSupabase();
  try {
    const { userId, feedbacks } = await request.json();

    if (!userId || !Array.isArray(feedbacks) || feedbacks.length === 0) {
      return Response.json(
        { error: 'userId and feedbacks array are required' },
        { status: 400 }
      );
    }

    // Prepare batch insert data
    const insertData = feedbacks.map((f) => ({
      user_id: userId,
      job_id: f.jobId,
      feedback: f.feedback,
      sentiment: f.sentiment || 'dismissed',
      job_title: f.jobTitle || null,
      job_company: f.jobCompany || null,
    }));

    const { data, error } = await supabase
      .from('pathways_job_feedback')
      .insert(insertData)
      .select();

    if (error) {
      logger.error({ error: error.message }, 'Error saving batch feedback');
      return Response.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return Response.json({ success: true, count: data.length });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in feedback batch POST');
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
