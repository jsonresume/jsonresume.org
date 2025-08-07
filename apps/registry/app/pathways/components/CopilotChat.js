'use client';

import { Send, Volume2, VolumeX } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import Messages from './Messages';
import applyResumeChanges from '../utils/applyResumeChanges';

export default function CopilotChat({
  resumeData,
  setResumeData,
  setResumeJson,
}) {
  const handledToolCalls = useRef(new Set());
  const [input, setInput] = useState('');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('nova'); // nova is warm and friendly
  const audioRef = useRef(null);

  const { messages, sendMessage, status, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/pathways',
      body: { currentResume: resumeData },
    }),
    initialMessages: [
      {
        role: 'assistant',
        content:
          "Hi! I'm your Copilot. Ask me anything about your career pathway.",
        parts: [
          {
            type: 'text',
            text: "Hi! I'm your Copilot. Ask me anything about your career pathway.",
          },
        ],
      },
    ],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const isLoading = status === 'streaming';

  // Speech synthesis using OpenAI TTS
  const speakText = async (text) => {
    if (!isSpeechEnabled || !text || isGeneratingSpeech) return;

    try {
      setIsGeneratingSpeech(true);

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Generate speech via API
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        console.error('Speech API error:', errorData);
        throw new Error(
          errorData.details || errorData.error || 'Failed to generate speech'
        );
      }

      // Check response headers for debugging
      const contentType = response.headers.get('content-type');
      console.log('Audio response content-type:', contentType);

      // Get audio data as array buffer first
      const arrayBuffer = await response.arrayBuffer();
      console.log('Audio data size:', arrayBuffer.byteLength, 'bytes');

      // Create blob with explicit MIME type
      const audioBlob = new Blob([arrayBuffer], {
        type: contentType || 'audio/mpeg',
      });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create audio element and set up event listeners before playing
      const audio = new Audio();
      audio.volume = 0.9;

      // Set up event listeners
      audio.addEventListener('canplaythrough', () => {
        // Audio is ready to play
        audio.play().catch((error) => {
          console.error('Audio playback error:', error);
        });
      });

      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      });

      // Set source after listeners are attached
      audio.src = audioUrl;
      audioRef.current = audio;
    } catch (error) {
      console.error('Speech generation error:', error);
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  // Toggle speech on/off
  const toggleSpeech = () => {
    if (isSpeechEnabled) {
      // If turning off, stop any current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  // Apply resume updates returned by the AI tool
  useEffect(() => {
    for (const msg of messages) {
      for (const part of msg.parts ?? []) {
        // Check for tool-updateResume parts (v5 format)
        if (
          part.type === 'tool-updateResume' &&
          part.state === 'input-available' &&
          !handledToolCalls.current.has(part.toolCallId)
        ) {
          const { changes } = part.input ?? {};
          if (changes && typeof changes === 'object') {
            setResumeData((prev) => applyResumeChanges(prev, changes));
            setResumeJson((prev) =>
              JSON.stringify(
                applyResumeChanges(JSON.parse(prev), changes),
                null,
                2
              )
            );
          }
          addToolResult({
            toolCallId: part.toolCallId,
            result: 'Changes applied',
          });
          handledToolCalls.current.add(part.toolCallId);
        }
      }
    }
  }, [messages, addToolResult, setResumeData, setResumeJson]);

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
  }, [messages, isSpeechEnabled, status]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <aside className="w-[360px] border-l bg-white flex flex-col">
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-medium">Copilot Chat</h2>
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-md transition-colors relative ${
              isSpeechEnabled
                ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isSpeechEnabled ? 'Disable voice' : 'Enable voice'}
          >
            {isSpeechEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            {isGeneratingSpeech && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
            )}
          </button>
        </div>
        {isSpeechEnabled && (
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="text-xs px-2 py-1 border rounded-md w-full"
          >
            <option value="alloy">Alloy (Neutral)</option>
            <option value="echo">Echo (Male)</option>
            <option value="fable">Fable (British)</option>
            <option value="onyx">Onyx (Deep)</option>
            <option value="nova">Nova (Friendly)</option>
            <option value="shimmer">Shimmer (Female)</option>
          </select>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4 text-sm text-gray-500">
        <Messages messages={messages} isLoading={isLoading} />
      </div>
      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
}
