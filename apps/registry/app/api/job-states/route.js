import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/lib/supabaseConfig';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getSessionUserId } from './sessionUser';

const supabaseUrl = SUPABASE_URL;

const VALID_STATES = ['read', 'interested', 'hidden'];

const unavailable = () =>
  NextResponse.json(
    { message: 'API not available during build' },
    { status: 503 }
  );

const unauthorized = () =>
  NextResponse.json({ message: 'Sign in required' }, { status: 401 });

/**
 * GET /api/job-states
 * Get all job states for the signed-in user
 */
export async function GET(request) {
  if (!process.env.SUPABASE_KEY) return unavailable();

  const userId = await getSessionUserId(request);
  if (!userId) return unauthorized();

  try {
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    const { data, error } = await supabase
      .from('job_states')
      .select('job_id, state')
      .eq('user_id', userId);

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
 * Save or update a job state for the signed-in user
 */
export async function POST(request) {
  if (!process.env.SUPABASE_KEY) return unavailable();

  const userId = await getSessionUserId(request);
  if (!userId) return unauthorized();

  try {
    const { jobId, state } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { message: 'Missing required field: jobId' },
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

    if (state === null) {
      // Delete the state
      const { error } = await supabase
        .from('job_states')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', jobId);

      if (error) throw error;

      logger.info({ userId, jobId }, 'Job state deleted');
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

    logger.info({ userId, jobId, state }, 'Job state saved');
    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error({ error: error.message }, 'Error saving job state');
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
