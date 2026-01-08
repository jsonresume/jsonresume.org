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

  // Track state for deduplication - use refs to avoid dependency issues
  const lastFetchKeyRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Refs for latest values to avoid stale closures
  const timeRangeRef = useRef(timeRange);
  const resumeRef = useRef(resume);

  // Keep refs in sync
  useEffect(() => {
    timeRangeRef.current = timeRange;
  }, [timeRange]);

  useEffect(() => {
    resumeRef.current = resume;
  }, [resume]);

  const fetchJobs = useCallback(
    async (forceRefresh = false, requestedTimeRange = null) => {
      // Use refs for latest values
      const effectiveTimeRange = requestedTimeRange || timeRangeRef.current;
      const currentResume = resumeRef.current;
      const pureResumeHash = hashResume(currentResume);
      const cacheKey = `${pureResumeHash}_${effectiveTimeRange}`;

      console.log('[Graph] fetchJobs called', {
        forceRefresh,
        effectiveTimeRange,
        cacheKey,
        lastFetchKey: lastFetchKeyRef.current,
      });

      // Skip if no embedding
      if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
        console.log('[Graph] No embedding, skipping fetch');
        return;
      }

      // Skip if already fetched this exact data (unless force refresh)
      if (!forceRefresh && lastFetchKeyRef.current === cacheKey) {
        console.log('[Graph] Already have this data, skipping fetch');
        return;
      }

      // Skip if another fetch is in progress
      if (isFetchingRef.current) {
        console.log('[Graph] Fetch already in progress, skipping');
        return;
      }

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      setLoadingStage(LOADING_STAGES.CHECKING_CACHE);
      setLoadingDetails({ message: 'Checking cached data...' });

      // Check cache unless force refresh requested
      if (!forceRefresh) {
        console.log('[Graph] Checking IndexedDB cache for:', cacheKey);
        const cached = await getCachedGraphData(cacheKey);

        if (cached) {
          console.log('[Graph] Cache hit:', cached.allJobs?.length, 'jobs');
          setLoadingStage(LOADING_STAGES.CACHE_HIT);
          await new Promise((resolve) => setTimeout(resolve, 300));

          setJobs(cached.allJobs);
          setJobInfo(cached.jobInfoMap);

          const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
            cached.graphData,
            cached.jobInfoMap
          );
          setNodes(rfNodes);
          setEdges(rfEdges);

          lastFetchKeyRef.current = cacheKey;
          setLoadingStage(LOADING_STAGES.COMPLETE);
          setIsLoading(false);
          isFetchingRef.current = false;
          console.log('[Graph] Loaded from cache:', rfNodes.length, 'nodes');
          return;
        }
        console.log('[Graph] Cache miss');
      }

      try {
        setLoadingStage(LOADING_STAGES.FETCHING_JOBS);
        setLoadingDetails({ message: 'Finding matching jobs...' });
        console.log('[Graph] Calling API with timeRange:', effectiveTimeRange);

        const response = await fetch('/api/pathways/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embedding,
            resumeId: 'resume',
            timeRange: effectiveTimeRange,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const { graphData, jobInfoMap, allJobs } = await response.json();
        console.log(
          '[Graph] API returned:',
          allJobs?.length,
          'jobs,',
          graphData?.nodes?.length,
          'nodes'
        );

        setLoadingStage(LOADING_STAGES.BUILDING_GRAPH);
        setLoadingDetails({
          message: 'Building career graph...',
          jobCount: allJobs?.length || 0,
        });

        // Cache the data
        await setCachedGraphData(cacheKey, { graphData, jobInfoMap, allJobs });
        lastFetchKeyRef.current = cacheKey;

        setJobs(allJobs);
        setJobInfo(jobInfoMap);

        const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
          graphData,
          jobInfoMap
        );
        console.log(
          '[Graph] Built graph:',
          rfNodes.length,
          'nodes,',
          rfEdges.length,
          'edges'
        );
        setNodes(rfNodes);
        setEdges(rfEdges);

        setLoadingStage(LOADING_STAGES.COMPLETE);
      } catch (err) {
        console.error('[Graph] Error:', err);
        logger.error({ error: err.message }, 'Error fetching pathways jobs');
        setError(err.message);
        pathwaysToast.jobsFetchError();
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [embedding, setNodes, setEdges] // Minimal dependencies - use refs for timeRange/resume
  );

  // Effect to fetch when key inputs change
  useEffect(() => {
    if (!embedding) return;

    const pureResumeHash = hashResume(resume);
    const currentKey = `${pureResumeHash}_${timeRange}`;

    console.log('[Graph] Effect check:', {
      currentKey,
      lastKey: lastFetchKeyRef.current,
      needsFetch: currentKey !== lastFetchKeyRef.current,
    });

    // Fetch if we don't have this data yet
    if (currentKey !== lastFetchKeyRef.current) {
      fetchJobs(false, timeRange);
    }
  }, [embedding, resume, timeRange, graphVersion, fetchJobs]);

  return {
    jobs,
    jobInfo,
    isLoading,
    error,
    loadingStage,
    loadingDetails,
    refetch: () => fetchJobs(true, timeRangeRef.current),
  };
}
