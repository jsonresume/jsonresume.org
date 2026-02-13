'use client';

import { useEffect } from 'react';

export default function PathwaysError({ error, reset }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Pathways error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center max-w-md px-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          The Pathways career copilot encountered an unexpected error. Please
          try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
