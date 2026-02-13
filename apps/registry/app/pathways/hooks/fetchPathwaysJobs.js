import { logger } from '@/lib/logger';
import { createRetryFetch } from '@/lib/retry';
import { convertToReactFlowFormat } from '@/app/[username]/jobs-graph/utils/graphConverter';
import pathwaysToast from '../utils/toastMessages';
import {
  hashResume,
  getCachedGraphData,
  setCachedGraphData,
} from '../utils/pathwaysCache';
import { LOADING_STAGES } from './usePathwaysJobData';

const fetchWithRetry = createRetryFetch({
  maxAttempts: 3,
  retryableStatuses: [429, 500, 502, 503, 504],
});

/**
 * Try loading graph data from cache.
 * Returns { hit: true, data } or { hit: false }.
 */
export async function tryLoadFromCache(cacheKey) {
  const cached = await getCachedGraphData(cacheKey);
  if (!cached) return { hit: false };
  return {
    hit: true,
    allJobs: cached.allJobs,
    jobInfoMap: cached.jobInfoMap,
    nearestNeighbors: cached.nearestNeighbors || {},
    graphData: cached.graphData,
    rfData: convertToReactFlowFormat(cached.graphData, cached.jobInfoMap),
  };
}

/**
 * Fetch jobs from the API and build graph data.
 */
export async function fetchJobsFromAPI({
  embedding,
  timeRange,
  onStageChange,
}) {
  onStageChange(LOADING_STAGES.FETCHING_JOBS, {
    message: 'Finding matching jobs...',
    embeddingSize: embedding.length,
  });

  const response = await fetchWithRetry('/api/pathways/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embedding,
      resumeId: 'resume',
      timeRange,
    }),
  });

  const {
    graphData,
    jobInfoMap,
    allJobs,
    nearestNeighbors: nn,
  } = await response.json();

  onStageChange(LOADING_STAGES.BUILDING_GRAPH, {
    message: 'Building career graph...',
    jobCount: allJobs?.length || 0,
    nodeCount: graphData?.nodes?.length || 0,
    edgeCount: graphData?.links?.length || 0,
  });

  const rfData = convertToReactFlowFormat(graphData, jobInfoMap);

  return {
    allJobs,
    jobInfoMap,
    nearestNeighbors: nn || {},
    graphData,
    rfData,
  };
}

/**
 * Cache graph data and apply it to state setters.
 */
export async function applyJobData(
  result,
  cacheKey,
  { setJobs, setJobInfo, setNearestNeighbors, setNodes, setEdges }
) {
  await setCachedGraphData(cacheKey, {
    graphData: result.graphData,
    jobInfoMap: result.jobInfoMap,
    allJobs: result.allJobs,
    nearestNeighbors: result.nearestNeighbors,
  });

  setJobs(result.allJobs);
  setJobInfo(result.jobInfoMap);
  setNearestNeighbors(result.nearestNeighbors);
  setNodes(result.rfData.nodes);
  setEdges(result.rfData.edges);
}

/**
 * Build a cache key from resume + timeRange.
 */
export function buildCacheKey(resume, timeRange) {
  return `${hashResume(resume)}_${timeRange}`;
}

/**
 * Log and handle fetch errors.
 */
export function handleFetchError(err) {
  logger.error({ error: err.message }, 'Error fetching pathways jobs');
  pathwaysToast.jobsFetchError();
}
