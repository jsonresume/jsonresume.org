import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticate } from '../../../auth';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

/**
 * GET /api/v1/jobs/:id/dossier — fetch saved dossier for a job
 */
export async function GET(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabase();

  const { data } = await supabase
    .from('pathways_job_feedback')
    .select('feedback, created_at')
    .eq('user_id', user.username)
    .eq('job_id', String(id))
    .eq('sentiment', 'dossier')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    return NextResponse.json({ content: null });
  }

  return NextResponse.json({
    content: data.feedback,
    created_at: data.created_at,
  });
}

/**
 * PUT /api/v1/jobs/:id/dossier — save/update dossier for a job
 * Body: { "content": "full dossier text" }
 */
export async function PUT(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const supabase = getSupabase();
  const jobId = String(id);

  // Get job info for context
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
      /* ignore parse errors */
    }
  }

  // Delete existing dossier for this user+job
  await supabase
    .from('pathways_job_feedback')
    .delete()
    .eq('user_id', user.username)
    .eq('job_id', jobId)
    .eq('sentiment', 'dossier');

  const { error } = await supabase.from('pathways_job_feedback').insert({
    user_id: user.username,
    job_id: jobId,
    sentiment: 'dossier',
    feedback: content,
    job_title: jobTitle,
    job_company: jobCompany,
  });

  if (error) {
    return NextResponse.json(
      { error: `Failed to save: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ saved: true });
}
