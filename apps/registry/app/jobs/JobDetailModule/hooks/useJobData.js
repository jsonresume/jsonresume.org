import { useEffect, useState } from 'react';
import axios from 'axios';

export const useJobData = (uuid) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/jobs/${uuid}`);
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchJob();
    }
  }, [uuid]);

  return { job, loading };
};
