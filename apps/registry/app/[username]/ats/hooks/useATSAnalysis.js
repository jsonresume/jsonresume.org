import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';

/**
 * Custom hook for ATS JSON structure analysis
 * @param {Object} resume - Resume data
 * @returns {Object} ATS analysis data, loading state, and error
 */
export function useATSAnalysis(resume) {
  const [atsData, setAtsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeResume = async () => {
      if (!resume) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resume }),
        });

        if (!response.ok) {
          throw new Error(`ATS analysis failed: ${response.statusText}`);
        }

        const data = await response.json();
        setAtsData(data);
        logger.debug(
          { score: data.score, rating: data.rating },
          'ATS analysis completed'
        );
      } catch (err) {
        logger.error({ error: err.message }, 'Error analyzing resume for ATS');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeResume();
  }, [resume]);

  return { atsData, loading, error };
}
