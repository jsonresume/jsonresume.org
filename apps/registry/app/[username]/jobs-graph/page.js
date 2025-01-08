'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Hero from '../../../src/ui/Hero';
import Loading from '../../components/Loading';

export default function Jobs({ params }) {
  const username = params.username;
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/jobs', { username });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <Hero
        title="Jobs graph"
        description="This page shows the most related jobs to you in a directed force graph. Jobs with the most relevance appear linked to your resume. Less relevant jobs are connected to other jobs instead of directly to your resume."
      />

      {!jobs && <Loading />}
      <div className="mt-4 text-lg">
        {jobs ? (
          <p>Found {jobs.length} related jobs</p>
        ) : (
          <p>Loading jobs...</p>
        )}
      </div>
    </div>
  );
}
