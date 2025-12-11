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
import { usePathways } from '../context/PathwaysContext';
import styles from './chat.module.css';

const INITIAL_MESSAGE = {
  id: 'initial-greeting',
  role: 'assistant',
  status: 'ready',
  content:
    "Hi! I'm your Career Copilot. I can help you with your resume and find matching jobs. Try asking me to update your resume, filter jobs, or show specific opportunities!",
  parts: [
    {
      type: 'text',
      text: "Hi! I'm your Career Copilot. I can help you with your resume and find matching jobs. Try asking me to update your resume, filter jobs, or show specific opportunities!",
    },
  ],
};

export default function CopilotChat({
  resumeData,
  setResumeData,
  setResumeJson,
}) {
  const [input, setInput] = useState('');
  const [pendingResumeData, setPendingResumeData] = useState(null);
  const [isApplyingResume, setIsApplyingResume] = useState(false);

  // Get job-related functions from context
  const {
    markAsRead,
    markAsInterested,
    markAsHidden,
    clearJobState,
    triggerGraphRefresh,
    refreshEmbedding,
  } = usePathways();

  // Initialize chat with AI SDK
  const { messages, sendMessage, status, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/pathways',
      body: { currentResume: resumeData },
    }),
    initialMessages: [INITIAL_MESSAGE],
  });

  // Initialize speech synthesis
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

  // Handle transcription complete
  const handleTranscriptionComplete = useCallback(
    (text) => {
      setInput(text);
      sendMessage({ text });
      setInput('');
    },
    [sendMessage]
  );

  // Initialize voice recording
  const {
    isRecording,
    isTranscribing,
    toggleRecording,
    cleanup: cleanupRecording,
  } = useVoiceRecording(handleTranscriptionComplete);

  // Handle resume updates from tool invocations
  // Note: setResumeData is actually updateResume which takes a direct value, NOT a functional update
  useResumeUpdater({
    messages,
    resumeData,
    setResumeData,
  });

  // Handle job-related tool invocations
  useJobToolsHandler({
    messages,
    addToolResult,
    markAsRead,
    markAsInterested,
    markAsHidden,
    clearJobState,
    triggerGraphRefresh,
  });

  // Trigger embedding refresh when resume changes significantly
  const prevResumeRef = useRef(resumeData);
  useEffect(() => {
    const hasSignificantChange =
      JSON.stringify(prevResumeRef.current) !== JSON.stringify(resumeData);
    if (hasSignificantChange && refreshEmbedding) {
      // Debounce the refresh
      const timeout = setTimeout(() => {
        refreshEmbedding();
      }, 1000);
      prevResumeRef.current = resumeData;
      return () => clearTimeout(timeout);
    }
  }, [resumeData, refreshEmbedding]);

  // Handle message submission
  const handleSubmit = useCallback(
    (text) => {
      sendMessage({ text });
      setInput('');
    },
    [sendMessage]
  );

  // Handle recording toggle
  const handleToggleRecording = useCallback(() => {
    toggleRecording(stopSpeech);
  }, [toggleRecording, stopSpeech]);

  // Handle file upload and resume extraction
  const handleFileUpload = useCallback((extractedData) => {
    const firstFile = extractedData[0];
    if (firstFile) {
      setPendingResumeData({
        filename: firstFile.filename,
        data: firstFile.data,
      });
    }
  }, []);

  // Handle applying parsed resume data
  const handleApplyResumeData = useCallback(
    async (selectedData) => {
      setIsApplyingResume(true);
      try {
        const uploadMessage = `I've uploaded a resume file (${
          pendingResumeData.filename
        }). Please analyze and update my resume with this information: ${JSON.stringify(
          selectedData,
          null,
          2
        )}`;
        sendMessage({ text: uploadMessage });
        setPendingResumeData(null);
      } catch (error) {
        console.error('Error applying resume data:', error);
      } finally {
        setIsApplyingResume(false);
      }
    },
    [pendingResumeData, sendMessage]
  );

  // Handle dismissing the parse result
  const handleDismissParseResult = useCallback(() => {
    setPendingResumeData(null);
  }, []);

  // Track what we've already spoken
  const lastSpokenTextRef = useRef('');

  // Speak new assistant messages
  useEffect(() => {
    if (!isSpeechEnabled) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;

    let textToSpeak = '';

    if (lastMessage.content) {
      textToSpeak = lastMessage.content;
    } else if (lastMessage.parts) {
      for (const part of lastMessage.parts) {
        if (part.type === 'text') {
          textToSpeak += part.text + ' ';
        } else if (
          part.type === 'tool-updateResume' &&
          part.state === 'input-available'
        ) {
          if (part.input?.explanation) {
            textToSpeak += part.input.explanation + ' ';
          }
        }
      }
    }

    const trimmedText = textToSpeak.trim();

    if (
      trimmedText &&
      status !== 'streaming' &&
      trimmedText !== lastSpokenTextRef.current
    ) {
      lastSpokenTextRef.current = trimmedText;
      const timeoutId = setTimeout(() => {
        speakText(trimmedText);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, isSpeechEnabled, status, speakText]);

  // Reset spoken text when speech is toggled off
  useEffect(() => {
    if (!isSpeechEnabled) {
      lastSpokenTextRef.current = '';
    }
  }, [isSpeechEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSpeech();
      cleanupRecording();
    };
  }, [cleanupSpeech, cleanupRecording]);

  const isLoading = status === 'streaming';

  return (
    <aside className={`w-[380px] flex flex-col ${styles.chatContainer}`}>
      <ChatHeader
        isSpeechEnabled={isSpeechEnabled}
        isGeneratingSpeech={isGeneratingSpeech}
        selectedVoice={selectedVoice}
        onToggleSpeech={toggleSpeech}
        onVoiceChange={setSelectedVoice}
      />

      <div className={`flex-1 overflow-auto p-4 ${styles.messagesContainer}`}>
        <Messages messages={messages} isLoading={isLoading} />

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
