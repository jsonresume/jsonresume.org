'use client';

import { useState, useCallback, useMemo } from 'react';
import type { PathwaysError } from '../errors';
import { getErrorMessage } from '../errors';

// ============================================================================
// Types
// ============================================================================

export type LoadingStage =
  | 'idle'
  | 'resume'
  | 'embedding'
  | 'jobs'
  | 'graph'
  | 'ready';

export type LoadingStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface LoadingState {
  status: LoadingStatus;
  stage: LoadingStage;
  error: PathwaysError | Error | null;
  progress: number; // 0-100
  message: string;
}

export interface LoadingMachineActions {
  startLoading: (stage?: LoadingStage) => void;
  setStage: (stage: LoadingStage) => void;
  setReady: () => void;
  setError: (error: PathwaysError | Error) => void;
  reset: () => void;
  retry: () => void;
}

export interface UseLoadingMachineReturn {
  state: LoadingState;
  actions: LoadingMachineActions;
  isLoading: boolean;
  isReady: boolean;
  isError: boolean;
}

// ============================================================================
// Stage Configuration
// ============================================================================

const STAGE_CONFIG: Record<
  LoadingStage,
  { progress: number; message: string }
> = {
  idle: { progress: 0, message: '' },
  resume: { progress: 20, message: 'Loading resume...' },
  embedding: { progress: 40, message: 'Generating embedding...' },
  jobs: { progress: 60, message: 'Finding job matches...' },
  graph: { progress: 80, message: 'Building career graph...' },
  ready: { progress: 100, message: 'Ready' },
};

// ============================================================================
// Hook
// ============================================================================

export function useLoadingMachine(): UseLoadingMachineReturn {
  const [state, setState] = useState<LoadingState>({
    status: 'idle',
    stage: 'idle',
    error: null,
    progress: 0,
    message: '',
  });

  // Track the last stage before error for retry
  const [lastStageBeforeError, setLastStageBeforeError] =
    useState<LoadingStage>('idle');

  // Start loading (optionally from a specific stage)
  const startLoading = useCallback((stage: LoadingStage = 'resume') => {
    const config = STAGE_CONFIG[stage];
    setState({
      status: 'loading',
      stage,
      error: null,
      progress: config.progress,
      message: config.message,
    });
  }, []);

  // Advance to a specific stage
  const setStage = useCallback((stage: LoadingStage) => {
    const config = STAGE_CONFIG[stage];
    setState((prev) => ({
      ...prev,
      status: stage === 'ready' ? 'ready' : 'loading',
      stage,
      progress: config.progress,
      message: config.message,
    }));
    setLastStageBeforeError(stage);
  }, []);

  // Mark as ready
  const setReady = useCallback(() => {
    const config = STAGE_CONFIG.ready;
    setState({
      status: 'ready',
      stage: 'ready',
      error: null,
      progress: config.progress,
      message: config.message,
    });
  }, []);

  // Set error state
  const setError = useCallback((error: PathwaysError | Error) => {
    setState((prev) => ({
      ...prev,
      status: 'error',
      error,
      message: getErrorMessage(error),
    }));
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      stage: 'idle',
      error: null,
      progress: 0,
      message: '',
    });
    setLastStageBeforeError('idle');
  }, []);

  // Retry from last stage before error
  const retry = useCallback(() => {
    startLoading(
      lastStageBeforeError === 'idle' ? 'resume' : lastStageBeforeError
    );
  }, [lastStageBeforeError, startLoading]);

  // Actions object (memoized)
  const actions = useMemo<LoadingMachineActions>(
    () => ({
      startLoading,
      setStage,
      setReady,
      setError,
      reset,
      retry,
    }),
    [startLoading, setStage, setReady, setError, reset, retry]
  );

  // Derived states
  const isLoading = state.status === 'loading';
  const isReady = state.status === 'ready';
  const isError = state.status === 'error';

  return {
    state,
    actions,
    isLoading,
    isReady,
    isError,
  };
}

export default useLoadingMachine;
