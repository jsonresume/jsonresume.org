'use client';

import axios from 'axios';

import { useEffect, useState } from 'react';
import Button from '../../../src/ui/Button';
import Dropdown from '../../../src/ui/Dropdown';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Hero from '../../../src/ui/Hero';
import Label from '../../../src/ui/Label';
import ButtonGroup from '../../../src/ui/ButtonGroup';

/*
#todo
  - do type as the stream

*/

const JobDescription = styled.textarea`
  width: calc(100% - 50px);
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Paper = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px 40px;
  background: #fff;
`;

export default function Letter({ params }) {
  // return <div>letterasdas{children}</div>;
  // const router = useRouter();
  const { username } = params;

  // get query param
  //   const { job } = router.query;
  const job = '123';
  console.log({ job });
  const [submitting, setSubmitting] = useState(false);
  const [jobDescription, setJobDescription] = useState(
    typeof window !== 'undefined'
      ? job
        ? window.localStorage.getItem(`job-${job}`)
        : window?.localStorage?.getItem('jobDescription')
      : ''
  );

  const [tone, setTone] = useState('formal');
  const [letter, setLetter] = useState(null);

  const saveJobDescription = (event) => {
    setJobDescription(event.target.value);
    window.localStorage.setItem('jobDescription', event.target.value);
  };

  useEffect(() => {
    if (submitting) {
      const fetchData = async () => {
        try {
          const response = await axios.post('/api/letter', {
            username,
            jobDescription,
            tone,
          });

          let letter = response.data;

          setLetter(letter);
          setSubmitting(false);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

      fetchData();
    }
  }, [username, submitting, jobDescription, tone]);

  const handleGenerate = () => {
    setSubmitting(true);
  };

  return (
    <>
      <Hero>
        Combines the users resume.json with the job description below to
        generate a cover letter in the tonality specified
      </Hero>
      <Label>Job Description (optional)</Label>
      <JobDescription onChange={saveJobDescription} value={jobDescription} />
      <Label>Tonality</Label>
      <ButtonGroup>
        <div>
          <Dropdown
            onChange={(event) => setTone(event.target.value)}
            options={[
              {
                label: 'Formal',
                value: 'formal',
              },
              {
                label: 'Casual',
                value: 'casual',
              },
              {
                label: 'Sarcastic',
                value: 'sarcastic',
              },
              {
                label: 'Funny',
                value: 'funny',
              },
              {
                label: 'Professional',
                value: 'professional',
              },
            ]}
          />
        </div>
        <Button disabled={submitting} onClick={handleGenerate}>
          {submitting ? 'GENERATING' : 'GENERATE'}
        </Button>
      </ButtonGroup>
      <br />
      {letter && (
        <Paper>
          <ReactMarkdown>{letter}</ReactMarkdown>
        </Paper>
      )}
    </>
  );
}
