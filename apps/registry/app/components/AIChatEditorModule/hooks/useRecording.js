import { useState, useCallback } from 'react';

export const useRecording = ({ onTranscribed, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob);

        try {
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Failed to transcribe audio');

          const data = await response.json();
          if (data.error) throw new Error(data.error);

          if (onTranscribed) {
            onTranscribed(data.text);
          }
        } catch (error) {
          if (onError) {
            onError('Failed to transcribe audio: ' + error.message);
          }
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      if (onError) {
        onError('Failed to access microphone: ' + error.message);
      }
    }
  }, [onTranscribed, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};
