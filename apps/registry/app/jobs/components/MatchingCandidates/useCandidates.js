'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import axios from 'axios';

export const useCandidates = (jobId) => {
  const [candidates, setcandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await axios.get(`/api/candidates?jobId=${jobId}`);
        setcandidates(data.candidates);
        setError(null);
      } catch (err) {
        logger.error({ error: err.message }, 'Error fetching candidates:');
        setError('Failed to load matching candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId]);

  return { candidates, loading, error };
};
