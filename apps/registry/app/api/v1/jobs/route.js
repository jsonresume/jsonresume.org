import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { embed, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { authenticate } from '../auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const RERANK_BATCH_SIZE = 5;

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
  return { embedding, text };
}

/**
 * LLM reranking: score each job 1-10 against the search context.
 * Processes in parallel batches for speed.
 */
async function rerankJobs(jobs, resumeText, searchPrompt) {
  const context = searchPrompt
    ? `The candidate is specifically looking for: ${searchPrompt}\n\nTheir background:\n${resumeText}`
    : `Candidate background:\n${resumeText}`;

  // Process in parallel batches
  const batches = [];
  for (let i = 0; i < jobs.length; i += RERANK_BATCH_SIZE) {
    batches.push(jobs.slice(i, i + RERANK_BATCH_SIZE));
  }

  const allScores = [];

  for (const batch of batches) {
    const promises = batch.map(async (job) => {
      const jobText = [
        `Title: ${job.title}`,
        `Company: ${job.company}`,
        job.location ? `Location: ${job.location}` : null,
        job.remote ? `Remote: ${job.remote}` : null,
        job.salary ? `Salary: ${job.salary}` : null,
        job.experience ? `Experience: ${job.experience}` : null,
        job.description
          ? `Description: ${job.description.slice(0, 500)}`
          : null,
        job.skills?.length
          ? `Skills: ${job.skills.map((s) => s.name || s).join(', ')}`
          : null,
      ]
        .filter(Boolean)
        .join('\n');

      try {
        const { text } = await generateText({
          model: openai('gpt-4.1-mini'),
          system: `You are a job matching scorer. Given a candidate profile and a job posting, rate the match quality from 1-10. Consider: skill alignment, experience level, location/remote fit, salary expectations, industry match, and the candidate's stated preferences. Output ONLY a JSON object: {"score": N, "reason": "one sentence"}. Be strict — only 8+ for strong matches.`,
          prompt: `${context}\n\nJob posting:\n${jobText}`,
          maxTokens: 80,
        });
        const parsed = JSON.parse(text);
        return {
          id: job.id,
          rerank_score: Math.min(10, Math.max(1, parsed.score || 5)),
        };
      } catch {
        return { id: job.id, rerank_score: 5 };
      }
    });
    const results = await Promise.all(promises);
    allScores.push(...results);
  }

  return allScores;
}

/**
 * Shared: fetch, parse, filter, and optionally rerank job matches.
 */
