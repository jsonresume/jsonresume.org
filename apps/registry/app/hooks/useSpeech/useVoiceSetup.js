import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { loadVoices, retryLoadVoices } from './voiceLoader';

export const useVoiceSetup = () => {
  const [supported, setSupported] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      logger.info('Speech synthesis is supported');
      setSupported(true);

      const handleVoiceLoaded = (voice) => {
        setSelectedVoice(voice);
        setError(null);
      };

      // Try loading voices multiple times to handle Chrome's async loading
      loadVoices(handleVoiceLoaded);
      window.speechSynthesis.onvoiceschanged = () =>
        loadVoices(handleVoiceLoaded);
      retryLoadVoices(handleVoiceLoaded);

      return () => {
        window.speechSynthesis?.cancel();
      };
    } else {
      logger.warn('Speech synthesis is not supported');
      setError('Speech synthesis is not supported in this browser');
    }
  }, []);

  return {
    supported,
    selectedVoice,
    setSelectedVoice,
    error,
    setError,
  };
};
