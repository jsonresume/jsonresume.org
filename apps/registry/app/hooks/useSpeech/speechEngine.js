/**
 * Core speech synthesis engine
 */

import { logger } from '@/lib/logger';

const UTTERANCE_CONFIG = {
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
};

export const createUtterance = (text, voice) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.rate = UTTERANCE_CONFIG.rate;
  utterance.pitch = UTTERANCE_CONFIG.pitch;
  utterance.volume = UTTERANCE_CONFIG.volume;
  return utterance;
};

export const speakWithWarmup = (utterance) => {
  return new Promise((resolve, reject) => {
    // Chrome workaround: speak a short text first
    const warmup = new SpeechSynthesisUtterance('');
    warmup.volume = 0;

    warmup.onend = () => {
      logger.debug('Warmup ended, starting main speech');

      utterance.onend = () => {
        logger.debug('Speech ended normally');
        resolve();
      };

      utterance.onerror = (event) => {
        logger.error({ error: event.error }, 'Speech error occurred');
        reject(new Error(`Speech error: ${event.error}`));
      };

      window.speechSynthesis.speak(utterance);
    };

    window.speechSynthesis.speak(warmup);
  });
};
