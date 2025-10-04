import { useState, useCallback } from 'react';
import { useVoiceSetup } from './useVoiceSetup';
import { createUtterance, speakWithWarmup } from './speechEngine';

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const { supported, selectedVoice, setSelectedVoice, error, setError } =
    useVoiceSetup();

  const speak = useCallback(
    (text) => {
      return new Promise((resolve, reject) => {
        if (!supported || !text) {
          const errorMsg = !supported
            ? 'Speech not supported'
            : 'No text provided';
          console.warn('Cannot speak:', errorMsg);
          reject(new Error(errorMsg));
          return;
        }

        if (!selectedVoice) {
          console.warn('No voice selected yet');
          reject(new Error('No voice selected yet'));
          return;
        }

        try {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();
          console.log('Starting speech with text:', text.substring(0, 100));

          const utterance = createUtterance(text, selectedVoice);

          utterance.onstart = () => {
            console.log('Speech started');
            setSpeaking(true);
          };

          speakWithWarmup(utterance)
            .then(() => {
              setSpeaking(false);
              resolve();
            })
            .catch((err) => {
              setError(`Speech error: ${err.message}`);
              setSpeaking(false);
              reject(err);
            });
        } catch (err) {
          console.error('Speech synthesis error:', err);
          setError(`Speech synthesis error: ${err.message}`);
          setSpeaking(false);
          reject(err);
        }
      });
    },
    [supported, selectedVoice, setError]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    console.log('Stopping speech');
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return {
    speak,
    stop,
    speaking,
    supported,
    selectedVoice,
    setSelectedVoice,
    error,
  };
}
