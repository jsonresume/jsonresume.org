import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';
import { convertToReactFlowFormat } from '@/app/[username]/jobs-graph/utils/graphConverter';
import pathwaysToast from '../utils/toastMessages';
import {
  hashResume,
  getCachedGraphData,
  setCachedGraphData,
} from '../utils/pathwaysCache';

// Loading stage definitions
export const LOADING_STAGES = {
  CHECKING_CACHE: 'checking_cache',
  CACHE_HIT: 'cache_hit',
  FETCHING_JOBS: 'fetching_jobs',
  BUILDING_GRAPH: 'building_graph',
  COMPLETE: 'complete',
};

/**
 * Hook to fetch and manage job data for Pathways graph
 * Uses the embedding from PathwaysContext to find matching jobs
 * Implements client-side caching with resume hash validation
 */
export function usePathwaysJobData({
  embedding,
  resume,
  graphVersion,
  setNodes,
  setEdges,
  timeRange = '3m',
}) {
  const [jobs, setJobs] = useState(null);
  const [jobInfo, setJobInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState({});

  // Track the last resume hash to detect changes
  const lastResumeHashRef = useRef(null);

  const fetchJobs = useCallback(
    async (forceRefresh = false) => {
      console.log('[Graph] fetchJobs called', {
        forceRefresh,
        hasEmbedding: !!embedding,
        embeddingLength: embedding?.length,
        timeRange,
      });
      if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
        console.log('[Graph] No embedding, skipping fetch');
        return;
      }

      setIsLoading(true);
      setError(null);
      setLoadingStage(LOADING_STAGES.CHECKING_CACHE);
      setLoadingDetails({ message: 'Checking cached data...' });
      console.log('[Graph] Stage: CHECKING_CACHE');

      // Include timeRange in cache key so different time ranges have separate caches
      const resumeHash = hashResume(resume) + '_' + timeRange;
      console.log('[Graph] Cache key:', resumeHash);

      // Check cache unless force refresh requested
      if (!forceRefresh) {
        console.log('[Graph] Checking IndexedDB cache...');
        const cached = await getCachedGraphData(resumeHash);
        console.log(
          '[Graph] Cache result:',
          cached ? `Found (${cached.allJobs?.length} jobs)` : 'Miss'
        );
        if (cached) {
          setLoadingStage(LOADING_STAGES.CACHE_HIT);
          setLoadingDetails({
            message: 'Loading from cache...',
            jobCount: cached.allJobs?.length || 0,
          });
          console.log('[Graph] Stage: CACHE_HIT');

          // Small delay so user sees the cache hit message
          await new Promise((resolve) => setTimeout(resolve, 300));

          setJobs(cached.allJobs);
          setJobInfo(cached.jobInfoMap);

          const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
            cached.graphData,
            cached.jobInfoMap
          );
          console.log('[Graph] Loaded from cache:', {
            nodes: rfNodes.length,
            edges: rfEdges.length,
          });
          setNodes(rfNodes);
          setEdges(rfEdges);

          lastResumeHashRef.current = resumeHash;
          setLoadingStage(LOADING_STAGES.COMPLETE);
          setIsLoading(false);
          console.log('[Graph] Stage: COMPLETE (from cache)');
          return;
        }
      }

      try {
        setLoadingStage(LOADING_STAGES.FETCHING_JOBS);
        setLoadingDetails({
          message: 'Finding matching jobs...',
          embeddingSize: embedding.length,
        });
        console.log('[Graph] Stage: FETCHING_JOBS (calling API)');

        const response = await fetch('/api/pathways/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embedding, resumeId: 'resume', timeRange }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const { graphData, jobInfoMap, allJobs } = await response.json();
        console.log('[Graph] API response:', {
          jobs: allJobs?.length,
          nodes: graphData?.nodes?.length,
        });

        setLoadingStage(LOADING_STAGES.BUILDING_GRAPH);
        setLoadingDetails({
          message: 'Building career graph...',
          jobCount: allJobs?.length || 0,
          nodeCount: graphData?.nodes?.length || 0,
          edgeCount: graphData?.links?.length || 0,
        });
        console.log('[Graph] Stage: BUILDING_GRAPH');

        // Cache the data
        await setCachedGraphData(resumeHash, {
          graphData,
          jobInfoMap,
          allJobs,
        });
        console.log('[Graph] Cached to IndexedDB');
        lastResumeHashRef.current = resumeHash;

        setJobs(allJobs);
        setJobInfo(jobInfoMap);

        const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
          graphData,
          jobInfoMap
        );
        console.log('[Graph] Built graph:', {
          nodes: rfNodes.length,
          edges: rfEdges.length,
        });
        setNodes(rfNodes);
        setEdges(rfEdges);

        setLoadingStage(LOADING_STAGES.COMPLETE);
        console.log('[Graph] Stage: COMPLETE (from API)');
      } catch (err) {
        console.error('[Graph] Error:', err);
        logger.error({ error: err.message }, 'Error fetching pathways jobs');
        setError(err.message);
        pathwaysToast.jobsFetchError();
      } finally {
        setIsLoading(false);
        console.log('[Graph] isLoading set to false');
      }
    },
    [embedding, resume, setNodes, setEdges, timeRange]
  );

  // Detect resume or timeRange changes and invalidate cache
  useEffect(() => {
    const currentHash = hashResume(resume) + '_' + timeRange;
    console.log('[Graph] Resume/timeRange change check:', {
      currentHash,
      lastHash: lastResumeHashRef.current,
      changed:
        lastResumeHashRef.current && currentHash !== lastResumeHashRef.current,
    });
    if (
      lastResumeHashRef.current &&
      currentHash !== lastResumeHashRef.current
    ) {
      console.log('[Graph] Resume or timeRange changed, forcing refresh');
      // Resume or timeRange changed - force refresh
      fetchJobs(true);
    }
  }, [resume, timeRange, fetchJobs]);

  // Initial fetch when embedding becomes available or graphVersion changes
  useEffect(() => {
    console.log('[Graph] useEffect triggered', {
      graphVersion,
      hasEmbedding: !!embedding,
    });
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- embedding is logged but not a trigger dependency
  }, [fetchJobs, graphVersion]);

  return {
    jobs,
    jobInfo,
    isLoading,
    error,
    loadingStage,
    loadingDetails,
    refetch: () => fetchJobs(true), // Force refresh bypasses cache
  };
}
