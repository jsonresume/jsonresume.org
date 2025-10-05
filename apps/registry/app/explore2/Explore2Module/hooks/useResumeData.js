import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import axios from 'axios';

export function useResumeData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/resumes?limit=500');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        logger.error({ error: error.message }, 'Error fetching data: ');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}
