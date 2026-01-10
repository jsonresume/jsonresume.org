import { useState, useMemo, useCallback } from 'react';

/**
 * Hook to manage the swipe queue and undo history
 * Filters jobs to unprocessed ones and provides swipe/undo actions
 */
export function useSwipeQueue({
  jobInfo,
  hiddenJobIds,
  interestedJobIds,
  clearJobState,
  isLoading,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]); // Undo stack: [{jobId, action}]

  // Filter to unprocessed jobs, maintain API order (resume similarity)
  const queue = useMemo(() => {
    if (!jobInfo || Object.keys(jobInfo).length === 0) return [];

    return Object.entries(jobInfo)
      .filter(([id]) => !hiddenJobIds.has(id) && !interestedJobIds.has(id))
      .map(([id, info]) => ({ id, ...info }));
  }, [jobInfo, hiddenJobIds, interestedJobIds]);

  // Current job in the queue
  const currentJob = queue[currentIndex] || null;
  const nextJob = queue[currentIndex + 1] || null;

  // Total and remaining counts
  const totalJobs = Object.keys(jobInfo || {}).length;
  const processedCount = hiddenJobIds.size + interestedJobIds.size;
  const remainingCount = queue.length - currentIndex;

  // Handle swipe action (called after marking job state)
  const handleSwipe = useCallback((jobId, action) => {
    setHistory((prev) => [...prev, { jobId, action }]);
    // Don't advance index since the job is filtered out automatically
  }, []);

  // Undo last swipe
  const undo = useCallback(() => {
    if (history.length === 0) return;

    const last = history[history.length - 1];
    clearJobState(last.jobId);
    setHistory((prev) => prev.slice(0, -1));
  }, [history, clearJobState]);

  // Reset to beginning
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setHistory([]);
  }, []);

  return {
    currentJob,
    nextJob,
    queue,
    handleSwipe,
    undo,
    reset,
    canUndo: history.length > 0,
    isEmpty: queue.length === 0,
    isLoading,
    totalJobs,
    processedCount,
    remainingCount,
  };
}

export default useSwipeQueue;
