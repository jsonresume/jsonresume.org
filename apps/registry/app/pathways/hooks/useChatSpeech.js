'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook to handle automatic speech for assistant messages
 * Extracts text from message parts and speaks when streaming completes
 */
export default function useChatSpeech({
  messages,
  isSpeechEnabled,
  status,
  speakText,
}) {
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
}
