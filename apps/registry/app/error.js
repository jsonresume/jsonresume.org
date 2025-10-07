'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@repo/ui';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error with structured logging
    logger.error(
      {
        error: error.message,
        stack: error.stack,
        digest: error.digest,
      },
      'Application error boundary caught error'
    );
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-gray-900">500</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            Something went wrong
          </h2>
          <p className="mt-2 text-gray-600">
            We're sorry for the inconvenience. Please try again.
          </p>
        </div>

        {isDevelopment && error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              Development Error Details:
            </h3>
            <p className="text-sm text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="secondary" asChild>
            <a href="/">Go Home</a>
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          If this problem persists, please{' '}
          <a
            href="https://github.com/jsonresume/jsonresume.org/issues"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            report it on GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
