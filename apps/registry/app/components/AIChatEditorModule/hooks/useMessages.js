import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'resumeAiChatMessages';
const MAX_STORED_MESSAGES = 30;
const MAX_CONTEXT_MESSAGES = 10;

export const useMessages = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      return parsed.slice(-MAX_STORED_MESSAGES);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const addSystemMessage = useCallback((content, type = 'info') => {
    const systemMessage = {
      role: 'system',
      content,
      type,
      id: Date.now(),
    };
    setMessages((prev) => [...prev, systemMessage]);
  }, []);

  const markChangesApplied = useCallback((messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, changesApplied: true } : msg
      )
    );
  }, []);

  const getRecentContext = useCallback(
    (newMessage) => {
      return [...messages.slice(-MAX_CONTEXT_MESSAGES + 1), newMessage].map(
        (msg) => ({
          role: msg.role,
          content: msg.content,
        })
      );
    },
    [messages]
  );

  return {
    messages,
    addMessage,
    addSystemMessage,
    markChangesApplied,
    getRecentContext,
  };
};
