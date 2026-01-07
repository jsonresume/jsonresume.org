import { createClient } from '@supabase/supabase-js';

// Force Node.js runtime for Supabase compatibility
export const runtime = 'nodejs';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, key);
}

export async function POST(request) {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (error) {
    console.error('Supabase init error:', error);
    return Response.json(
      { error: 'Database configuration error' },
      { status: 500 }
    );
  }

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
  let supabase;
  try {
    supabase = getSupabase();
  } catch (error) {
    console.error('Supabase init error:', error);
    return Response.json(
      { error: 'Database configuration error' },
      { status: 500 }
    );
  }

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
