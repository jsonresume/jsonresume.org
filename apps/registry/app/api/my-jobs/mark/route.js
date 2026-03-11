import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getServiceSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

/**
 * POST /api/my-jobs/mark — mark a job state (cookie session auth)
 * Body: { jobId, state }
 */
export async function POST(request) {
  const cookieStore = cookies();
  const authClient = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await authClient.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const username =
    session.user.user_metadata?.user_name ||
    session.user.user_metadata?.preferred_username;

  const { jobId, state } = await request.json();
  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  try {
    if (!state) {
      await supabase
        .from('pathways_job_feedback')
        .delete()
        .eq('job_id', jobId)
        .eq('user_id', username);
    } else {
      await supabase.from('pathways_job_feedback').upsert(
        {
          job_id: jobId,
          user_id: username,
          sentiment: state,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'job_id,user_id' }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error({ error: err.message }, 'Error marking job');
    return NextResponse.json({ error: 'Failed to mark job' }, { status: 500 });
  }
}
