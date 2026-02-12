'use client';

import { useRef, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import applyResumeChanges from '../utils/applyResumeChanges';
import { findMatchingJobs } from '../utils/jobFilterMatcher';

/**
 * Unified hook to handle all tool invocations from the AI agent.
 * Consolidates resume and job tool handlers into a single hook.
 */
export default function useToolHandler({
  messages,
  // Resume dependencies
  resumeData,
  setResumeData,
  saveResumeChanges,
  // Job dependencies
  markAsRead,
  markAsInterested,
  markAsHidden,
  clearJobState,
  triggerGraphRefresh,
  setFilterText,
  jobs = [],
  jobInfo = {},
  userId,
}) {
  const handledToolCalls = useRef(new Set());
  const resumeDataRef = useRef(resumeData);

  // Keep resume ref updated to avoid stale closures
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  // Handler: updateResume
  const handleUpdateResume = useCallback(
    ({ changes, explanation }) => {
      if (!changes || typeof changes !== 'object') return;

      const updated = applyResumeChanges(resumeDataRef.current, changes);
      setResumeData(updated);

      if (saveResumeChanges) {
        saveResumeChanges(changes, explanation, 'ai_update').catch((err) =>
          logger.error(
            { error: err.message },
            'Failed to persist resume changes'
          )
        );
      }
    },
    [setResumeData, saveResumeChanges]
  );

  // Handler: filterJobs
  const handleFilterJobs = useCallback(
    async ({ criteria, action, reason }) => {
      if (!criteria || !jobs?.length) return;

      const matchingIds = findMatchingJobs(criteria, jobs, jobInfo);

      // Apply action to each matching job
      matchingIds.forEach((jobId) => {
        switch (action) {
          case 'mark_read':
            markAsRead?.(jobId);
            break;
          case 'mark_interested':
            markAsInterested?.(jobId);
            break;
          case 'mark_hidden':
            markAsHidden?.(jobId);
            break;
          case 'unmark':
            clearJobState?.(jobId);
            break;
        }
      });

      // Save feedback with reason if provided (batch)
      if (reason && userId && matchingIds.length > 0) {
        const feedbacks = matchingIds.map((jobId) => ({
          jobId,
          feedback: reason,
          sentiment: action === 'mark_interested' ? 'interested' : 'dismissed',
          jobTitle: jobInfo[jobId]?.title,
          jobCompany: jobInfo[jobId]?.company,
        }));

        try {
          await fetch('/api/pathways/feedback/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, feedbacks }),
          });
        } catch (error) {
          logger.error(
            { error: error.message },
            'Failed to save batch feedback'
          );
        }
      }
    },
    [
      jobs,
      jobInfo,
      userId,
      markAsRead,
      markAsInterested,
      markAsHidden,
      clearJobState,
    ]
  );

  // Handler: showJobs
  const handleShowJobs = useCallback(
    ({ query }) => {
      if (setFilterText && query) {
        setFilterText(query);
      }
    },
    [setFilterText]
  );

  // Handler: refreshJobMatches
  const handleRefreshJobMatches = useCallback(() => {
    triggerGraphRefresh?.();
  }, [triggerGraphRefresh]);

  // Handler: saveJobFeedback
  const handleSaveJobFeedback = useCallback(
    async ({ jobId, jobTitle, jobCompany, feedback, sentiment }) => {
      if (!userId || !jobId || !feedback) return;

      try {
        await fetch('/api/pathways/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            jobId,
            feedback,
            sentiment,
            jobTitle,
            jobCompany,
          }),
        });

        // Mark based on sentiment
        if (sentiment === 'interested' || sentiment === 'applied') {
          markAsInterested?.(jobId);
        } else {
          markAsRead?.(jobId);
        }
      } catch (error) {
        logger.error({ error: error.message }, 'Failed to save job feedback');
      }
    },
    [userId, markAsRead, markAsInterested]
  );

  // Tool handler registry
  const handlers = useRef({
    updateResume: handleUpdateResume,
    filterJobs: handleFilterJobs,
    showJobs: handleShowJobs,
    getJobInsights: () => {}, // UI-only, no client action
    refreshJobMatches: handleRefreshJobMatches,
    saveJobFeedback: handleSaveJobFeedback,
  });

  // Keep handlers ref updated
  useEffect(() => {
    handlers.current = {
      updateResume: handleUpdateResume,
      filterJobs: handleFilterJobs,
      showJobs: handleShowJobs,
      getJobInsights: () => {},
      refreshJobMatches: handleRefreshJobMatches,
      saveJobFeedback: handleSaveJobFeedback,
    };
  }, [
    handleUpdateResume,
    handleFilterJobs,
    handleShowJobs,
    handleRefreshJobMatches,
    handleSaveJobFeedback,
  ]);

  // Process tool invocations from messages
  useEffect(() => {
    for (const msg of messages) {
      for (const part of msg.parts ?? []) {
        // Check for tool parts (AI SDK format: tool-{toolName})
        if (!part.type?.startsWith('tool-')) continue;
        if (
          part.state !== 'input-available' &&
          part.state !== 'output-available'
        )
          continue;
        if (handledToolCalls.current.has(part.toolCallId)) continue;

        const toolName = part.type.replace('tool-', '');
        const handler = handlers.current[toolName];

        if (handler && part.input) {
          handler(part.input);
          handledToolCalls.current.add(part.toolCallId);
        }
      }
    }
  }, [messages]);

  return null;
}
