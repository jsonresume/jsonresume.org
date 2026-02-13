'use client';

import { useState, useEffect, useCallback } from 'react';
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
import {
  useMessageInitialization,
  useAutoSave,
  useResumeChangeDetection,
  useJobFeedbackPrompt,
} from './useChatEffects';

/**
 * Hook to manage CopilotChat state, speech, recording, and persistence.
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
  } = useConversationPersistence({ sessionId, userId, resume: resumeData });

  // AI Chat
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/pathways',
      body: { currentResume: resumeData },
    }),
    initialMessages: [INITIAL_MESSAGE],
  });

  // Message initialization + auto-save (extracted effects)
  const hasInitializedRef = useMessageInitialization({
    isLoadingConversation,
    persistedMessages,
    setMessages,
  });
  useAutoSave({ messages, saveConversation, isLoadingConversation });
  useResumeChangeDetection({ resumeData, refreshEmbedding });
  useJobFeedbackPrompt({
    pendingJobFeedback,
    sendMessage,
    clearPendingJobFeedback,
  });

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

  // Event handlers
  const handleSubmit = useCallback(
    (text) => {
      sendMessage({ text });
      setInput('');
    },
    [sendMessage]
  );
  const handleToggleRecording = useCallback(
    () => toggleRecording(stopSpeech),
    [toggleRecording, stopSpeech]
  );
  const handleLoadMore = useCallback(async () => {
    const older = await loadMore();
    if (older?.length > 0) setOlderMessages((prev) => [...older, ...prev]);
    return older;
  }, [loadMore]);

  // Reset older messages when conversation cleared
  useEffect(() => {
    if (!persistedMessages) {
      setOlderMessages([]);
      hasInitializedRef.current = false;
    }
  }, [persistedMessages, hasInitializedRef]);

  const allMessages = [...olderMessages, ...messages];

  // Cleanup
  useEffect(
    () => () => {
      cleanupSpeech();
      cleanupRecording();
    },
    [cleanupSpeech, cleanupRecording]
  );

  return {
    input,
    setInput,
    allMessages,
    isLoadingConversation,
    isLoadingMore,
    isSaving,
    hasMore,
    status,
    isSpeechEnabled,
    isGeneratingSpeech,
    selectedVoice,
    setSelectedVoice,
    toggleSpeech,
    isRecording,
    isTranscribing,
    pendingResumeData,
    isApplyingResume,
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
