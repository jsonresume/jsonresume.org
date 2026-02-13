'use client';

import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook for chat message initialization from persisted conversations.
 */
export function useMessageInitialization({
  isLoadingConversation,
  persistedMessages,
  setMessages,
}) {
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (
      !isLoadingConversation &&
      !hasInitializedRef.current &&
      persistedMessages?.length > 0
    ) {
      setMessages(persistedMessages);
      hasInitializedRef.current = true;
    }
  }, [isLoadingConversation, persistedMessages, setMessages]);

  // Reset when conversation cleared
  useEffect(() => {
    if (!persistedMessages) {
      hasInitializedRef.current = false;
    }
  }, [persistedMessages]);

  return hasInitializedRef;
}

/**
 * Hook for auto-saving conversation on message changes.
 */
export function useAutoSave({
  messages,
  saveConversation,
  isLoadingConversation,
}) {
  useEffect(() => {
    if (messages.length > 1 && !isLoadingConversation) {
      saveConversation(messages);
    }
  }, [messages, saveConversation, isLoadingConversation]);
}

/**
 * Hook to trigger embedding refresh when resume changes.
 */
export function useResumeChangeDetection({ resumeData, refreshEmbedding }) {
  const prevResumeRef = useRef(resumeData);

  useEffect(() => {
    const hasChange =
      JSON.stringify(prevResumeRef.current) !== JSON.stringify(resumeData);
    if (hasChange && refreshEmbedding) {
      const timeout = setTimeout(() => refreshEmbedding(), 1000);
      prevResumeRef.current = resumeData;
      return () => clearTimeout(timeout);
    }
  }, [resumeData, refreshEmbedding]);
}

/**
 * Hook to send job feedback message when prompted from graph.
 */
export function useJobFeedbackPrompt({
  pendingJobFeedback,
  sendMessage,
  clearPendingJobFeedback,
}) {
  useEffect(() => {
    if (!pendingJobFeedback) return;

    const { jobInfo, sentiment } = pendingJobFeedback;
    const sentimentLabel =
      {
        interested: 'interested in',
        not_interested: 'not interested in',
        maybe: 'unsure about',
        applied: 'applying to',
      }[sentiment] || sentiment;

    sendMessage({
      text: `[Job Review] Job ID: ${jobInfo.id} | Title: "${jobInfo.title}" | Company: ${jobInfo.company} | Sentiment: ${sentiment}. I want to mark this job as ${sentimentLabel}. Ask me why briefly.`,
    });
    clearPendingJobFeedback();
  }, [pendingJobFeedback, sendMessage, clearPendingJobFeedback]);
}

/**
 * Hook to load older messages with pagination.
 */
export function useOlderMessages({ loadMore }) {
  const handleLoadMore = useCallback(async () => {
    return await loadMore();
  }, [loadMore]);

  return handleLoadMore;
}
