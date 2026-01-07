'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

const SAVE_DEBOUNCE_MS = 2000;

export default function useConversationPersistence({
  sessionId,
  userId,
  resume,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialMessages, setInitialMessages] = useState(null);
  const saveTimeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  // Load conversation on mount
  useEffect(() => {
    if (!sessionId && !userId) {
      setIsLoading(false);
      return;
    }

    const loadConversation = async () => {
      try {
        const params = new URLSearchParams();
        if (userId) {
          params.set('userId', userId);
        } else if (sessionId) {
          params.set('sessionId', sessionId);
        }

        const response = await fetch(`/api/pathways/conversations?${params}`);
        if (!response.ok) throw new Error('Failed to load');

        const { conversation } = await response.json();
        if (conversation?.messages?.length > 0) {
          setInitialMessages(conversation.messages);
        }
      } catch (error) {
        console.error('Failed to load conversation:', error);
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
          const response = await fetch('/api/pathways/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: userId ? undefined : sessionId,
              userId: userId || undefined,
              messages,
              resumeSnapshot: resume,
            }),
          });

          if (response.ok) {
            lastSavedRef.current = messagesJson;
          }
        } catch (error) {
          console.error('Failed to save conversation:', error);
        } finally {
          setIsSaving(false);
        }
      }, SAVE_DEBOUNCE_MS);
    },
    [sessionId, userId, resume]
  );

  // Clear conversation
  const clearConversation = useCallback(async () => {
    if (!sessionId && !userId) return;

    try {
      const params = new URLSearchParams();
      if (userId) {
        params.set('userId', userId);
      } else if (sessionId) {
        params.set('sessionId', sessionId);
      }

      await fetch(`/api/pathways/conversations?${params}`, {
        method: 'DELETE',
      });

      lastSavedRef.current = null;
      setInitialMessages(null);
    } catch (error) {
      console.error('Failed to clear conversation:', error);
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
    isSaving,
    initialMessages,
    saveConversation,
    clearConversation,
  };
}
