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
 * Body: { "state": "interested" | "not_interested" | "applied" | "dismissed" | "maybe", "feedback": "optional reason" }
 */
export async function PUT(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const jobId = String(id);

  const body = await request.json();
  const { state, feedback } = body;

  const validStates = [
    'interested',
    'not_interested',
    'applied',
    'dismissed',
    'maybe',
  ];
  if (!validStates.includes(state)) {
    return NextResponse.json(
      { error: `Invalid state. Use: ${validStates.join(', ')}` },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  // Get job title/company for context
  let jobTitle = null;
  let jobCompany = null;
  const { data: job } = await supabase
    .from('jobs')
    .select('gpt_content')
    .eq('id', parseInt(id, 10))
    .single();
  if (job?.gpt_content) {
    try {
      const parsed = JSON.parse(job.gpt_content);
      jobTitle = parsed.title;
      jobCompany = parsed.company;
    } catch {
      /* empty */
    }
  }

  // Delete existing feedback for this user+job, then insert new
  await supabase
    .from('pathways_job_feedback')
    .delete()
    .eq('user_id', user.username)
    .eq('job_id', jobId);

  const { error } = await supabase.from('pathways_job_feedback').insert({
    user_id: user.username,
    job_id: jobId,
    sentiment: state,
    feedback: feedback || state,
    job_title: jobTitle,
    job_company: jobCompany,
  });

  if (error) {
    return NextResponse.json(
      { error: `Failed to update: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: jobId, state, job_title: jobTitle, job_company: jobCompany });
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
    .from('pathways_job_feedback')
    .select('sentiment')
    .eq('user_id', user.username)
    .eq('job_id', String(jobId))
    .order('created_at', { ascending: false })
    .limit(1)
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
    state: stateRow?.sentiment || null,
  });
}
