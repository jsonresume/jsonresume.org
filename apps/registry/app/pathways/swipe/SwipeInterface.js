'use client';

import { useState } from 'react';
import { usePathways } from '../context/PathwaysContext';
import {
  usePathwaysJobData,
  LOADING_STAGES,
} from '../hooks/usePathwaysJobData';
import { useSwipeQueue } from './hooks/useSwipeQueue';
import SwipeHeader from './components/SwipeHeader';
import SwipeCard from './components/SwipeCard';
import SwipeActions from './components/SwipeActions';
import SwipeProgress from './components/SwipeProgress';
import SwipeDetailSheet from './components/SwipeDetailSheet';

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
  } = usePathways();

  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs - we don't need graph nodes/edges for swipe mode
  const {
    jobInfo,
    isLoading: isJobsLoading,
    loadingStage,
  } = usePathwaysJobData({
    embedding,
    resume,
    graphVersion: 0, // Static version for swipe
    setNodes: () => {},
    setEdges: () => {},
    timeRange: '1m',
  });

  // Manage swipe queue
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

  // Handle swipe right (interested)
  const handleSwipeRight = () => {
    if (!currentJob) return;
    markAsInterested(currentJob.id, currentJob.title);
    handleSwipe(currentJob.id, 'interested');
  };

  // Handle swipe left (hidden)
  const handleSwipeLeft = () => {
    if (!currentJob) return;
    markAsHidden(currentJob.id, currentJob.title);
    handleSwipe(currentJob.id, 'hidden');
  };

  // Handle tap to show details
  const handleTap = () => {
    if (currentJob) {
      setSelectedJob(currentJob);
    }
  };

  // Show loading screen while embedding or fetching jobs
  // Also show loading if we have a resume but no embedding yet (waiting for it to generate)
  const isWaitingForEmbedding = resume && !embedding && !isEmbeddingLoading;
  const isLoadingData =
    isEmbeddingLoading || isJobsLoading || isWaitingForEmbedding;

  // Get user-friendly loading message
  const getLoadingMessage = () => {
    if (isEmbeddingLoading || isWaitingForEmbedding) {
      return 'Analyzing your resume...';
    }
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

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SwipeHeader />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-6">
          <div className="w-16 h-16 mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 text-lg">{getLoadingMessage()}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SwipeHeader />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-6 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            All caught up!
          </h2>
          <p className="text-gray-600 mb-6">
            You&apos;ve reviewed all {totalJobs} jobs. Check back later for new
            opportunities.
          </p>
          <a
            href="/pathways"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            View Graph
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SwipeHeader />

      <SwipeProgress processed={processedCount} total={totalJobs} />

      {/* Card stack area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full max-w-md h-[500px]">
          {/* Next card (behind) */}
          {nextJob && (
            <div className="absolute inset-0 scale-95 opacity-50">
              <SwipeCard job={nextJob} isBackground />
            </div>
          )}

          {/* Current card */}
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

      {/* Detail sheet */}
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
