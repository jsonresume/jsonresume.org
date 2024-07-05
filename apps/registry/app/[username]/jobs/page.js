'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../../src/ui/Button';
import Hero from '../../../src/ui/Hero';
import ButtonGroup from '../../../src/ui/ButtonGroup';
import JobList from './JobList';

export default function Jobs({ params }) {
  const username = params.username;
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    if (submitting) {
      const fetchData = async () => {
        try {
          try {
            const response = await axios.post('/api/jobs', {
              username,
            });
            setJobs(response.data);
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
          setSubmitting(false);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

      fetchData();
    }
  }, [username, submitting]);
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

  const handleGenerate = () => {
    setSubmitting(true);
  };

  console.log({ jobs });

  return (
    <>
      {' '}
      <Hero>
        Creates an embedding with 3702 dimensions of your resume.json. The same
        is done for Hacker News posts which have also been processed by GPT 4o.
        Once both embeddings are calculated, we do a vector similarity search.
      </Hero>
      <ButtonGroup>
        <div></div>
        <Button disabled={submitting} onClick={handleGenerate}>
          {submitting ? 'FINDING' : 'FIND JOBS'}
        </Button>
      </ButtonGroup>
      <br />
      <JobList jobs={jobs} makeCoverletter={makeCoverletter} />
    </>
  );
}
