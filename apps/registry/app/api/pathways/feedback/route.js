import { getSupabase } from '../supabase';
import { logger } from '@/lib/logger';

export async function POST(request) {
  const supabase = getSupabase();
  try {
    const { userId, jobId, feedback, sentiment, jobTitle, jobCompany } =
      await request.json();

    // feedback text is optional for swipe actions (interested/dismissed)
    if (!userId || !jobId) {
      return Response.json(
        { error: 'userId and jobId are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('pathways_job_feedback')
      .insert({
        user_id: userId,
        job_id: jobId,
        feedback: feedback || '', // Empty string for swipe-only actions
        sentiment: sentiment || 'dismissed',
        job_title: jobTitle || null,
        job_company: jobCompany || null,
      })
      .select()
      .single();

    if (error) {
      logger.error({ error: error.message }, 'Error saving feedback');
      return Response.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in feedback POST');
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  const supabase = getSupabase();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
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
      logger.error({ error: error.message }, 'Error loading feedback');
      return Response.json(
        { error: 'Failed to load feedback' },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (error) {
    logger.error({ error: error.message }, 'Error in feedback GET');
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
