/**
 * Voice loading and selection utilities
 */

import { logger } from '@/lib/logger';

export const findEnglishVoice = (voices) => {
  const englishVoices = voices.filter(
    (voice) => voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB')
  );

  if (englishVoices.length > 0) {
    return englishVoices.find((v) => v.lang === 'en-US') || englishVoices[0];
  }

  return null;
};

export const loadVoices = (onVoiceLoaded) => {
  const availableVoices = window.speechSynthesis.getVoices();

  if (availableVoices.length === 0) {
    logger.warn('No voices available yet, will retry');
    return;
  }

  logger.debug(
    {
      voiceCount: availableVoices.length,
      voices: availableVoices.map((v) => `${v.name} (${v.lang})`),
    },
    'Available voices loaded'
  );

  const selectedVoice = findEnglishVoice(availableVoices);

  if (selectedVoice) {
    logger.info(
      { voiceName: selectedVoice.name, lang: selectedVoice.lang },
      'Selected voice'
    );
    onVoiceLoaded(selectedVoice);
  }
};

export const retryLoadVoices = (onVoiceLoaded) => {
  const retryTimes = [100, 500, 1000, 2000];
  retryTimes.forEach((time) => {
    setTimeout(() => loadVoices(onVoiceLoaded), time);
  });
};
