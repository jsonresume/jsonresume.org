'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import pathwaysToast from '../utils/toastMessages';
import { activityLogger } from '../utils/activityLogger';

const SAVE_DEBOUNCE_MS = 2000;
const MESSAGES_PER_PAGE = 50;
const MAX_STORED_MESSAGES = 100;

function buildParams(userId, sessionId) {
  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  else if (sessionId) params.set('sessionId', sessionId);
  return params;
}

export default function useConversationPersistence({
  sessionId,
  userId,
  resume,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialMessages, setInitialMessages] = useState(null);
  const [totalMessages, setTotalMessages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const saveTimeoutRef = useRef(null);
  const lastSavedRef = useRef(null);
  const fetchedWithRef = useRef({ sessionId: null, userId: null });

  // Load conversation on mount
  useEffect(() => {
    if (!sessionId && !userId) {
      setIsLoading(false);
      return;
    }

    const alreadyFetched =
      fetchedWithRef.current.sessionId === sessionId &&
      fetchedWithRef.current.userId === userId;
    if (alreadyFetched) return;
    fetchedWithRef.current = { sessionId, userId };

    const loadConversation = async () => {
      try {
        const params = buildParams(userId, sessionId);
        params.set('limit', String(MESSAGES_PER_PAGE));
        params.set('offset', '0');

        const response = await fetch(`/api/pathways/conversations?${params}`);
        if (!response.ok) throw new Error('Failed to load');

        const { messages, total, hasMore: more } = await response.json();
        if (messages?.length > 0) {
          setInitialMessages(messages);
          setTotalMessages(total);
          setHasMore(more);
          setCurrentOffset(0);
        }
      } catch (error) {
        pathwaysToast.conversationLoadError();
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
  }, [sessionId, userId]);

  // Save conversation (debounced)
  const saveConversation = useCallback(
    (messages) => {
      if (!sessionId && !userId) return;
      if (!messages || messages.length === 0) return;

      // Don't save if messages haven't changed
      const messagesJson = JSON.stringify(messages);
      if (lastSavedRef.current === messagesJson) return;

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce the save
      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          // Cap stored messages to prevent unbounded growth
          const trimmedMessages =
            messages.length > MAX_STORED_MESSAGES
              ? messages.slice(-MAX_STORED_MESSAGES)
              : messages;

          const response = await fetch('/api/pathways/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: userId ? undefined : sessionId,
              userId: userId || undefined,
              messages: trimmedMessages,
              resumeSnapshot: resume,
            }),
          });

          if (response.ok) {
            lastSavedRef.current = messagesJson;
          }
        } catch (error) {
          pathwaysToast.conversationSaveError();
        } finally {
          setIsSaving(false);
        }
      }, SAVE_DEBOUNCE_MS);
    },
    [sessionId, userId, resume]
  );

  // Load more older messages (for infinite scroll upward)
  const loadMore = useCallback(async () => {
    if (!sessionId && !userId) return [];
    if (!hasMore || isLoadingMore) return [];

    setIsLoadingMore(true);
    try {
      const newOffset = currentOffset + MESSAGES_PER_PAGE;
      const params = buildParams(userId, sessionId);
      params.set('limit', String(MESSAGES_PER_PAGE));
      params.set('offset', String(newOffset));

      const response = await fetch(`/api/pathways/conversations?${params}`);
      if (!response.ok) throw new Error('Failed to load more');

      const { messages, hasMore: more } = await response.json();
      setCurrentOffset(newOffset);
      setHasMore(more);
      return messages || [];
    } catch (error) {
      pathwaysToast.apiError('Failed to load older messages');
      return [];
    } finally {
      setIsLoadingMore(false);
    }
  }, [sessionId, userId, hasMore, isLoadingMore, currentOffset]);

  // Clear conversation
  const clearConversation = useCallback(async () => {
    if (!sessionId && !userId) return;

    try {
      await fetch(
        `/api/pathways/conversations?${buildParams(userId, sessionId)}`,
        {
          method: 'DELETE',
        }
      );

      lastSavedRef.current = null;
      setInitialMessages(null);
      setTotalMessages(0);
      setHasMore(false);
      setCurrentOffset(0);
      pathwaysToast.conversationCleared();
      activityLogger.conversationCleared(sessionId, userId);
    } catch (error) {
      pathwaysToast.apiError('Failed to clear conversation');
    }
  }, [sessionId, userId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    isLoadingMore,
    isSaving,
    initialMessages,
    totalMessages,
    hasMore,
    saveConversation,
    loadMore,
    clearConversation,
  };
}
