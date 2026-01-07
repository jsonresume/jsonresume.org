'use client';

import { useState, useRef, useCallback } from 'react';
import { convertToWav, getAudioExtension } from './audioUtils';
import pathwaysToast from '../utils/toastMessages';
import { activityLogger } from '../utils/activityLogger';

export default function useVoiceRecording(onTranscriptionComplete) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingStartTimeRef = useRef(null);

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
          activityLogger.transcriptionCompleted(text);
        }
      } catch (error) {
        pathwaysToast.transcriptionError(error.message);
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
        recordingStartTimeRef.current = Date.now();
        activityLogger.recordingStarted();
      } catch {
        pathwaysToast.microphonePermission();
      }
    },
    [transcribeAudio]
  );

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      const duration = recordingStartTimeRef.current
        ? Date.now() - recordingStartTimeRef.current
        : 0;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      activityLogger.recordingCompleted(duration);
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
