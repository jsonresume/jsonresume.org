'use client';

import { useState, useRef, useCallback } from 'react';
import pathwaysToast from '../utils/toastMessages';
import { activityLogger } from '../utils/activityLogger';

export default function useSpeech() {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const audioRef = useRef(null);

  const speakText = useCallback(
    async (text) => {
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

        // Get audio data as array buffer
        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type');

        // Create blob and audio element
        const audioBlob = new Blob([arrayBuffer], {
          type: contentType || 'audio/mpeg',
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio();
        audio.volume = 0.9;

        // Set up event listeners
        audio.addEventListener('canplaythrough', () => {
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

        // Set source and store reference
        audio.src = audioUrl;
        audioRef.current = audio;
        activityLogger.speechGenerated();
      } catch (error) {
        pathwaysToast.speechError();
      } finally {
        setIsGeneratingSpeech(false);
      }
    },
    [isSpeechEnabled, selectedVoice, isGeneratingSpeech]
  );

  const toggleSpeech = useCallback(() => {
    const newState = !isSpeechEnabled;
    if (isSpeechEnabled) {
      // If turning off, stop any current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
    setIsSpeechEnabled(newState);
    activityLogger.speechToggled(newState, selectedVoice);
  }, [isSpeechEnabled, selectedVoice]);

  const stopSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return {
    isSpeechEnabled,
    isGeneratingSpeech,
    selectedVoice,
    setSelectedVoice,
    speakText,
    toggleSpeech,
    stopSpeech,
    cleanup,
  };
}
