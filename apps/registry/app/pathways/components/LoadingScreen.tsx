'use client';

import { useEffect, useState } from 'react';
import type { LoadingState } from '../hooks/useLoadingMachine';

// ============================================================================
// Types
// ============================================================================

interface LoadingScreenProps {
  state: LoadingState;
  onRetry?: () => void;
}

// ============================================================================
// Stage Icons
// ============================================================================

const StageIcon = ({ stage, current }: { stage: string; current: string }) => {
  const stages = ['resume', 'embedding', 'jobs', 'graph', 'ready'];
  const stageIndex = stages.indexOf(stage);
  const currentIndex = stages.indexOf(current);

  const isComplete = stageIndex < currentIndex;
  const isCurrent = stageIndex === currentIndex;
  const isPending = stageIndex > currentIndex;

  return (
    <div
      className={`
        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
        transition-all duration-300
        ${isComplete ? 'bg-green-500 text-white' : ''}
        ${isCurrent ? 'bg-indigo-500 text-white animate-pulse' : ''}
        ${isPending ? 'bg-gray-200 text-gray-400' : ''}
      `}
    >
      {isComplete ? '✓' : stageIndex + 1}
    </div>
  );
};

// ============================================================================
// Progress Bar
// ============================================================================

const ProgressBar = ({ progress }: { progress: number }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${animatedProgress}%` }}
      />
    </div>
  );
};

// ============================================================================
// Loading Screen
// ============================================================================

export function LoadingScreen({ state, onRetry }: LoadingScreenProps) {
  const { status, stage, error, progress, message } = state;

  if (status === 'ready') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Pathways</h2>
          <p className="mt-1 text-sm text-gray-500">Career Exploration</p>
        </div>

        {/* Error State */}
        {status === 'error' && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-red-500">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Something went wrong
                </h3>
                <p className="mt-1 text-sm text-red-700">{message}</p>
              </div>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {status === 'loading' && (
          <>
            {/* Stage Indicators */}
            <div className="flex items-center justify-between">
              <StageIcon stage="resume" current={stage} />
              <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{
                    width: ['embedding', 'jobs', 'graph', 'ready'].includes(
                      stage
                    )
                      ? '100%'
                      : '0%',
                  }}
                />
              </div>
              <StageIcon stage="embedding" current={stage} />
              <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{
                    width: ['jobs', 'graph', 'ready'].includes(stage)
                      ? '100%'
                      : '0%',
                  }}
                />
              </div>
              <StageIcon stage="jobs" current={stage} />
              <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{
                    width: ['graph', 'ready'].includes(stage) ? '100%' : '0%',
                  }}
                />
              </div>
              <StageIcon stage="graph" current={stage} />
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <ProgressBar progress={progress} />
              <p className="text-center text-sm text-gray-600">{message}</p>
            </div>

            {/* Stage Labels */}
            <div className="grid grid-cols-4 text-center text-xs text-gray-500">
              <span>Resume</span>
              <span>Embedding</span>
              <span>Jobs</span>
              <span>Graph</span>
            </div>
          </>
        )}

        {/* Idle State */}
        {status === 'idle' && (
          <div className="text-center text-gray-500">
            <p>Initializing...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadingScreen;
