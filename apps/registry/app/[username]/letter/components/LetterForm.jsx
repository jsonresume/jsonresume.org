'use client';

import { Button } from '@repo/ui';

export const LetterForm = ({
  jobDescription,
  saveJobDescription,
  tone,
  setTone,
  submitting,
  handleGenerate,
}) => {
  return (
    <>
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
        <Button disabled={submitting} onClick={handleGenerate}>
          {submitting ? 'GENERATING' : 'GENERATE'}
        </Button>
      </div>
    </>
  );
};
