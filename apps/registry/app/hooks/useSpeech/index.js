import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
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
          logger.warn({ errorMsg, supported, hasText: !!text }, 'Cannot speak');
          reject(new Error(errorMsg));
          return;
        }

        if (!selectedVoice) {
          logger.warn({ supported }, 'No voice selected yet');
          reject(new Error('No voice selected yet'));
          return;
        }

        try {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();
          logger.info(
            {
              textPreview: text.substring(0, 100),
              voiceName: selectedVoice.name,
            },
            'Starting speech'
          );

          const utterance = createUtterance(text, selectedVoice);

          utterance.onstart = () => {
            logger.debug('Speech started');
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
          logger.error({ error: err.message }, 'Speech synthesis error');
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
    logger.info('Stopping speech');
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
