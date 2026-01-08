'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { usePathways } from '../context/PathwaysContext';
import { INITIAL_MESSAGE } from '../constants/chatMessages';
import useSpeech from './useSpeech';
import useVoiceRecording from './useVoiceRecording';
import useToolHandler from './useToolHandler';
import useConversationPersistence from './useConversationPersistence';
import useChatSpeech from './useChatSpeech';
import useFileUploadHandler from './useFileUploadHandler';

/**
 * Hook to manage CopilotChat state, speech, recording, and persistence.
 * Extracts complex state management from the CopilotChat component.
 */
export function useCopilotChatState({ resumeData, setResumeData }) {
  const [input, setInput] = useState('');
  const [olderMessages, setOlderMessages] = useState([]);

  const {
    sessionId,
    userId,
    markAsRead,
    markAsInterested,
    markAsHidden,
    clearJobState,
    triggerGraphRefresh,
    refreshEmbedding,
    saveResumeChanges,
    pendingJobFeedback,
    clearPendingJobFeedback,
  } = usePathways();

  // Conversation persistence
  const {
    isLoading: isLoadingConversation,
    isLoadingMore,
    isSaving,
    initialMessages: persistedMessages,
    hasMore,
    saveConversation,
    loadMore,
    clearConversation,
  } = useConversationPersistence({
    sessionId,
    userId,
    resume: resumeData,
  });

  // AI Chat
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/pathways',
      body: { currentResume: resumeData },
    }),
    initialMessages: [INITIAL_MESSAGE],
  });

  // Initialize messages from persistence
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

  // Save conversation on message changes
  useEffect(() => {
    if (messages.length > 1 && !isLoadingConversation) {
      saveConversation(messages);
    }
  }, [messages, saveConversation, isLoadingConversation]);

  // Speech synthesis
  const {
    isSpeechEnabled,
    isGeneratingSpeech,
    selectedVoice,
    setSelectedVoice,
    speakText,
    toggleSpeech,
    stopSpeech,
    cleanup: cleanupSpeech,
  } = useSpeech();

  // Auto-speak assistant messages
  useChatSpeech({ messages, isSpeechEnabled, status, speakText });

  // Voice recording
  const handleTranscriptionComplete = useCallback(
    (text) => {
      setInput(text);
      sendMessage({ text });
      setInput('');
    },
    [sendMessage]
  );

  const {
    isRecording,
    isTranscribing,
    toggleRecording,
    cleanup: cleanupRecording,
  } = useVoiceRecording(handleTranscriptionComplete);

  // Tool handler
  useToolHandler({
    messages,
    resumeData,
    setResumeData,
    saveResumeChanges,
    markAsRead,
    markAsInterested,
    markAsHidden,
    clearJobState,
    triggerGraphRefresh,
    userId,
  });

  // File upload
  const {
    pendingResumeData,
    isApplyingResume,
    handleFileUpload,
    handleApplyResumeData,
    handleDismissParseResult,
  } = useFileUploadHandler({ sendMessage });

  // Refresh embedding when resume changes
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

  // Handle pending job feedback
  useEffect(() => {
    if (pendingJobFeedback) {
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
    }
  }, [pendingJobFeedback, sendMessage, clearPendingJobFeedback]);

  // Event handlers
  const handleSubmit = useCallback(
    (text) => {
      sendMessage({ text });
      setInput('');
    },
    [sendMessage]
  );

  const handleToggleRecording = useCallback(() => {
    toggleRecording(stopSpeech);
  }, [toggleRecording, stopSpeech]);

  const handleLoadMore = useCallback(async () => {
    const older = await loadMore();
    if (older?.length > 0) {
      setOlderMessages((prev) => [...older, ...prev]);
    }
    return older;
  }, [loadMore]);

  // Reset state when conversation cleared
  useEffect(() => {
    if (!persistedMessages) {
      setOlderMessages([]);
      hasInitializedRef.current = false;
    }
  }, [persistedMessages]);

  // Combine messages
  const allMessages = [...olderMessages, ...messages];

  // Cleanup
  useEffect(() => {
    return () => {
      cleanupSpeech();
      cleanupRecording();
    };
  }, [cleanupSpeech, cleanupRecording]);

  return {
    // Input state
    input,
    setInput,
    allMessages,

    // Loading states
    isLoadingConversation,
    isLoadingMore,
    isSaving,
    hasMore,
    status,

    // Speech state
    isSpeechEnabled,
    isGeneratingSpeech,
    selectedVoice,
    setSelectedVoice,
    toggleSpeech,

    // Recording state
    isRecording,
    isTranscribing,

    // File upload state
    pendingResumeData,
    isApplyingResume,

    // Handlers
    handleSubmit,
    handleToggleRecording,
    handleLoadMore,
    handleFileUpload,
    handleApplyResumeData,
    handleDismissParseResult,
    clearConversation,
  };
}

export default useCopilotChatState;
