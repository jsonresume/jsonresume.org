import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoadingMachine } from '../../hooks/useLoadingMachine';

describe('useLoadingMachine', () => {
  describe('initial state', () => {
    it('should start in idle state', () => {
      const { result } = renderHook(() => useLoadingMachine());

      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.stage).toBe('idle');
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.progress).toBe(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isReady).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('startLoading', () => {
    it('should transition to loading state', () => {
      const { result } = renderHook(() => useLoadingMachine());

      act(() => {
        result.current.actions.startLoading();
      });

      expect(result.current.state.status).toBe('loading');
      expect(result.current.state.stage).toBe('resume');
      expect(result.current.state.progress).toBe(20);
      expect(result.current.isLoading).toBe(true);
    });

    it('should start from specific stage', () => {
      const { result } = renderHook(() => useLoadingMachine());

      act(() => {
        result.current.actions.startLoading('embedding');
      });

      expect(result.current.state.stage).toBe('embedding');
      expect(result.current.state.progress).toBe(40);
    });
  });

  describe('setStage', () => {
    it('should advance to embedding stage', () => {
      const { result } = renderHook(() => useLoadingMachine());

      act(() => {
        result.current.actions.startLoading();
        result.current.actions.setStage('embedding');
      });

      expect(result.current.state.stage).toBe('embedding');
      expect(result.current.state.progress).toBe(40);
      expect(result.current.state.message).toBe('Generating embedding...');
    });

    it('should advance to jobs stage', () => {
      const { result } = renderHook(() => useLoadingMachine());

      act(() => {
        result.current.actions.startLoading();
        result.current.actions.setStage('jobs');
      });

      expect(result.current.state.stage).toBe('jobs');
      expect(result.current.state.progress).toBe(60);
      expect(result.current.state.message).toBe('Finding job matches...');
    });

    it('should advance to graph stage', () => {
      const { result } = renderHook(() => useLoadingMachine());

      act(() => {
        result.current.actions.startLoading();
        result.current.actions.setStage('graph');
      });

      expect(result.current.state.stage).toBe('graph');
      expect(result.current.state.progress).toBe(80);
      expect(result.current.state.message).toBe('Building career graph...');
    });
  });

  describe('setReady', () => {
    it('should transition to ready state', () => {
      const { result } = renderHook(() => useLoadingMachine());

      act(() => {
        result.current.actions.startLoading();
        result.current.actions.setReady();
      });

      expect(result.current.state.status).toBe('ready');
      expect(result.current.state.stage).toBe('ready');
      expect(result.current.state.progress).toBe(100);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isReady).toBe(true);
    });
  });

  describe('setError', () => {
    it('should transition to error state', () => {
      const { result } = renderHook(() => useLoadingMachine());
      const testError = new Error('Test error message');

      act(() => {
        result.current.actions.startLoading();
        result.current.actions.setError(testError);
      });

      expect(result.current.state.status).toBe('error');
      expect(result.current.state.error).toBe(testError);
      expect(result.current.state.message).toBe('Test error message');
      expect(result.current.isError).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset to idle state', () => {
      const { result } = renderHook(() => useLoadingMachine());

      act(() => {
        result.current.actions.startLoading();
        result.current.actions.setStage('jobs');
        result.current.actions.reset();
      });

      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.stage).toBe('idle');
      expect(result.current.state.progress).toBe(0);
    });
  });

  describe('retry', () => {
    it('should restart from last stage before error', () => {
      const { result } = renderHook(() => useLoadingMachine());
      const testError = new Error('Network error');

      act(() => {
        result.current.actions.startLoading();
        result.current.actions.setStage('jobs');
        result.current.actions.setError(testError);
      });

      expect(result.current.state.status).toBe('error');

      act(() => {
        result.current.actions.retry();
      });

      expect(result.current.state.status).toBe('loading');
      expect(result.current.state.stage).toBe('jobs');
      expect(result.current.state.error).toBeNull();
    });

    it('should start from resume if never loaded', () => {
      const { result } = renderHook(() => useLoadingMachine());

      act(() => {
        result.current.actions.retry();
      });

      expect(result.current.state.stage).toBe('resume');
    });
  });

  describe('full loading sequence', () => {
    it('should complete full loading sequence', () => {
      const { result } = renderHook(() => useLoadingMachine());

      // Start
      act(() => result.current.actions.startLoading());
      expect(result.current.state.stage).toBe('resume');

      // Progress through stages
      act(() => result.current.actions.setStage('embedding'));
      expect(result.current.state.progress).toBe(40);

      act(() => result.current.actions.setStage('jobs'));
      expect(result.current.state.progress).toBe(60);

      act(() => result.current.actions.setStage('graph'));
      expect(result.current.state.progress).toBe(80);

      // Complete
      act(() => result.current.actions.setReady());
      expect(result.current.state.progress).toBe(100);
      expect(result.current.isReady).toBe(true);
    });
  });
});
