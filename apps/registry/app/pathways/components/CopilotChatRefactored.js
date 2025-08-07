'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect, useCallback } from 'react';
import Messages from './Messages';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import useSpeech from '../hooks/useSpeech';
import useVoiceRecording from '../hooks/useVoiceRecording';
import useResumeUpdater from '../hooks/useResumeUpdater';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm your Copilot. Ask me anything about your career pathway.",
  parts: [
    {
      type: 'text',
      text: "Hi! I'm your Copilot. Ask me anything about your career pathway.",
    },
  ],
};

export default function CopilotChat({
  resumeData,
  setResumeData,
  setResumeJson,
}) {
  const [input, setInput] = useState('');

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
      // Auto-submit the transcribed message
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
  useResumeUpdater({
    messages,
    addToolResult,
    setResumeData,
    setResumeJson,
  });

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

  // Speak new assistant messages
  useEffect(() => {
    if (!isSpeechEnabled) return;

    // Get the last message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;

    // Extract text content to speak
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
          // Speak the explanation for resume updates
          if (part.input?.explanation) {
            textToSpeak += part.input.explanation + ' ';
          }
        }
      }
    }

    // Only speak if we're not still streaming
    if (textToSpeak && status !== 'streaming') {
      // Add a small delay to make it feel more natural
      const timeoutId = setTimeout(() => {
        speakText(textToSpeak.trim());
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [messages, isSpeechEnabled, status, speakText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSpeech();
      cleanupRecording();
    };
  }, [cleanupSpeech, cleanupRecording]);

  const isLoading = status === 'streaming';

  return (
    <aside className="w-[360px] border-l bg-white flex flex-col">
      <ChatHeader
        isSpeechEnabled={isSpeechEnabled}
        isGeneratingSpeech={isGeneratingSpeech}
        selectedVoice={selectedVoice}
        onToggleSpeech={toggleSpeech}
        onVoiceChange={setSelectedVoice}
      />

      <div className="flex-1 overflow-auto p-4 text-sm text-gray-500">
        <Messages messages={messages} isLoading={isLoading} />
      </div>

      <ChatInput
        input={input}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onToggleRecording={handleToggleRecording}
      />
    </aside>
  );
}
