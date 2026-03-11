import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { authenticate } from '../auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getSupabase() {
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
 * GET /api/v1/jobs — matched jobs for the authenticated user
 *
 * Query params:
 *   ?top=20         — number of results (default 20, max 100)
 *   ?days=30        — how far back to look (default 30)
 *   ?remote=true    — filter remote only
 *   ?min_salary=100 — minimum salary in thousands
 *   ?search=react   — keyword search in parsed content
 */
export async function GET(request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const top = Math.min(parseInt(searchParams.get('top')) || 20, 100);
  const days = parseInt(searchParams.get('days')) || 30;
  const remote = searchParams.get('remote') === 'true';
  const minSalary = parseInt(searchParams.get('min_salary')) || 0;
  const search = searchParams.get('search') || '';

  try {
    // Fetch resume
    const res = await fetch(
      `https://registry.jsonresume.org/${user.username}.json`
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }
    const resume = await res.json();

    // Generate embedding
    const embedding = await getResumeEmbedding(resume);

    // Match jobs
    const supabase = getSupabase();
    const createdAfter = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: matched, error } = await supabase.rpc('match_jobs_v5', {
      query_embedding: embedding,
      match_threshold: -1,
      match_count: top * 3,
      created_after: createdAfter,
    });

    if (error) throw new Error(error.message);

    // Fetch full job data
    const jobIds = (matched || []).map((m) => m.id);
    if (jobIds.length === 0) {
      return NextResponse.json({ jobs: [], total: 0 });
    }

    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, uuid, gpt_content, posted_at, url, salary_usd')
      .in('id', jobIds);

    // Fetch user's job feedback/states
    const { data: feedback } = await supabase
      .from('pathways_job_feedback')
      .select('job_id, sentiment')
      .eq('user_id', user.username);

    const stateMap = {};
    (feedback || []).forEach((f) => {
      stateMap[f.job_id] = f.sentiment;
    });

    // Parse, filter, and rank
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
            experience: parsed.experience,
            type: parsed.type,
            description: parsed.description,
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
      .filter((j) => {
        if (remote && j.remote !== 'Full') return false;
        if (minSalary && j.salary_usd && j.salary_usd < minSalary * 1000)
          return false;
        if (
          search &&
          !JSON.stringify(j).toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, top);

    return NextResponse.json({ jobs: results, total: results.length });
  } catch (err) {
    logger.error({ error: err.message }, 'Error in v1 jobs endpoint');
    return NextResponse.json(
      { error: 'Failed to match jobs' },
      { status: 500 }
    );
  }
}
