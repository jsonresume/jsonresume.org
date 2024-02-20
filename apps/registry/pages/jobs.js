import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../src/ui/Layout';
import Link from 'next/link';

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

  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/jobs', {
          username,
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <Layout>
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
    </Layout>
  );
}
