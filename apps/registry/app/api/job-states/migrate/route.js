import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

/**
 * POST /api/job-states/migrate
 * Migrate anonymous session job states to authenticated user
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
    const { sessionId, username, states } = body;

    // Validate input
    if (!sessionId || !username) {
      return NextResponse.json(
        { message: 'Missing required fields: sessionId, username' },
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

    // If states are passed directly from localStorage, use them
    // Otherwise, fetch from session_id in database (if we stored them there)
    let statesToMigrate = states || {};

    if (Object.keys(statesToMigrate).length === 0) {
      // Try to fetch states stored by session_id
      const { data: sessionStates, error: sessionError } = await supabase
        .from('job_states')
        .select('job_id, state')
        .eq('session_id', sessionId);

      if (sessionError) {
        logger.warn(
          { error: sessionError.message },
          'Error fetching session states'
        );
      } else if (sessionStates && sessionStates.length > 0) {
        statesToMigrate = sessionStates.reduce((acc, row) => {
          acc[String(row.job_id)] = row.state;
          return acc;
        }, {});
      }
    }

    if (Object.keys(statesToMigrate).length === 0) {
      logger.info({ sessionId, username }, 'No states to migrate');
      return NextResponse.json({
        success: true,
        migrated: 0,
        message: 'No states to migrate',
      });
    }

    // Prepare upsert data
    const upsertData = Object.entries(statesToMigrate).map(
      ([jobId, state]) => ({
        user_id: userId,
        job_id: parseInt(jobId, 10),
        state: state,
        updated_at: new Date().toISOString(),
      })
    );

    // Upsert states for the user (won't overwrite existing states due to unique constraint)
    const { error: upsertError } = await supabase
      .from('job_states')
      .upsert(upsertData, {
        onConflict: 'user_id,job_id',
        ignoreDuplicates: true, // Don't overwrite existing user states
      });

    if (upsertError) throw upsertError;

    // Clean up session states from database (if any)
    const { error: deleteError } = await supabase
      .from('job_states')
      .delete()
      .eq('session_id', sessionId);

    if (deleteError) {
      logger.warn(
        { error: deleteError.message },
        'Error cleaning up session states'
      );
    }

    logger.info(
      { sessionId, username, count: upsertData.length },
      'Successfully migrated job states'
    );

    return NextResponse.json({
      success: true,
      migrated: upsertData.length,
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error migrating job states');
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
