import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import axios from 'axios';

export const useLetterGeneration = (username, jobDescription, tone) => {
  const [submitting, setSubmitting] = useState(false);
  const [letter, setLetter] = useState(null);

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
          logger.error({ error: error.message }, 'Error fetching data: ');
          setSubmitting(false);
        }
      };

      fetchData();
    }
  }, [username, submitting, jobDescription, tone]);

  const handleGenerate = () => {
    setSubmitting(true);
  };

  return { submitting, letter, handleGenerate };
};
