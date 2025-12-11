import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { convertToReactFlowFormat } from '@/app/[username]/jobs-graph/utils/graphConverter';

/**
 * Hook to fetch and manage job data for Pathways graph
 * Uses the embedding from PathwaysContext to find matching jobs
 */
export function usePathwaysJobData({
  embedding,
  graphVersion,
  setNodes,
  setEdges,
}) {
  const [jobs, setJobs] = useState(null);
  const [jobInfo, setJobInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pathways/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embedding, resumeId: 'resume' }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const { graphData, jobInfoMap, allJobs } = await response.json();

      setJobs(allJobs);
      setJobInfo(jobInfoMap);

      const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
        graphData,
        jobInfoMap
      );
      setNodes(rfNodes);
      setEdges(rfEdges);
    } catch (err) {
      logger.error({ error: err.message }, 'Error fetching pathways jobs');
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [embedding, setNodes, setEdges]);

  // Fetch jobs when embedding changes or graph version updates
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, graphVersion]);

  return { jobs, jobInfo, isLoading, error, refetch: fetchJobs };
}
