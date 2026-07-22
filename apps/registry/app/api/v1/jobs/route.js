import { NextResponse } from 'next/server';
import { authenticate } from '../auth';
import { logger } from '@/lib/logger';
import { rateLimitResponse } from '../../pathways/rateLimit';
import { getSupabase, getResumeEmbedding } from './matchingHelpers';
import { resolveEmbedding, extractLocation } from './resolveEmbedding';
import {
  partitionFeedback,
  applyNegativeSignal,
  runMatchPipeline,
} from './matchPipeline';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/jobs — matched jobs for the authenticated user
 *
 * Query params:
 *   ?top=20         — number of results (default 20, max 500)
 *   ?days=90        — how far back to look (default 90)
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
  const days = parseInt(searchParams.get('days')) || 90;
  const remote = searchParams.get('remote') === 'true';
  const globalRemote = searchParams.get('global_remote') === 'true';
  const minSalary = parseInt(searchParams.get('min_salary')) || 0;
  const search = searchParams.get('search') || '';
  const searchId = searchParams.get('search_id') || '';
  // Rerank defaults ON for authenticated requests: the 2026-07 eval measured
  // it as the only strategy with acceptable precision (P@5 0.8 vs 0.2 for
  // raw vector order). One listwise gpt-4.1-mini call per request.
  // Opt out with ?rerank=false.
  const shouldRerank = searchParams.get('rerank') !== 'false';
  const useHyde = searchParams.get('hyde') !== 'false';

  try {
    const resolved = await resolveEmbedding({
      username: user.username,
      searchId,
      shouldRerank,
      useHyde,
    });
    if (resolved.error) {
      return NextResponse.json(
        { error: resolved.error.message },
        { status: resolved.error.status }
      );
    }
    let { embedding } = resolved;
    const { resumeText, searchPrompt, candidateLocation } = resolved;

    // Get user feedback for state filtering + negative signal
    const supabase = getSupabase();
    const { data: feedback } = await supabase
      .from('pathways_job_feedback')
      .select('job_id, sentiment')
      .eq('user_id', user.username);

    const { stateMap, dossierSet, rejectedJobIds } =
      partitionFeedback(feedback);

    // Negative feedback: subtract rejected job direction from embedding
    embedding = await applyNegativeSignal(embedding, rejectedJobIds);

    const results = await runMatchPipeline({
      embedding,
      resumeText,
      searchPrompt,
      top,
      days,
      remote,
      globalRemote,
      minSalary,
      includeUnknownSalary:
        searchParams.get('include_unknown_salary') === 'true',
      search,
      shouldRerank,
      stateMap,
      candidate: {
        location: candidateLocation,
        remoteOnly: remote || globalRemote,
      },
    });

    const jobs = results.map((job) => ({
      ...job,
      has_dossier: dossierSet.has(String(job.id)),
    }));

    return NextResponse.json({ jobs, total: jobs.length });
  } catch (err) {
    logger.error(
      { error: err.message, stack: err.stack },
      'Error in v1 jobs endpoint'
    );
    return NextResponse.json(
      { error: 'Failed to match jobs', detail: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/jobs — match jobs against a provided resume.
 *
 * Unauthenticated (this powers the CLI's local-resume mode), but rate-limited
 * per IP and capped tighter than the authed GET — each call burns server-side
 * OpenAI embedding + classification spend.
 */
export async function POST(request) {
  const limited = rateLimitResponse(request);
  if (limited) {
    return limited;
  }

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
    const days = Math.min(parseInt(body.days) || 90, 120);
    const remote = body.remote === true;
    const globalRemote = body.global_remote === true;
    const minSalary = parseInt(body.min_salary) || 0;
    const search = body.search || '';

    const { embedding, text: resumeText } = await getResumeEmbedding(resume);

    const jobs = await runMatchPipeline({
      embedding,
      resumeText,
      searchPrompt: '',
      top,
      days,
      remote,
      globalRemote,
      minSalary,
      includeUnknownSalary: body.include_unknown_salary === true,
      search,
      shouldRerank: false,
      stateMap: null,
      candidate: {
        location: extractLocation(resume),
        remoteOnly: remote || globalRemote,
      },
    });

    return NextResponse.json({ jobs, total: jobs.length });
  } catch (err) {
    logger.error(
      { error: err.message, stack: err.stack },
      'Error in v1 jobs POST endpoint'
    );
    return NextResponse.json(
      { error: 'Failed to match jobs', detail: err.message },
      { status: 500 }
    );
  }
}
