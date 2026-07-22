/**
 * Shared match orchestration for the /api/v1/jobs GET (authenticated) and POST
 * (resume-in-body) handlers. Keeps the run/classify/global-remote-filter tail
 * and the feedback + negative-signal logic in one place so the route handlers
 * stay thin.
 */
import { logger } from '@/lib/logger';
import { classifyGlobalRemote } from './globalRemote';
import {
  getSupabase,
  subtractDirection,
  averageEmbeddings,
  matchJobs,
} from './matchingHelpers';

/**
 * Partition raw feedback rows into the maps the matcher needs:
 *  - stateMap:      job_id -> sentiment (excluding dossier)
 *  - dossierSet:    job_ids flagged with a dossier
 *  - rejectedJobIds: not_interested/dismissed ids (negative signal)
 * @param {Array<{job_id: string, sentiment: string}>} feedback
 */
export const partitionFeedback = (feedback) => {
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

  return { stateMap, dossierSet, rejectedJobIds };
};

/**
 * Nudge the query embedding away from rejected jobs by subtracting their
 * average direction. Returns the (possibly) adjusted embedding; failures are
 * logged and the original embedding is returned unchanged.
 */
export const applyNegativeSignal = async (embedding, rejectedJobIds) => {
  if (!(rejectedJobIds.length >= 2 && embedding)) {
    return embedding;
  }

  try {
    const ids = rejectedJobIds
      .map(Number)
      .filter((n) => !isNaN(n))
      .slice(0, 20);
    if (ids.length === 0) return embedding;

    const { data: rejJobs } = await getSupabase()
      .from('jobs')
      .select('embedding_v5')
      .in('id', ids)
      .not('embedding_v5', 'is', null);

    const rejEmbs = (rejJobs || [])
      .map((j) => {
        const e = j.embedding_v5;
        if (Array.isArray(e)) return e;
        if (typeof e === 'string') {
          try {
            return JSON.parse(e);
          } catch {
            return null;
          }
        }
        return null;
      })
      .filter((e) => Array.isArray(e) && e.length > 0);

    const negAvg = rejEmbs.length > 0 ? averageEmbeddings(rejEmbs) : null;
    return negAvg ? subtractDirection(embedding, negAvg, 0.12) : embedding;
  } catch (negErr) {
    logger.warn({ error: negErr.message }, 'Negative feedback failed');
    return embedding;
  }
};

/**
 * Run the matcher, classify global-remote, and apply the global-remote
 * PREFERENCE. Returns results already sliced to `top`. `globalRemote`
 * triples the fetch width before partitioning to keep enough candidates.
 *
 * global_remote is a sparse, LLM-inferred label — using it as a hard filter
 * collapsed the pool to 8 jobs in the 2026-07 eval (3 of them gold-worst
 * gigs) and dropped a job that explicitly pays non-US hires. It now sorts
 * classified-global jobs first and backfills with the remaining remote jobs
 * instead of discarding them.
 */
export const runMatchPipeline = async ({
  embedding,
  resumeText,
  searchPrompt = '',
  top,
  days,
  remote,
  globalRemote,
  minSalary,
  includeUnknownSalary,
  search,
  shouldRerank,
  stateMap,
  candidate,
}) => {
  const results = await matchJobs({
    embedding,
    resumeText,
    searchPrompt,
    top: globalRemote ? top * 3 : top,
    days,
    remote: remote || globalRemote,
    minSalary,
    includeUnknownSalary,
    search,
    shouldRerank,
    stateMap,
    candidate,
  });

  await classifyGlobalRemote(results);

  if (!globalRemote) {
    return results.slice(0, top);
  }

  // Stable partition: confirmed-global first, other remote jobs as backfill.
  const global = results.filter((j) => j.global_remote === true);
  const backfill = results.filter((j) => j.global_remote !== true);
  return [...global, ...backfill].slice(0, top);
};
