import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../src/ui/Layout';
import Hero from '../src/ui/Hero';
import Label from '../src/ui/Label';
import ButtonGroup from '../src/ui/ButtonGroup';
import Dropdown from '../src/ui/Dropdown';
import Button from '../src/ui/Button';

export default function Talk() {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const username = parts[1];

  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/suggestions', {
          username,
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [username]);

  const submitting = false;
  const handleGenerate = () => {};

  return (
    <Layout>
      <Hero>Generates suggestions to improve your resume</Hero>
      <Label>Tonality</Label>
      <ButtonGroup>
        <div>
          <Dropdown
            onChange={() => {}}
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
      {!suggestions && <div>Loading...</div>}
      {suggestions && (
        <pre
          style={{
            'white-space': 'pre-wrap',
            width: '60%',
            margin: 'auto',
            'margin-top': '100px',
          }}
        >
          {suggestions}
        </pre>
      )}
    </Layout>
  );
}
