'use client';

import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

export default function ResumeEditor({ resume: initialResume, updateGist }) {
  const [resume, setResume] = useState(initialResume);

  useEffect(() => {
    console.log({ initialResume });
    setResume(initialResume);
  }, [initialResume]);

  console.log({ resume, initialResume });

  return (
    <div>
      <button
        onClick={async () => {
          await updateGist();
        }}
      >
        update gist
      </button>
      <Editor
        height="90vh"
        defaultLanguage="json"
        defaultValue={initialResume}
        onChange={(code) => setResume(code)}
      />
    </div>
  );
}
