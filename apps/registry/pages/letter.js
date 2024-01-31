import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../src/ui/Layout';
import Button from '../src/ui/Button';
import Dropdown from '../src/ui/Dropdown';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

/*
#todo
  - do type as the stream

*/
const Hero = styled.div`
  margin-bottom: 40px;
  color: #555;
  text-align: center;
  font-family: Lato;
  font-size: 22px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto;
`;

const Label = styled.label`
  font-size: 16px;
  color: #555;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
`;

const JobDescription = styled.textarea`
  width: calc(100% - 30px);
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Paper = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px 40px;
  background: #fff;
`;

export default function Letter() {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const username = parts[1];
  const [submitting, setSubmitting] = useState(false);
  const [jobDescription, setJobDescription] = useState(
    typeof window !== 'undefined'
      ? window?.localStorage?.getItem('jobDescription')
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
          // letter = letter.replace(/(?:\r\n|\r|\n)/g, '<br>');

          setLetter(letter);
          setSubmitting(false);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

      fetchData();
    }
  }, [username, submitting]);

  const handleGenerate = () => {
    console.log('clickeed');
    setSubmitting(true);
  };

  return (
    <Layout>
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
    </Layout>
  );
}
