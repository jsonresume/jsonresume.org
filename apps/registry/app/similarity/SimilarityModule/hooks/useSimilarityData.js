import { useState, useEffect } from 'react';
import { processGraphData } from '../utils/dataProcessing';

/**
 * Hook to fetch and process similarity data
 * @returns {Object} { graphData, loading, error }
 */
export function useSimilarityData() {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/similarity');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        const processed = processGraphData(jsonData);
        setGraphData(processed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { graphData, loading, error };
}
