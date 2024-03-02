import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../src/ui/Layout';
import Link from 'next/link';
import Hero from '../src/ui/Hero';
import ButtonGroup from '../src/ui/ButtonGroup';
import Button from '../src/ui/Button';

const MessagesContainer = styled.div`
  background: #fbfbfb;
  width: 100%;
  height: calc(100vh - 170px);
`;

const Messages = styled.div`
  background: yellow;
  background: #fbfbfb;
  padding-bottom: 200px;
`;
const Message = styled.div`
  background: blue;
  background: #fbfbfb;
  padding: 0 20px;
  margin-bottom: 10px;
`;

/*
 - only show last 3 months of jobs
 - show similarity score
*/

export default function Jobs() {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const username = parts[1];

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

  const handleGenerate = () => {
    setSubmitting(true);
  };

  return (
    <Layout>
      {' '}
      <Hero>
        Creates an embedding with 3702 dimensions of your resume.json. The same
        is done for Hacker News posts which have also been processed by GPT 3.5.
        Once both embeddings are calculated, we do a vector similarity search.
      </Hero>
      <ButtonGroup>
        <div></div>
        <Button disabled={submitting} onClick={handleGenerate}>
          {submitting ? 'GENERATING' : 'GENERATE'}
        </Button>
      </ButtonGroup>
      <br />
      {jobs && (
        <MessagesContainer>
          <Messages>
            {jobs &&
              jobs.map((job) => {
                const fullJob = JSON.parse(job.gpt_content);
                console.log({ fullJob });
                return (
                  <Message key={job.uuid}>
                    <br />
                    <h3>{fullJob.title}</h3>
                    <h4>{fullJob.company}</h4>
                    <strong>Remote: &nbsp;</strong>
                    {fullJob.remote}
                    <br />
                    <strong>Type: &nbsp;</strong>
                    {fullJob.type}
                    <br />
                    <strong>Salary: &nbsp;</strong>
                    {fullJob.salary}
                    <br />
                    <br />
                    {fullJob.description}
                    <br />
                    <br />
                    <ul>
                      {fullJob.skills?.map((skill) => {
                        return (
                          <li key={skill.name}>
                            <strong>{skill.name}</strong>

                            <ul>
                              {skill.keywords?.map((keyword) => {
                                return <li key={keyword}>{keyword}</li>;
                              })}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                    {fullJob.application}
                    <br />
                    <br />
                    <Link href={job.url}>Source</Link>
                    <br />
                    <br />
                    <hr />
                  </Message>
                );
              })}
          </Messages>
        </MessagesContainer>
      )}
    </Layout>
  );
}
