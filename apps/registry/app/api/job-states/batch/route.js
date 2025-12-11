import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

const VALID_STATES = ['read', 'interested', 'hidden'];

/**
 * POST /api/job-states/batch
 * Batch update multiple job states
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
    const { username, updates } = body;

    // Validate input
    if (!username || !updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { message: 'Missing required fields: username, updates (array)' },
        { status: 400 }
      );
    }

    // Validate each update
    for (const update of updates) {
      if (!update.jobId) {
        return NextResponse.json(
          { message: 'Each update must have a jobId' },
          { status: 400 }
        );
      }
      if (update.state !== null && !VALID_STATES.includes(update.state)) {
        return NextResponse.json(
          {
            message: `Invalid state for job ${
              update.jobId
            }. Must be one of: ${VALID_STATES.join(', ')} or null`,
          },
          { status: 400 }
        );
      }
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

    // Separate deletes from upserts
    const deletes = updates.filter((u) => u.state === null);
    const upserts = updates.filter((u) => u.state !== null);

    // Process deletes
    if (deletes.length > 0) {
      const deleteJobIds = deletes.map((d) => d.jobId);
      const { error } = await supabase
        .from('job_states')
        .delete()
        .eq('user_id', userId)
        .in('job_id', deleteJobIds);

      if (error) throw error;
    }

    // Process upserts
    if (upserts.length > 0) {
      const upsertData = upserts.map((u) => ({
        user_id: userId,
        job_id: u.jobId,
        state: u.state,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('job_states')
        .upsert(upsertData, { onConflict: 'user_id,job_id' });

      if (error) throw error;
    }

    logger.info(
      { username, upsertCount: upserts.length, deleteCount: deletes.length },
      'Batch job states updated'
    );

    return NextResponse.json({
      success: true,
      updated: upserts.length,
      deleted: deletes.length,
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error batch updating job states');
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
