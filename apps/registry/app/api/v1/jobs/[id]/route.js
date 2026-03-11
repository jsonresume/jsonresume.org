import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticate } from '../../auth';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

/**
 * PUT /api/v1/jobs/:id — update job state
 * Body: { "state": "interested" | "pass" | "applied" | null }
 */
export async function PUT(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const jobId = parseInt(id, 10);
  if (!jobId) {
    return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
  }

  const body = await request.json();
  const { state } = body;

  const validStates = ['interested', 'pass', 'applied', 'hidden'];
  if (state !== null && !validStates.includes(state)) {
    return NextResponse.json(
      { error: `Invalid state. Use: ${validStates.join(', ')} or null` },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  if (state === null) {
    // Remove state
    await supabase
      .from('job_states')
      .delete()
      .eq('session_id', user.username)
      .eq('job_id', jobId);

    return NextResponse.json({ id: jobId, state: null });
  }

  // Upsert state
  const { error } = await supabase.from('job_states').upsert(
    {
      session_id: user.username,
      job_id: jobId,
      state,
    },
    { onConflict: 'session_id,job_id' }
  );

  if (error) {
    return NextResponse.json(
      { error: `Failed to update: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: jobId, state });
}

/**
 * GET /api/v1/jobs/:id — get a single job with full details
 */
export async function GET(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const jobId = parseInt(id, 10);

  const supabase = getSupabase();
  const { data: job, error } = await supabase
    .from('jobs')
    .select('id, uuid, content, gpt_content, gpt_content_full, posted_at, url, salary_usd')
    .eq('id', jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  let parsed = {};
  try {
    parsed = JSON.parse(job.gpt_content);
  } catch {
    /* empty */
  }

  const { data: stateRow } = await supabase
    .from('job_states')
    .select('state')
    .eq('session_id', user.username)
    .eq('job_id', jobId)
    .single();

  return NextResponse.json({
    id: job.id,
    uuid: job.uuid,
    ...parsed,
    raw_content: job.content,
    full_description: job.gpt_content_full,
    url: job.url,
    salary_usd: job.salary_usd,
    posted_at: job.posted_at,
    state: stateRow?.state || null,
  });
}