async function matchJobs({
  embedding,
  resumeText,
  searchPrompt,
  top,
  days,
  remote,
  minSalary,
  search,
  shouldRerank,
  stateMap,
}) {
  const supabase = getSupabase();
  const createdAfter = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: matched, error } = await supabase.rpc('match_jobs_v5', {
    query_embedding: embedding,
    match_threshold: -1,
    match_count: top * 5,
    created_after: createdAfter,
  });

  if (error) throw new Error(error.message);

  const jobIds = (matched || []).map((m) => m.id);
  if (jobIds.length === 0) return [];

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, uuid, gpt_content, posted_at, url, salary_usd')
    .in('id', jobIds);

  const HIDDEN_STATES = new Set(['not_interested', 'dismissed']);

  let results = (jobs || [])
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
          state: stateMap?.[job.id] || null,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter((j) => {
      if (stateMap && HIDDEN_STATES.has(j.state)) return false;
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
    .sort((a, b) => b.similarity - a.similarity);

  if (shouldRerank && results.length > 0) {
    const toRerank = results.slice(0, Math.min(30, top * 2));
    const rest = results.slice(Math.min(30, top * 2));

    try {
      const scores = await rerankJobs(toRerank, resumeText, searchPrompt);
      const scoreMap = {};
      scores.forEach((s) => {
        scoreMap[s.id] = s.rerank_score;
      });

      const maxSim = Math.max(...toRerank.map((j) => j.similarity), 0.001);
      const reranked = toRerank
        .map((j) => ({
          ...j,
          rerank_score: scoreMap[j.id] || 5,
          combined_score:
            0.4 * (j.similarity / maxSim) + 0.6 * ((scoreMap[j.id] || 5) / 10),
        }))
        .sort((a, b) => b.combined_score - a.combined_score);

      results = [...reranked, ...rest];
    } catch (err) {
      logger.error(
        { error: err.message },
        'Reranking failed, using vector order'
      );
    }
  }

  return results.slice(0, top);
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
 *   ?search_id=uuid — use a saved search profile's embedding
 *   ?rerank=true    — enable LLM reranking (default: true for search_id)
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
  const searchId = searchParams.get('search_id') || '';
  const rerankParam = searchParams.get('rerank');
  const shouldRerank =
    rerankParam === 'true' || (rerankParam !== 'false' && !!searchId);

  try {
    let embedding;
    let resumeText = '';
    let searchPrompt = '';

    if (searchId) {
      const supabaseForProfile = getSupabase();
      const { data: profile, error: profileErr } = await supabaseForProfile
        .from('search_profiles')
        .select('embedding, user_id, prompt')
        .eq('id', searchId)
        .single();

      if (profileErr || !profile || profile.user_id !== user.username) {
        return NextResponse.json(
          { error: 'Search profile not found' },
          { status: 404 }
        );
      }
      embedding = profile.embedding;
      searchPrompt = profile.prompt || '';

      if (shouldRerank) {
        const res = await fetch(
          `https://registry.jsonresume.org/${user.username}.json`
        );
        if (res.ok) {
          const resume = await res.json();
          resumeText = [
            resume.basics?.label,
            resume.basics?.summary,
            ...(resume.skills || []).map(
              (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
            ),
          ]
            .filter(Boolean)
            .join('\n');
        }
      }
    } else {
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
      const result = await getResumeEmbedding(resume);
      embedding = result.embedding;
      resumeText = result.text;
    }

    // Get user's feedback for state filtering
    const supabase = getSupabase();
    const { data: feedback } = await supabase
      .from('pathways_job_feedback')
      .select('job_id, sentiment')
      .eq('user_id', user.username);

    const stateMap = {};
    const dossierSet = new Set();
    (feedback || []).forEach((f) => {
      if (f.sentiment === 'dossier') {
        dossierSet.add(f.job_id);
      } else {
        stateMap[f.job_id] = f.sentiment;
      }
    });

    const results = await matchJobs({
      embedding,
      resumeText,
      searchPrompt,
      top,
      days,
      remote,
      minSalary,
      search,
      shouldRerank,
      stateMap,
    });

    // Add dossier flag to results
    const jobs = results.map((job) => ({
      ...job,
      has_dossier: dossierSet.has(String(job.id)),
    }));

    return NextResponse.json({ jobs, total: jobs.length });
  } catch (err) {
    logger.error({ error: err.message }, 'Error in v1 jobs endpoint');
    return NextResponse.json(
      { error: 'Failed to match jobs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/jobs — match jobs against a provided resume (no auth required)
 *
 * Body: { resume: {...}, top?: 20, days?: 30, remote?: false, min_salary?: 0, search?: "" }
 *
 * This enables local-mode usage: users with a resume.json file can get
 * matched jobs without a registry account.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { resume } = body;

    if (!resume?.basics) {
      return NextResponse.json(
        {
          error:
            'Request body must include a valid resume with a "basics" section',
        },
        { status: 400 }
      );
    }

    const top = Math.min(parseInt(body.top) || 20, 100);
    const days = parseInt(body.days) || 30;
    const remote = body.remote === true;
    const minSalary = parseInt(body.min_salary) || 0;
    const search = body.search || '';

    const { embedding, text: resumeText } = await getResumeEmbedding(resume);

    const results = await matchJobs({
      embedding,
      resumeText,
      searchPrompt: '',
      top,
      days,
      remote,
      minSalary,
      search,
      shouldRerank: false,
      stateMap: null,
    });

    return NextResponse.json({ jobs: results, total: results.length });
  } catch (err) {
    logger.error({ error: err.message }, 'Error in v1 jobs POST endpoint');
    return NextResponse.json(
      { error: 'Failed to match jobs' },
      { status: 500 }
    );
  }
}
