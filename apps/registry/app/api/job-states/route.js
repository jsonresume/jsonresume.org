import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

const VALID_STATES = ['read', 'interested', 'hidden'];

/**
 * GET /api/job-states?username=xxx
 * Get all job states for a user
 */
export async function GET(request) {
  if (!process.env.SUPABASE_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { message: 'Missing required query param: username' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    // Get user ID from username (via resumes table)
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (resumeError) throw resumeError;

    if (!resumeData) {
      // No resume found - return empty states
      return NextResponse.json({ success: true, states: {} });
    }

    // Fetch job states using username as user identifier
    // Note: We use username since we don't have auth.users integration
    const { data, error } = await supabase
      .from('job_states')
      .select('job_id, state')
      .eq('user_id', resumeData.id);

    if (error) throw error;

    // Convert to map format { jobId: state }
    const states = (data || []).reduce((acc, row) => {
      acc[String(row.job_id)] = row.state;
      return acc;
    }, {});

    return NextResponse.json({ success: true, states });
  } catch (error) {
    logger.error({ error: error.message }, 'Error fetching job states');
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/job-states
 * Save or update a job state
 */
export async function POST(request) {
  if (!process.env.SUPABASE_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { username, jobId, state } = body;

    // Validate input
    if (!username || !jobId) {
      return NextResponse.json(
        { message: 'Missing required fields: username, jobId' },
        { status: 400 }
      );
    }

    if (state !== null && !VALID_STATES.includes(state)) {
      return NextResponse.json(
        {
          message: `Invalid state. Must be one of: ${VALID_STATES.join(
            ', '
          )} or null`,
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    // Get user ID from username
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (resumeError) throw resumeError;

    if (!resumeData) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userId = resumeData.id;

    if (state === null) {
      // Delete the state
      const { error } = await supabase
        .from('job_states')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', jobId);

      if (error) throw error;

      logger.info({ username, jobId }, 'Job state deleted');
      return NextResponse.json({ success: true, deleted: true });
    }

    // Upsert the state
    const { data, error } = await supabase
      .from('job_states')
      .upsert(
        {
          user_id: userId,
          job_id: jobId,
          state: state,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,job_id' }
      )
      .select()
      .single();

    if (error) throw error;

    logger.info({ username, jobId, state }, 'Job state saved');
    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error({ error: error.message }, 'Error saving job state');
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
