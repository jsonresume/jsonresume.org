import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';

/**
 * Custom hook for PDF parseability analysis
 * @param {Object} resume - Resume data
 * @param {Object} atsData - ATS analysis data (triggers PDF analysis when available)
 * @param {string} username - Username for PDF generation
 * @returns {Object} PDF analysis data, loading state, and error
 */
export function usePDFAnalysis(resume, atsData, username) {
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzePDF = async () => {
      if (!resume || !atsData) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ats/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resume,
            username,
            theme: 'professional',
          }),
        });

        if (!response.ok) {
          throw new Error(`PDF analysis failed: ${response.statusText}`);
        }

        const data = await response.json();
        setPdfData(data);
        logger.debug(
          { score: data.score, rating: data.rating },
          'PDF parseability analysis completed'
        );
      } catch (err) {
        logger.error(
          { error: err.message },
          'Error analyzing PDF parseability'
        );
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzePDF();
  }, [resume, atsData, username]);

  return { pdfData, loading, error };
}
