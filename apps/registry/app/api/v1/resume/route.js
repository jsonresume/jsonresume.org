import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticate } from '../auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

/**
 * PUT /api/v1/resume — update the authenticated user's cached resume
 * Body: full JSON Resume object
 *
 * Updates the Supabase cache so changes reflect immediately on the registry.
 * The user's GitHub gist remains the long-term source of truth.
 */
export async function PUT(request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let resume;
  try {
    resume = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!resume || typeof resume !== 'object' || !resume.basics) {
    return NextResponse.json(
      {
        error:
          'Invalid resume — must be a JSON Resume object with at least a "basics" section',
      },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('resumes')
      .upsert(
        {
          username: user.username,
          resume: JSON.stringify(resume),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'username' }
      )
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json({
      username: user.username,
      message: 'Resume updated',
    });
  } catch (err) {
    logger.error({ error: err.message }, 'Failed to update resume');
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}
