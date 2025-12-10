'use client';

import { useState, useRef, useCallback } from 'react';

// Convert audio blob to WAV format for better compatibility
const convertToWav = async (audioBlob) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Create WAV file
  const length = audioBuffer.length * audioBuffer.numberOfChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, audioBuffer.numberOfChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(
    28,
    audioBuffer.sampleRate * 2 * audioBuffer.numberOfChannels,
    true
  );
  view.setUint16(32, audioBuffer.numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  // Convert audio data
  const channelData = audioBuffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

export default function useVoiceRecording(onTranscriptionComplete) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const transcribeAudio = useCallback(
    async (audioBlob) => {
      try {
        setIsTranscribing(true);

        console.log('Sending audio for transcription:', {
          type: audioBlob.type,
          size: audioBlob.size,
        });

        // Determine file extension based on MIME type
        const extension = audioBlob.type.includes('wav')
          ? 'wav'
          : audioBlob.type.includes('webm')
          ? 'webm'
          : audioBlob.type.includes('ogg')
          ? 'ogg'
          : audioBlob.type.includes('mp4')
          ? 'mp4'
          : 'wav';

        // Create FormData with the audio blob
        const formData = new FormData();
        formData.append('audio', audioBlob, `recording.${extension}`);

        // Send to transcription API
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }));
          console.error('Transcription API error:', error);
          throw new Error(
            error.details || error.error || 'Transcription failed'
          );
        }

        const { text } = await response.json();
        console.log('Transcription result:', text);

        if (text && onTranscriptionComplete) {
          onTranscriptionComplete(text);
        }
      } catch (error) {
        console.error('Transcription error:', error);
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
        // Stop any currently playing audio if callback provided
        if (stopCurrentAudio) {
          stopCurrentAudio();
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Use standard WebM format
        const mimeType = 'audio/webm';

        // Create MediaRecorder with the stream
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: mimeType,
        });

        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        // Collect audio chunks
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        // Handle recording stop
        mediaRecorder.onstop = async () => {
          // Create blob from recorded chunks
          const webmBlob = new Blob(audioChunksRef.current, {
            type: 'audio/webm',
          });

          try {
            // Convert to WAV for better compatibility
            console.log('Converting audio to WAV format...');
            const wavBlob = await convertToWav(webmBlob);
            await transcribeAudio(wavBlob);
          } catch (conversionError) {
            console.error(
              'Failed to convert to WAV, trying WebM directly:',
              conversionError
            );
            // Fallback to WebM if conversion fails
            await transcribeAudio(webmBlob);
          }

          // Stop all tracks to release the microphone
          stream.getTracks().forEach((track) => track.stop());
        };

        // Start recording
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
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

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all tracks
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
