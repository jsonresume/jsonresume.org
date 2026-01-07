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
      if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
        return;
      }

      setIsLoading(true);
      setError(null);
      setLoadingStage(LOADING_STAGES.CHECKING_CACHE);
      setLoadingDetails({ message: 'Checking cached data...' });

      const resumeHash = hashResume(resume);

      // Check cache unless force refresh requested
      if (!forceRefresh) {
        const cached = await getCachedGraphData(resumeHash);
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

          const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
            cached.graphData,
            cached.jobInfoMap
          );
          setNodes(rfNodes);
          setEdges(rfEdges);

          lastResumeHashRef.current = resumeHash;
          setLoadingStage(LOADING_STAGES.COMPLETE);
          setIsLoading(false);
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
          body: JSON.stringify({ embedding, resumeId: 'resume' }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const { graphData, jobInfoMap, allJobs } = await response.json();

        setLoadingStage(LOADING_STAGES.BUILDING_GRAPH);
        setLoadingDetails({
          message: 'Building career graph...',
          jobCount: allJobs?.length || 0,
          nodeCount: graphData?.nodes?.length || 0,
          edgeCount: graphData?.links?.length || 0,
        });

        // Cache the data
        await setCachedGraphData(resumeHash, {
          graphData,
          jobInfoMap,
          allJobs,
        });
        lastResumeHashRef.current = resumeHash;

        setJobs(allJobs);
        setJobInfo(jobInfoMap);

        const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
          graphData,
          jobInfoMap
        );
        setNodes(rfNodes);
        setEdges(rfEdges);

        setLoadingStage(LOADING_STAGES.COMPLETE);
      } catch (err) {
        logger.error({ error: err.message }, 'Error fetching pathways jobs');
        setError(err.message);
        pathwaysToast.jobsFetchError();
      } finally {
        setIsLoading(false);
      }
    },
    [embedding, resume, setNodes, setEdges]
  );

  // Detect resume changes and invalidate cache
  useEffect(() => {
    const currentHash = hashResume(resume);
    if (
      lastResumeHashRef.current &&
      currentHash !== lastResumeHashRef.current
    ) {
      // Resume changed - force refresh
      fetchJobs(true);
    }
  }, [resume, fetchJobs]);

  // Initial fetch when embedding becomes available or graphVersion changes
  useEffect(() => {
    fetchJobs();
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
