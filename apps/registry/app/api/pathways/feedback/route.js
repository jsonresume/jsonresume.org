import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId, jobId, feedback, sentiment, jobTitle, jobCompany } =
      await request.json();

    if (!userId || !jobId || !feedback) {
      return Response.json(
        { error: 'userId, jobId, and feedback are required' },
        { status: 400 }
      );
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
      return Response.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error in feedback POST:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
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
      console.error('Error loading feedback:', error);
      return Response.json(
        { error: 'Failed to load feedback' },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error in feedback GET:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
