'use client';

import { useRef, useEffect, useCallback } from 'react';
import {
  applyResumeUpdate,
  executeFilterJobs,
  executeSaveJobFeedback,
} from './toolActions';

/**
 * Unified hook to handle all tool invocations from the AI agent.
 */
export default function useToolHandler({
  messages,
  resumeData,
  setResumeData,
  saveResumeChanges,
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

  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  const handleUpdateResume = useCallback(
    (input) =>
      applyResumeUpdate(resumeDataRef.current, input, {
        setResumeData,
        saveResumeChanges,
      }),
    [setResumeData, saveResumeChanges]
  );

  const handleFilterJobs = useCallback(
    (input) =>
      executeFilterJobs(input, {
        jobs,
        jobInfo,
        userId,
        markAsRead,
        markAsInterested,
        markAsHidden,
        clearJobState,
      }),
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

  const handleShowJobs = useCallback(
    ({ query }) => {
      if (setFilterText && query) setFilterText(query);
    },
    [setFilterText]
  );

  const handleRefreshJobMatches = useCallback(() => {
    triggerGraphRefresh?.();
  }, [triggerGraphRefresh]);

  const handleSaveJobFeedback = useCallback(
    (input) =>
      executeSaveJobFeedback(input, { userId, markAsRead, markAsInterested }),
    [userId, markAsRead, markAsInterested]
  );

  // Tool handler registry
  const handlers = useRef({});
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
