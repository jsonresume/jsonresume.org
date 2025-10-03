import { useState, useEffect, useCallback } from 'react';
import { useGraphData } from './useGraphData';
import { allAlgorithms } from '../utils/allAlgorithms';

/**
 * Hook to fetch and manage similarity graph data
 * @param {string} dataSource - 'jobs' or 'resumes'
 * @param {string} algorithm - Algorithm key from allAlgorithms
 * @returns {Object} { graphData, rawNodes, edges, loading, error }
 */
export const useSimilarityGraph = (dataSource, algorithm) => {
  const [graphData, setGraphData] = useState(null);
  const [rawNodes, setRawNodes] = useState(null);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { processData } = useGraphData(dataSource);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if we're in development environment
      const isLocal = process.env.NODE_ENV === 'development';
      const limit = isLocal ? 300 : 1500;

      const response = await fetch(
        `/api/${dataSource === 'jobs' ? 'job-' : ''}similarity?limit=${limit}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const processedData = processData(data);
      setRawNodes(processedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dataSource, processData]);

  const processLinks = useCallback(() => {
    if (!rawNodes) return;

    const { compute } = allAlgorithms[algorithm];
    const links = compute(rawNodes);

    setGraphData({ nodes: rawNodes, links });
    setEdges(links);
  }, [rawNodes, algorithm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    processLinks();
  }, [processLinks]);

  return { graphData, rawNodes, edges, loading, error };
};
