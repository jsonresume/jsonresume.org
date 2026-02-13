'use client';

import { useState } from 'react';
import { usePathways } from '../context/PathwaysContext';
import {
  usePathwaysJobData,
  LOADING_STAGES,
} from '../hooks/usePathwaysJobData';
import { useSwipeQueue } from './hooks/useSwipeQueue';
import SwipeCard from './components/SwipeCard';
import SwipeActions from './components/SwipeActions';
import SwipeProgress from './components/SwipeProgress';
import SwipeDetailSheet from './components/SwipeDetailSheet';
import SwipeLoadingState from './components/SwipeLoadingState';
import SwipeEmptyState from './components/SwipeEmptyState';

export default function SwipeInterface() {
  const {
    resume,
    embedding,
    isEmbeddingLoading,
    hiddenJobIds,
    interestedJobIds,
    markAsInterested,
    markAsHidden,
    clearJobState,
    userId,
  } = usePathways();

  const [selectedJob, setSelectedJob] = useState(null);

  const {
    jobInfo,
    isLoading: isJobsLoading,
    loadingStage,
  } = usePathwaysJobData({
    embedding,
    resume,
    graphVersion: 0,
    setNodes: () => {},
    setEdges: () => {},
    timeRange: '1m',
  });

  const {
    currentJob,
    nextJob,
    handleSwipe,
    undo,
    canUndo,
    isEmpty,
    totalJobs,
    processedCount,
  } = useSwipeQueue({
    jobInfo,
    hiddenJobIds,
    interestedJobIds,
    clearJobState,
    isLoading: isJobsLoading,
  });

  const saveFeedback = async (job, sentiment) => {
    if (!userId) return;
    try {
      await fetch('/api/pathways/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          jobId: job.id,
          sentiment,
          jobTitle: job.title,
          jobCompany: job.company,
        }),
      });
    } catch (err) {
      console.error('Failed to save swipe feedback:', err);
    }
  };

  const handleSwipeRight = () => {
    if (!currentJob) return;
    markAsInterested(currentJob.id, currentJob.title);
    handleSwipe(currentJob.id, 'interested');
    saveFeedback(currentJob, 'interested');
  };

  const handleSwipeLeft = () => {
    if (!currentJob) return;
    markAsHidden(currentJob.id, currentJob.title);
    handleSwipe(currentJob.id, 'hidden');
    saveFeedback(currentJob, 'dismissed');
  };

  const handleTap = () => {
    if (currentJob) setSelectedJob(currentJob);
  };

  const isWaitingForEmbedding = resume && !embedding && !isEmbeddingLoading;
  const isLoadingData =
    isEmbeddingLoading || isJobsLoading || isWaitingForEmbedding;

  const getLoadingMessage = () => {
    if (isEmbeddingLoading || isWaitingForEmbedding)
      return 'Analyzing your resume...';
    switch (loadingStage) {
      case LOADING_STAGES.CHECKING_CACHE:
        return 'Checking for cached data...';
      case LOADING_STAGES.CACHE_HIT:
        return 'Loading from cache...';
      case LOADING_STAGES.FETCHING_JOBS:
        return 'Finding matching jobs...';
      case LOADING_STAGES.BUILDING_GRAPH:
        return 'Preparing job cards...';
      default:
        return 'Loading...';
    }
  };

  if (isLoadingData) return <SwipeLoadingState message={getLoadingMessage()} />;
  if (isEmpty) return <SwipeEmptyState totalJobs={totalJobs} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SwipeProgress processed={processedCount} total={totalJobs} />

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full max-w-md h-[500px]">
          {nextJob && (
            <div className="absolute inset-0 scale-95 opacity-50">
              <SwipeCard job={nextJob} isBackground />
            </div>
          )}
          {currentJob && (
            <SwipeCard
              job={currentJob}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
              onTap={handleTap}
            />
          )}
        </div>
      </div>

      <SwipeActions
        onPass={handleSwipeLeft}
        onLike={handleSwipeRight}
        onUndo={undo}
        canUndo={canUndo}
        disabled={!currentJob}
      />

      <SwipeDetailSheet
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onInterested={() => {
          handleSwipeRight();
          setSelectedJob(null);
        }}
        onPass={() => {
          handleSwipeLeft();
          setSelectedJob(null);
        }}
      />
    </div>
  );
}
