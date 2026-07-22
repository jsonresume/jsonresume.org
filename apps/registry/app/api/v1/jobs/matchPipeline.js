/**
 * Shared match orchestration for the /api/v1/jobs GET (authenticated) and POST
 * (resume-in-body) handlers. Keeps the run/classify/global-remote-filter tail
 * and the feedback (Rocchio) logic in one place so the route handlers stay
 * thin.
 */
import { logger } from '@/lib/logger';
import { classifyGlobalRemote } from './globalRemote';
import {
  getSupabase,
  normalize,
  averageEmbeddings,
  matchJobs,
} from './matchingHelpers';

// Rocchio relevance-feedback weights (classic defaults, arXiv 2108.11044):
// q' = ALPHA*q + BETA*centroid(liked) - GAMMA*centroid(rejected).
// The previous naive subtraction only used negatives and could nuke whole
// neighborhoods; bounded centroids with a positive term are visible,
// bounded, and reversible.
const ROCCHIO_ALPHA = 1.0;
const ROCCHIO_BETA = 0.75;
const ROCCHIO_GAMMA = 0.15;
const FEEDBACK_MIN = 2; // need >=2 signals of a kind before it counts
const FEEDBACK_CAP = 20; // most recent N of each kind

/**
 * Partition raw feedback rows into the maps the matcher needs:
 *  - stateMap:      job_id -> sentiment (excluding dossier)
 *  - dossierSet:    job_ids flagged with a dossier
 *  - likedJobIds:   interested/applied ids (positive signal)
 *  - rejectedJobIds: not_interested/dismissed ids (negative signal)
 * @param {Array<{job_id: string, sentiment: string}>} feedback
 */
export const partitionFeedback = (feedback) => {
  const stateMap = {};
  const dossierSet = new Set();
  const likedJobIds = [];
  const rejectedJobIds = [];

  (feedback || []).forEach((f) => {
    if (f.sentiment === 'dossier') {
      dossierSet.add(f.job_id);
    } else {
      stateMap[f.job_id] = f.sentiment;
      if (f.sentiment === 'not_interested' || f.sentiment === 'dismissed') {
        rejectedJobIds.push(f.job_id);
      } else if (f.sentiment === 'interested' || f.sentiment === 'applied') {
        likedJobIds.push(f.job_id);
      }
    }
  });

  return { stateMap, dossierSet, likedJobIds, rejectedJobIds };
};

/** Fetch and parse stored job embeddings for a set of ids. */
const fetchJobEmbeddings = async (jobIds) => {
  const ids = jobIds
    .map(Number)
    .filter((n) => !isNaN(n))
    .slice(-FEEDBACK_CAP);
  if (ids.length === 0) {
    return [];
  }
  const { data } = await getSupabase()
    .from('jobs')
    .select('embedding_v5')
    .in('id', ids)
    .not('embedding_v5', 'is', null);
  return (data || [])
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
};

/**
 * Rocchio relevance feedback: blend the query embedding toward the centroid
 * of liked jobs and away from the centroid of rejected jobs. Each term only
 * applies with >= FEEDBACK_MIN signals. Failures are logged and the original
 * embedding is returned unchanged.
 */
export const applyFeedbackSignal = async (
  embedding,
  likedJobIds = [],
  rejectedJobIds = []
) => {
  const wantPos = likedJobIds.length >= FEEDBACK_MIN;
  const wantNeg = rejectedJobIds.length >= FEEDBACK_MIN;
  if (!embedding || (!wantPos && !wantNeg)) {
    return embedding;
  }

  try {
    const [posEmbs, negEmbs] = await Promise.all([
      wantPos ? fetchJobEmbeddings(likedJobIds) : [],
      wantNeg ? fetchJobEmbeddings(rejectedJobIds) : [],
    ]);
    const posAvg =
      posEmbs.length >= FEEDBACK_MIN ? averageEmbeddings(posEmbs) : null;
    const negAvg =
      negEmbs.length >= FEEDBACK_MIN ? averageEmbeddings(negEmbs) : null;
    if (!posAvg && !negAvg) {
      return embedding;
    }

    const adjusted = embedding.map(
      (v, i) =>
        ROCCHIO_ALPHA * v +
        (posAvg ? ROCCHIO_BETA * posAvg[i] : 0) -
        (negAvg ? ROCCHIO_GAMMA * negAvg[i] : 0)
    );
    return normalize(adjusted);
  } catch (err) {
    logger.warn({ error: err.message }, 'Rocchio feedback failed');
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
  lexicalQuery = '',
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
    lexicalQuery,
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
