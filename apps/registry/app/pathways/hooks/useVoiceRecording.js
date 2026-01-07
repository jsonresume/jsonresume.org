'use client';

import { useState, useRef, useCallback } from 'react';
import { convertToWav, getAudioExtension } from './audioUtils';

export default function useVoiceRecording(onTranscriptionComplete) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const transcribeAudio = useCallback(
    async (audioBlob) => {
      try {
        setIsTranscribing(true);

        const extension = getAudioExtension(audioBlob.type);
        const formData = new FormData();
        formData.append('audio', audioBlob, `recording.${extension}`);

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }));
          throw new Error(
            error.details || error.error || 'Transcription failed'
          );
        }

        const { text } = await response.json();

        if (text && onTranscriptionComplete) {
          onTranscriptionComplete(text);
        }
      } catch (error) {
        alert(`Failed to transcribe audio: ${error.message}`);
      } finally {
        setIsTranscribing(false);
      }
    },
    [onTranscriptionComplete]
  );

  const startRecording = useCallback(
    async (stopCurrentAudio) => {
      try {
        if (stopCurrentAudio) {
          stopCurrentAudio();
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });

        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const webmBlob = new Blob(audioChunksRef.current, {
            type: 'audio/webm',
          });

          try {
            const wavBlob = await convertToWav(webmBlob);
            await transcribeAudio(wavBlob);
          } catch {
            // Fallback to WebM if WAV conversion fails
            await transcribeAudio(webmBlob);
          }

          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch {
        alert('Could not access microphone. Please check permissions.');
      }
    },
    [transcribeAudio]
  );

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleRecording = useCallback(
    (stopCurrentAudio) => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording(stopCurrentAudio);
      }
    },
    [isRecording, startRecording, stopRecording]
  );

  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        ?.getTracks()
        .forEach((track) => track.stop());
    }
  }, [isRecording]);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    toggleRecording,
    cleanup,
  };
}
