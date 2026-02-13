import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  tryLoadFromCache,
  fetchJobsFromAPI,
  applyJobData,
  buildCacheKey,
  handleFetchError,
} from './fetchPathwaysJobs';

export const LOADING_STAGES = {
  CHECKING_CACHE: 'checking_cache',
  CACHE_HIT: 'cache_hit',
  FETCHING_JOBS: 'fetching_jobs',
  BUILDING_GRAPH: 'building_graph',
  COMPLETE: 'complete',
};

/**
 * Hook to fetch and manage job data for Pathways graph.
 * Uses embedding to find matching jobs with client-side caching.
 */
export function usePathwaysJobData({
  embedding,
  resume,
  graphVersion,
  setNodes,
  setEdges,
  timeRange = '1m',
}) {
  const [jobs, setJobs] = useState(null);
  const [jobInfo, setJobInfo] = useState({});
  const [nearestNeighbors, setNearestNeighbors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState({});

  const lastCacheKeyRef = useRef(null);
  const isFetchingRef = useRef(false);
  const timeRangeRef = useRef(timeRange);
  const resumeRef = useRef(resume);

  useEffect(() => {
    timeRangeRef.current = timeRange;
  }, [timeRange]);
  useEffect(() => {
    resumeRef.current = resume;
  }, [resume]);

  const setStage = useCallback((stage, details = {}) => {
    setLoadingStage(stage);
    setLoadingDetails(details);
  }, []);

  // Memoize to avoid recreating on every render (all setters are stable refs)
  const stateSetters = useMemo(
    () => ({ setJobs, setJobInfo, setNearestNeighbors, setNodes, setEdges }),
    [setJobs, setJobInfo, setNearestNeighbors, setNodes, setEdges]
  );

  const fetchJobs = useCallback(
    async (forceRefresh = false) => {
      const currentTimeRange = timeRangeRef.current;
      const currentResume = resumeRef.current;
      const cacheKey = buildCacheKey(currentResume, currentTimeRange);

      if (!embedding || !Array.isArray(embedding) || embedding.length === 0)
        return;
      if (!forceRefresh && lastCacheKeyRef.current === cacheKey) return;
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      setStage(LOADING_STAGES.CHECKING_CACHE, {
        message: 'Checking cached data...',
      });

      // Try cache first
      if (!forceRefresh) {
        const cacheResult = await tryLoadFromCache(cacheKey);
        if (cacheResult.hit) {
          setStage(LOADING_STAGES.CACHE_HIT, {
            message: 'Loading from cache...',
            jobCount: cacheResult.allJobs?.length || 0,
          });
          await applyJobData(cacheResult, cacheKey, stateSetters);
          lastCacheKeyRef.current = cacheKey;
          setStage(LOADING_STAGES.COMPLETE);
          setIsLoading(false);
          isFetchingRef.current = false;

          // Check if params changed while loading
          const newKey = buildCacheKey(resumeRef.current, timeRangeRef.current);
          if (newKey !== cacheKey) setTimeout(() => fetchJobs(true), 0);
          return;
        }
      }

      try {
        const result = await fetchJobsFromAPI({
          embedding,
          timeRange: currentTimeRange,
          onStageChange: setStage,
        });

        await applyJobData(result, cacheKey, stateSetters);
        lastCacheKeyRef.current = cacheKey;
        setStage(LOADING_STAGES.COMPLETE);

        // Check if params changed while fetching
        const newKey = buildCacheKey(resumeRef.current, timeRangeRef.current);
        if (newKey !== cacheKey) {
          isFetchingRef.current = false;
          setTimeout(() => fetchJobs(true), 0);
          return;
        }
      } catch (err) {
        handleFetchError(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;

        const finalKey = buildCacheKey(resumeRef.current, timeRangeRef.current);
        if (finalKey !== lastCacheKeyRef.current) {
          setTimeout(() => fetchJobs(false), 10);
        }
      }
    },
    [embedding, setStage, stateSetters]
  );

  // Refetch when timeRange or resume changes
  useEffect(() => {
    const currentKey = buildCacheKey(resume, timeRange);
    if (currentKey !== lastCacheKeyRef.current) fetchJobs(false);
  }, [resume, timeRange, fetchJobs]);

  // Initial fetch when embedding becomes available
  useEffect(() => {
    if (embedding) fetchJobs(false);
  }, [embedding, graphVersion, fetchJobs]);

  return {
    jobs,
    jobInfo,
    nearestNeighbors,
    isLoading,
    error,
    loadingStage,
    loadingDetails,
    refetch: () => fetchJobs(true),
  };
}
