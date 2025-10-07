'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@repo/ui';

export default function JobsError({ error, reset }) {
  useEffect(() => {
    logger.error(
      {
        error: error.message,
        stack: error.stack,
        digest: error.digest,
        context: 'jobs',
      },
      'Jobs page error boundary caught error'
    );
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Job Board Error
          </h2>
          <p className="mt-2 text-gray-600">
            We couldn't load the job listings. This might be a temporary issue.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()}>Reload Jobs</Button>
          <Button variant="secondary" asChild>
            <a href="/">Go Home</a>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-left">
            <p className="text-xs font-mono text-red-700">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
