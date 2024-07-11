'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Hero from '../../../src/ui/Hero';
import ReactMarkdown from 'react-markdown';

export default function Suggestions({ params }) {
  const { username } = params;

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
          setSubmitting(false);
        }
      };

      fetchData();
    }
  }, [username, submitting, focus]);

  const handleGenerate = () => {
    setSubmitting(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Hero
        title="Improve Your Resume"
        description="Generates suggestions to improve your resume based on the selected focus."
      />
      <label className="block text-xl font-semibold mb-2">Focus</label>
      <div className="flex items-center mb-4">
        <select
          className="mr-4 border border-gray-300 rounded-md p-2"
          onChange={(e) => setFocus(e.target.value)}
          value={focus}
        >
          <option value="general">General</option>
          <option value="spelling">Spelling</option>
          <option value="grammar">Grammar</option>
        </select>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={submitting}
          onClick={handleGenerate}
        >
          {submitting ? 'GENERATING' : 'GENERATE'}
        </button>
      </div>
      <br />
      {!submitting && suggestions && (
        <div className="border border-gray-300 rounded-md p-6 bg-white shadow-md">
          <ReactMarkdown>{suggestions}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
