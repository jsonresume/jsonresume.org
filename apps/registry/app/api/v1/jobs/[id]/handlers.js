import { NextResponse } from 'next/server';
import { authenticate } from '../../auth';
import { getSupabase } from '../matchingHelpers';
import { parseGptContent, mergeEnrichedFields } from '../jobRecord';

/**
 * Handlers for /api/v1/jobs/:id (update state, enrich, fetch one).
 * Kept out of route.js so the route module stays under the 200-line policy;
 * route.js simply re-exports these as GET/PUT/PATCH.
 */

// prettier-ignore
const VALID_STATES = ['interested', 'not_interested', 'applied', 'dismissed', 'maybe'];

/** PUT — update job state. Body: { state, feedback } */
export async function updateJobState(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const jobId = String(id);

  const body = await request.json();
  const { state, feedback } = body;

  if (!VALID_STATES.includes(state)) {
    return NextResponse.json(
      { error: `Invalid state. Use: ${VALID_STATES.join(', ')}` },
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

  // Delete existing feedback for this user+job (preserve dossier rows)
  await supabase
    .from('pathways_job_feedback')
    .delete()
    .eq('user_id', user.username)
    .eq('job_id', jobId)
    .neq('sentiment', 'dossier');

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

  return NextResponse.json({
    id: jobId,
    state,
    job_title: jobTitle,
    job_company: jobCompany,
  });
}

/** PATCH — enrich job metadata. Body: { enriched }. Fills missing fields only. */
export async function enrichJob(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const jobId = parseInt(id, 10);
  const body = await request.json();
  const { enriched } = body;

  if (!enriched || typeof enriched !== 'object') {
    return NextResponse.json(
      { error: 'Body must include "enriched" object' },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  const { data: job, error } = await supabase
    .from('jobs')
    .select('gpt_content')
    .eq('id', jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  let parsed;
  try {
    parsed = JSON.parse(job.gpt_content);
  } catch {
    return NextResponse.json({ error: 'Invalid job data' }, { status: 500 });
  }

  // Only fill in missing/empty fields — never overwrite existing data
  const { merged, updated } = mergeEnrichedFields(parsed, enriched);

  if (!updated) {
    return NextResponse.json({
      updated: false,
      message: 'No empty fields to fill',
    });
  }

  // Null out embedding so it gets re-generated with updated content
  const { error: updateErr } = await supabase
    .from('jobs')
    .update({ gpt_content: JSON.stringify(merged), embedding_v5: null })
    .eq('id', jobId);

  if (updateErr) {
    return NextResponse.json(
      { error: `Update failed: ${updateErr.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ updated: true, fields: Object.keys(enriched) });
}

/** GET — fetch a single job with full details plus the caller's state. */
export async function getJob(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const jobId = parseInt(id, 10);

  const supabase = getSupabase();
  const { data: job, error } = await supabase
    .from('jobs')
    .select(
      'id, uuid, content, gpt_content, gpt_content_full, posted_at, url, salary_usd'
    )
    .eq('id', jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const parsed = parseGptContent(job.gpt_content);

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
