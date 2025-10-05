'use client';

import axios from 'axios';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PublicViewBanner } from '../../components/PublicViewBanner';
import Hero from '../../../src/ui/Hero';
import JobList from './JobList';
import Loading from '../../components/Loading';

export default function Jobs({ params }) {
  const username = params.username;
  const router = useRouter();
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/jobs', { username });
        setJobs(response.data);
      } catch (error) {
        logger.error({ error: error.message }, 'Error fetching data: ');
        // Set empty array on error so JobList shows empty state
        setJobs([]);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeCoverletter = async (job) => {
    const gptJob = JSON.parse(job.gpt_content);
    localStorage.setItem(
      `job-${job.id}`,
      `
      ${gptJob.title}
      ${gptJob.company}

      ${gptJob.description}

      Skills:
      ${gptJob.skills?.map((skill) => skill.name).join(', ')}

      Skill Keywords:
      ${gptJob.skills?.map((skill) => skill.keywords?.join(', ')).join(', ')}

      Responsibilities:
      ${gptJob.responsibilities?.join(', ')}
      `
    );
    router.push(`/${username}/letter?job=${job.id}`);
  };
  return (
    <>
      <PublicViewBanner username={username} />
      <div className="p-6">
        <Hero
          title="Find Jobs Based on Your Resume"
          description="Creates an embedding with 3702 dimensions of your resume.json. The
          same is done for Hacker News posts which have also been processed by
          GPT-4. Once both embeddings are calculated, we do a vector similarity
          search."
        />

        {!jobs && <Loading />}
        <JobList jobs={jobs} makeCoverletter={makeCoverletter} />
      </div>
    </>
  );
}
