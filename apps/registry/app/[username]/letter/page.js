'use client';

import { useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from '../../../src/ui/Hero';
import { useLetterGeneration } from './components/useLetterGeneration';
import { LetterForm } from './components/LetterForm';
import { LetterPreview } from './components/LetterPreview';

export default function Letter({ params }) {
  const searchParams = useSearchParams();
  const { username } = use(params);
  const job = searchParams.get('job');
  const [jobDescription, setJobDescription] = useState(
    typeof window !== 'undefined'
      ? job
        ? window.localStorage.getItem(`job-${job}`)
        : window?.localStorage?.getItem('jobDescription')
      : ''
  );
  const [tone, setTone] = useState('formal');

  const saveJobDescription = (event) => {
    setJobDescription(event.target.value);
    window.localStorage.setItem('jobDescription', event.target.value);
  };

  const { submitting, letter, handleGenerate } = useLetterGeneration(
    username,
    jobDescription,
    tone
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Hero
        title="Generate Your Cover Letter"
        description="Combines your resume.json with the job description below to generate a cover letter in the specified tonality."
      />
      <LetterForm
        jobDescription={jobDescription}
        saveJobDescription={saveJobDescription}
        tone={tone}
        setTone={setTone}
        submitting={submitting}
        handleGenerate={handleGenerate}
      />
      <LetterPreview submitting={submitting} letter={letter} />
    </div>
  );
}
