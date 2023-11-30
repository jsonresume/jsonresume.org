import axios from 'axios';
import { useRouter } from 'next/router';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Layout from '../src/ui/Layout';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const MessagesContainer = styled.div`
  background: #fbfbfb;
  max-width: 600px;
  padding: 90px 30px;
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

const Name = styled.span`
  font-weight: 600;
  flex: 0 0 100px;
  display: inline-block;
  text-align: right;
  margin-right: 5px;
`;

export default function Talk() {
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
              let content = job.content.replace('<code>', '');
              content = job.content.replace('</code>', '');
              content = job.content.replace('<pre>', '');
              content = job.content.replace('</pre>', '');
              return (
                <Message key={job.uuid}>
                  <Name>{capitalizeFirstLetter(job.type)}</Name>
                  <ReactMarkdown>
                    {NodeHtmlMarkdown.translate(content).replace('```', '')}
                  </ReactMarkdown>
                </Message>
              );
            })}
        </Messages>
      </MessagesContainer>
    </Layout>
  );
}
