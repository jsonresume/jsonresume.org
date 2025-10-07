import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import axios from 'axios';
import { convertToReactFlowFormat } from '../utils/graphConverter';

/**
 * Hook to fetch and manage job graph data
 * @param {string} username - Username to fetch graph for
 * @returns {Object} { jobs, jobInfo, nodes, edges, isLoading, setNodes, setEdges }
 */
export const useJobGraphData = (username, setNodes, setEdges) => {
  const [jobs, setJobs] = useState(null);
  const [jobInfo, setJobInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/jobs-graph?username=${encodeURIComponent(username)}`
        );
        const { graphData, jobInfoMap, allJobs } = response.data;

        setJobs(allJobs);
        setJobInfo(jobInfoMap);

        const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
          graphData,
          jobInfoMap
        );
        setNodes(rfNodes);
        setEdges(rfEdges);
      } catch (error) {
        logger.error({ error: error.message }, 'Error fetching data:');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username, setNodes, setEdges]);

  return { jobs, jobInfo, isLoading };
};
