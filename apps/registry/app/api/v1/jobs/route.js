import { NextResponse } from 'next/server';
import { authenticate } from '../auth';
import { logger } from '@/lib/logger';
import { classifyGlobalRemote } from './globalRemote';
import {
  getSupabase,
  getResumeEmbedding,
  generateHydeEmbedding,
  subtractDirection,
  averageEmbeddings,
  matchJobs,
} from './matchingHelpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/jobs — matched jobs for the authenticated user
 *
 * Query params:
 *   ?top=20         — number of results (default 20, max 500)
 *   ?days=30        — how far back to look (default 30)
 *   ?remote=true    — filter remote only
 *   ?min_salary=100 — minimum salary in thousands
 *   ?search=react   — keyword search in parsed content
 *   ?search_id=uuid — use a saved search profile's embedding
 *   ?rerank=true    — enable LLM reranking (default: always on)
 *   ?global_remote=true — classify and filter to globally remote jobs
 */
export async function GET(request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const top = Math.min(parseInt(searchParams.get('top')) || 20, 500);
  const days = parseInt(searchParams.get('days')) || 30;
  const remote = searchParams.get('remote') === 'true';
  const globalRemote = searchParams.get('global_remote') === 'true';
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
      resumeText = result.text;

      // HyDE: generate ideal job posting from resume for better matching
      try {
        embedding = await generateHydeEmbedding(resumeText);
      } catch (hydeErr) {
        logger.warn({ error: hydeErr.message }, 'HyDE failed, using direct');
        embedding = result.embedding;
      }
    }

    // Get user feedback for state filtering + negative signal
    const supabase = getSupabase();
    const { data: feedback } = await supabase
      .from('pathways_job_feedback')
      .select('job_id, sentiment')
      .eq('user_id', user.username);

    const stateMap = {};
    const dossierSet = new Set();
    const rejectedJobIds = [];
    (feedback || []).forEach((f) => {
      if (f.sentiment === 'dossier') {
        dossierSet.add(f.job_id);
      } else {
        stateMap[f.job_id] = f.sentiment;
        if (f.sentiment === 'not_interested' || f.sentiment === 'dismissed') {
          rejectedJobIds.push(f.job_id);
        }
      }
    });

    // Negative feedback: subtract rejected job direction from embedding
    if (rejectedJobIds.length >= 2 && embedding) {
      try {
        const ids = rejectedJobIds
          .map(Number)
          .filter((n) => !isNaN(n))
          .slice(0, 20);
        if (ids.length > 0) {
          const { data: rejJobs } = await getSupabase()
            .from('jobs')
            .select('embedding_v5')
            .in('id', ids)
            .not('embedding_v5', 'is', null);
          const rejEmbs = (rejJobs || [])
            .map((j) => j.embedding_v5)
            .filter(Boolean);
          const negAvg = rejEmbs.length > 0 ? averageEmbeddings(rejEmbs) : null;
          if (negAvg) embedding = subtractDirection(embedding, negAvg, 0.12);
        }
      } catch (negErr) {
        logger.warn({ error: negErr.message }, 'Negative feedback failed');
      }
    }

    const results = await matchJobs({
      embedding,
      resumeText,
      searchPrompt,
      top: globalRemote ? top * 3 : top,
      days,
      remote: remote || globalRemote,
      minSalary,
      search,
      shouldRerank,
      stateMap,
    });

    await classifyGlobalRemote(results);

    let filtered = results;
    if (globalRemote) {
      filtered = results.filter((j) => j.global_remote === true);
    }

    const jobs = filtered.slice(0, top).map((job) => ({
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
 * POST /api/v1/jobs — match jobs against a provided resume (no auth)
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

    const top = Math.min(parseInt(body.top) || 20, 500);
    const days = parseInt(body.days) || 30;
    const remote = body.remote === true;
    const globalRemoteFlag = body.global_remote === true;
    const minSalary = parseInt(body.min_salary) || 0;
    const search = body.search || '';

    const { embedding, text: resumeText } = await getResumeEmbedding(resume);

    const results = await matchJobs({
      embedding,
      resumeText,
      searchPrompt: '',
      top: globalRemoteFlag ? top * 3 : top,
      days,
      remote: remote || globalRemoteFlag,
      minSalary,
      search,
      shouldRerank: false,
      stateMap: null,
    });

    await classifyGlobalRemote(results);

    let filtered = results;
    if (globalRemoteFlag) {
      filtered = results.filter((j) => j.global_remote === true);
    }

    const jobs = filtered.slice(0, top);
    return NextResponse.json({ jobs, total: jobs.length });
  } catch (err) {
    logger.error({ error: err.message }, 'Error in v1 jobs POST endpoint');
    return NextResponse.json(
      { error: 'Failed to match jobs' },
      { status: 500 }
    );
  }
}
