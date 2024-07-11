'use client';

import { useState } from 'react';

export default function CreateResume({ createGist }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="flex flex-col items-center  min-h-screen p-6 pt-20">
      <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-md">
        <p className="text-xl mb-8">
          It looks like you don&apos;t have a gist named{' '}
          <strong>resume.json</strong> yet. No worries! You can easily create
          one right here. Once created, you&apos;ll find it at{' '}
          <a
            href="https://gist.github.com"
            className="text-secondary-500 hover:text-secondary-700"
          >
            gist.github.com
          </a>
          .
        </p>
        {!creating ? (
          <button
            onClick={async () => {
              setCreating(true);
              await createGist();
              // refresh window
              window.location.reload();
            }}
            className="bg-accent-500 text-white text-lg py-3 px-6 rounded-lg shadow-md hover:bg-accent-700 transition duration-300"
          >
            Create resume.json gist
          </button>
        ) : (
          <div className="text-xl text-secondary-700 mt-4">
            Creating your resume.json gist...
          </div>
        )}
      </div>
    </div>
  );
}
