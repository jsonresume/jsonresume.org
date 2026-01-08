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
  timeRange = '1m',
}) {
  const [jobs, setJobs] = useState(null);
  const [jobInfo, setJobInfo] = useState({});
  const [nearestNeighbors, setNearestNeighbors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState({});

  // Track the last cache key to detect changes
  const lastCacheKeyRef = useRef(null);
  // Prevent concurrent fetches
  const isFetchingRef = useRef(false);
  // Track current timeRange via ref to avoid stale closures
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
    async (forceRefresh = false) => {
      const currentTimeRange = timeRangeRef.current;
      const currentResume = resumeRef.current;
      const resumeHash = hashResume(currentResume);
      const cacheKey = `${resumeHash}_${currentTimeRange}`;

      if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
        return;
      }

      // Skip if we already have this exact data (and not forcing)
      if (!forceRefresh && lastCacheKeyRef.current === cacheKey) {
        return;
      }

      // Prevent concurrent fetches
      if (isFetchingRef.current) {
        return;
      }
      isFetchingRef.current = true;

      setIsLoading(true);
      setError(null);
      setLoadingStage(LOADING_STAGES.CHECKING_CACHE);
      setLoadingDetails({ message: 'Checking cached data...' });

      // Check cache unless force refresh requested
      if (!forceRefresh) {
        const cached = await getCachedGraphData(cacheKey);
        if (cached) {
          setLoadingStage(LOADING_STAGES.CACHE_HIT);
          setLoadingDetails({
            message: 'Loading from cache...',
            jobCount: cached.allJobs?.length || 0,
          });

          // Small delay so user sees the cache hit message
          await new Promise((resolve) => setTimeout(resolve, 300));

          setJobs(cached.allJobs);
          setJobInfo(cached.jobInfoMap);
          setNearestNeighbors(cached.nearestNeighbors || {});

          const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
            cached.graphData,
            cached.jobInfoMap
          );
          setNodes(rfNodes);
          setEdges(rfEdges);

          lastCacheKeyRef.current = cacheKey;
          setLoadingStage(LOADING_STAGES.COMPLETE);
          setIsLoading(false);
          isFetchingRef.current = false;

          // Check if timeRange changed while we were loading from cache
          const newKey = `${hashResume(resumeRef.current)}_${
            timeRangeRef.current
          }`;
          if (newKey !== cacheKey) {
            setTimeout(() => fetchJobs(true), 0);
          }
          return;
        }
      }

      try {
        setLoadingStage(LOADING_STAGES.FETCHING_JOBS);
        setLoadingDetails({
          message: 'Finding matching jobs...',
          embeddingSize: embedding.length,
        });

        const response = await fetch('/api/pathways/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embedding,
            resumeId: 'resume',
            timeRange: currentTimeRange,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const {
          graphData,
          jobInfoMap,
          allJobs,
          nearestNeighbors: nn,
        } = await response.json();

        setLoadingStage(LOADING_STAGES.BUILDING_GRAPH);
        setLoadingDetails({
          message: 'Building career graph...',
          jobCount: allJobs?.length || 0,
          nodeCount: graphData?.nodes?.length || 0,
          edgeCount: graphData?.links?.length || 0,
        });

        // Cache the data
        await setCachedGraphData(cacheKey, {
          graphData,
          jobInfoMap,
          allJobs,
          nearestNeighbors: nn,
        });
        lastCacheKeyRef.current = cacheKey;

        setJobs(allJobs);
        setJobInfo(jobInfoMap);
        setNearestNeighbors(nn || {});

        const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
          graphData,
          jobInfoMap
        );
        setNodes(rfNodes);
        setEdges(rfEdges);

        setLoadingStage(LOADING_STAGES.COMPLETE);

        // Check if timeRange changed while we were fetching
        const newKey = `${hashResume(resumeRef.current)}_${
          timeRangeRef.current
        }`;
        if (newKey !== cacheKey) {
          isFetchingRef.current = false;
          setTimeout(() => fetchJobs(true), 0);
          return;
        }
      } catch (err) {
        logger.error({ error: err.message }, 'Error fetching pathways jobs');
        setError(err.message);
        pathwaysToast.jobsFetchError();
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;

        // Always check if we need to refetch after completion
        const finalKey = `${hashResume(resumeRef.current)}_${
          timeRangeRef.current
        }`;

        // If the wanted key doesn't match what we have, schedule a refetch
        if (finalKey !== lastCacheKeyRef.current) {
          setTimeout(() => fetchJobs(false), 10);
        }
      }
    },
    [embedding, setNodes, setEdges]
  );

  // Fetch when timeRange or resume changes
  useEffect(() => {
    const currentKey = `${hashResume(resume)}_${timeRange}`;

    // Only trigger fetch if we have a different key than last successful fetch
    if (currentKey !== lastCacheKeyRef.current) {
      fetchJobs(false);
    }
  }, [resume, timeRange, fetchJobs]);

  // Initial fetch when embedding becomes available or graphVersion changes
  useEffect(() => {
    if (embedding) {
      fetchJobs(false);
    }
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
