import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../src/ui/Layout';
import Hero from '../src/ui/Hero';
import Label from '../src/ui/Label';
import ButtonGroup from '../src/ui/ButtonGroup';
import Dropdown from '../src/ui/Dropdown';
import Button from '../src/ui/Button';
import ReactMarkdown from 'react-markdown';

const Paper = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px 40px;
  background: #fff;
`;

export default function Suggestions() {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const username = parts[1];

  const [submitting, setSubmitting] = useState(false);
  const [focus, setFocus] = useState('general');
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    if (submitting) {
      const fetchData = async () => {
        try {
          const response = await axios.post('/api/suggestions', {
            username,
            focus,
          });
          setSuggestions(response.data);
          setSubmitting(false);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

      fetchData();
    }
  }, [username, submitting, focus]);

  const handleGenerate = () => {
    setSubmitting(true);
  };

  return (
    <Layout>
      <Hero>Generates suggestions to improve your resume</Hero>
      <Label>Focus</Label>
      <ButtonGroup>
        <div>
          <Dropdown
            onChange={(e) => {
              setFocus(e.target.value);
            }}
            options={[
              {
                label: 'General',
                value: 'general',
              },
              {
                label: 'Spelling',
                value: 'spelling',
              },
              {
                label: 'Grammar',
                value: 'grammar',
              },
            ]}
          />
        </div>
        <Button disabled={submitting} onClick={handleGenerate}>
          {submitting ? 'GENERATING' : 'GENERATE'}
        </Button>
      </ButtonGroup>
      <br />
      {!submitting && suggestions && (
        <Paper>
          <ReactMarkdown>{suggestions}</ReactMarkdown>
        </Paper>
      )}
    </Layout>
  );
}
