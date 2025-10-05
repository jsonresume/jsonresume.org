'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function EditorError({ error, reset }) {
  useEffect(() => {
    logger.error(
      {
        error: error.message,
        stack: error.stack,
        digest: error.digest,
        context: 'editor',
      },
      'Editor error boundary caught error'
    );
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Editor Error</h2>
          <p className="mt-2 text-gray-600">
            The resume editor encountered an unexpected error. Your work may not
            have been saved.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> If you recently made changes, try
            refreshing the page. Your browser may have cached your edits.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Editor
          </button>
          <a
            href="/dashboard"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              Show error details (dev only)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
