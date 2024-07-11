'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Hero from '../../../src/ui/Hero';

export default function Letter({ params }) {
  const searchParams = useSearchParams();
  const { username } = params;
  const job = searchParams.get('job');
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
          setSubmitting(false);
        }
      };

      fetchData();
    }
  }, [username, submitting, jobDescription, tone]);

  const handleGenerate = () => {
    setSubmitting(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Hero
        title="Generate Your Cover Letter"
        description="Combines your resume.json with the job description below to generate a cover letter in the specified tonality."
      />
      <label className="block text-xl font-semibold mb-2">
        Job Description (optional)
      </label>
      <textarea
        className="w-full h-32 border border-gray-300 rounded-md p-4 mb-4 text-sm"
        onChange={saveJobDescription}
        value={jobDescription}
      />
      <label className="block text-xl font-semibold mb-2">Tonality</label>
      <div className="flex items-center mb-4">
        <select
          className="mr-4 border border-gray-300 rounded-md p-2"
          onChange={(event) => setTone(event.target.value)}
          value={tone}
        >
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="sarcastic">Sarcastic</option>
          <option value="funny">Funny</option>
          <option value="professional">Professional</option>
        </select>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={submitting}
          onClick={handleGenerate}
        >
          {submitting ? 'GENERATING' : 'GENERATE'}
        </button>
      </div>
      {letter && (
        <div className="border border-gray-300 rounded-md p-6 bg-white shadow-md">
          <ReactMarkdown>{letter}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
