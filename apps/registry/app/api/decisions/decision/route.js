import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

/**
 * POST /api/decisions/decision
 * Save or update a user's decision on a job
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
    const { userId, jobId, decision } = body;

    // Validate input
    if (!userId || !jobId || !decision) {
      return NextResponse.json(
        { message: 'Missing required fields: userId, jobId, decision' },
        { status: 400 }
      );
    }

    if (!['interested', 'pass'].includes(decision)) {
      return NextResponse.json(
        { message: 'Invalid decision. Must be "interested" or "pass"' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    // Upsert the decision (insert or update if exists)
    const { data, error } = await supabase
      .from('job_decisions')
      .upsert(
        {
          user_id: userId,
          job_id: jobId,
          decision: decision,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,job_id',
        }
      )
      .select()
      .single();

    if (error) throw error;

    logger.info({ userId, jobId, decision }, 'Job decision saved successfully');

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error saving job decision');
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/decisions/decision?userId=xxx&jobId=yyy
 * Get a user's decision on a specific job
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
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');

    if (!userId || !jobId) {
      return NextResponse.json(
        { message: 'Missing required query params: userId, jobId' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    const { data, error } = await supabase
      .from('job_decisions')
      .select('*')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || null,
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error fetching job decision');
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
