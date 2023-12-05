import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../src/ui/Layout';

export default function Letter() {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const username = parts[1];

  const [letter, setLetter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/letter', {
          username,
        });
        setLetter(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <Layout>
      {!letter && <div>Loading...</div>}
      {letter && (
        <pre
          style={{
            'white-space': 'pre-wrap',
            width: '60%',
            margin: 'auto',
            'margin-top': '100px',
          }}
        >
          {letter}
        </pre>
      )}
    </Layout>
  );
}
