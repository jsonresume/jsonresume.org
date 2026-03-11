import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getServiceSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

async function getResumeEmbedding(resume) {
  const text = [
    resume.basics?.label,
    resume.basics?.summary,
    ...(resume.skills || []).map(
      (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
    ),
    ...(resume.work || []).map(
      (w) => `${w.position} at ${w.name}: ${w.summary || ''}`
    ),
  ]
    .filter(Boolean)
    .join('\n');

  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-large'),
    value: text,
  });
  return embedding;
}

/**
 * GET /api/my-jobs — matched jobs for the logged-in user (cookie session auth)
 */
export async function GET() {
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

  if (!username) {
    return NextResponse.json(
      { error: 'GitHub username not found in session' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://registry.jsonresume.org/${username}.json`);
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Resume not found on registry' },
        { status: 404 }
      );
    }
    const resume = await res.json();
    const embedding = await getResumeEmbedding(resume);

    const supabase = getServiceSupabase();
    const createdAfter = new Date(
      Date.now() - 60 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: matched, error } = await supabase.rpc('match_jobs_v5', {
      query_embedding: embedding,
      match_threshold: -1,
      match_count: 200,
      created_after: createdAfter,
    });

    if (error) throw new Error(error.message);

    const jobIds = (matched || []).map((m) => m.id);
    if (jobIds.length === 0) {
      return NextResponse.json({ jobs: [], total: 0, username });
    }

    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, uuid, gpt_content, posted_at, url, salary_usd')
      .in('id', jobIds);

    const { data: feedback } = await supabase
      .from('pathways_job_feedback')
      .select('job_id, sentiment')
      .eq('user_id', username);

    const stateMap = {};
    (feedback || []).forEach((f) => {
      stateMap[f.job_id] = f.sentiment;
    });

    const results = (jobs || [])
      .map((job) => {
        try {
          const parsed = JSON.parse(job.gpt_content);
          if (!parsed?.title || !parsed?.company) return null;

          const similarity =
            matched.find((m) => m.id === job.id)?.similarity || 0;

          return {
            id: job.id,
            uuid: job.uuid,
            title: parsed.title,
            company: parsed.company,
            location: parsed.location,
            remote: parsed.remote,
            salary: parsed.salary,
            salary_usd: job.salary_usd,
            type: parsed.type,
            skills: parsed.skills,
            url: job.url,
            posted_at: job.posted_at,
            similarity: Math.round(similarity * 1000) / 1000,
            state: stateMap[job.id] || null,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.similarity - a.similarity);

    return NextResponse.json({
      jobs: results,
      total: results.length,
      username,
    });
  } catch (err) {
    logger.error({ error: err.message }, 'Error in my-jobs endpoint');
    return NextResponse.json(
      { error: 'Failed to match jobs' },
      { status: 500 }
    );
  }
}
