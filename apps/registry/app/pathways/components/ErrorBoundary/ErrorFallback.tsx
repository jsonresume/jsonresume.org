'use client';

import { useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
  title?: string;
  description?: string;
  showDetails?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ErrorFallback({
  error,
  resetError,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  showDetails = process.env.NODE_ENV === 'development',
}: ErrorFallbackProps) {
  const handleReset = useCallback(() => {
    resetError?.();
  }, [resetError]);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-red-100">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>

        {/* Error Details (dev only) */}
        {showDetails && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-mono text-gray-700 break-all">
              {error.message}
            </p>
            {error.stack && (
              <pre className="mt-2 text-xs font-mono text-gray-500 overflow-auto max-h-32">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          {resetError && (
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={handleReload}
            className={`
              ${resetError ? 'flex-1' : 'w-full'}
              px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors
            `}
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
