'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect, useCallback, useRef } from 'react';
import Messages from './Messages';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ResumeParseResult from './ResumeParseResult';
import useSpeech from '../hooks/useSpeech';
import useVoiceRecording from '../hooks/useVoiceRecording';
import useResumeUpdater from '../hooks/useResumeUpdater';
import useJobToolsHandler from '../hooks/useJobToolsHandler';
import useConversationPersistence from '../hooks/useConversationPersistence';
import useChatSpeech from '../hooks/useChatSpeech';
import useFileUploadHandler from '../hooks/useFileUploadHandler';
import { usePathways } from '../context/PathwaysContext';
import { INITIAL_MESSAGE } from '../constants/chatMessages';

export default function CopilotChat({
  resumeData,
  setResumeData,
  setResumeJson,
}) {
  const [input, setInput] = useState('');

  const {
    sessionId,
    userId,
    username,
    markAsRead,
    markAsInterested,
    markAsHidden,
    clearJobState,
    triggerGraphRefresh,
    refreshEmbedding,
    saveResumeChanges,
  } = usePathways();

  const {
    isLoading: isLoadingConversation,
    isSaving,
    initialMessages: persistedMessages,
    saveConversation,
    clearConversation,
  } = useConversationPersistence({
    sessionId,
    userId,
    resume: resumeData,
  });

  const chatInitialMessages =
    persistedMessages?.length > 0 ? persistedMessages : [INITIAL_MESSAGE];

  const { messages, sendMessage, status, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/pathways',
      body: { currentResume: resumeData },
    }),
    initialMessages: isLoadingConversation ? [] : chatInitialMessages,
  });

  // Save conversation when messages change
  useEffect(() => {
    if (messages.length > 1 && !isLoadingConversation) {
      saveConversation(messages);
    }
  }, [messages, saveConversation, isLoadingConversation]);

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

  useResumeUpdater({ messages, resumeData, setResumeData, saveResumeChanges });

  useJobToolsHandler({
    messages,
    addToolResult,
    markAsRead,
    markAsInterested,
    markAsHidden,
    clearJobState,
    triggerGraphRefresh,
  });

  // File upload handling
  const {
    pendingResumeData,
    isApplyingResume,
    handleFileUpload,
    handleApplyResumeData,
    handleDismissParseResult,
  } = useFileUploadHandler({ sendMessage });

  // Trigger embedding refresh when resume changes
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSpeech();
      cleanupRecording();
    };
  }, [cleanupSpeech, cleanupRecording]);

  if (isLoadingConversation) {
    return (
      <aside className="w-[360px] border-l bg-white flex flex-col items-center justify-center">
        <div className="animate-pulse text-gray-400">
          Loading conversation...
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[360px] border-l bg-white flex flex-col">
      <ChatHeader
        isSpeechEnabled={isSpeechEnabled}
        isGeneratingSpeech={isGeneratingSpeech}
        selectedVoice={selectedVoice}
        onToggleSpeech={toggleSpeech}
        onVoiceChange={setSelectedVoice}
        isSaving={isSaving}
        onClearConversation={clearConversation}
      />

      <div className="flex-1 overflow-auto p-4 text-sm text-gray-500">
        <Messages messages={messages} isLoading={status === 'streaming'} />

        {pendingResumeData && (
          <ResumeParseResult
            parsedData={pendingResumeData.data}
            onApplyChanges={handleApplyResumeData}
            onDismiss={handleDismissParseResult}
            isApplying={isApplyingResume}
          />
        )}
      </div>

      <ChatInput
        input={input}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onToggleRecording={handleToggleRecording}
        onFileUpload={handleFileUpload}
      />
    </aside>
  );
}
