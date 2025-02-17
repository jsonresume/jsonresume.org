import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      console.log('Speech synthesis is supported');
      setSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
        
        if (availableVoices.length === 0) {
          console.warn('No voices available yet, will retry');
          return;
        }

        // Try to find an English voice
        const englishVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB')
        );
        console.log('English voices:', englishVoices.map(v => `${v.name} (${v.lang})`));
        
        if (englishVoices.length > 0) {
          const preferredVoice = englishVoices.find(v => v.lang === 'en-US') || englishVoices[0];
          console.log('Selected voice:', preferredVoice.name);
          setSelectedVoice(preferredVoice);
          setError(null);
        }
      };

      // Try loading voices multiple times to handle Chrome's async loading
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Retry a few times if voices aren't available immediately
      const retryTimes = [100, 500, 1000, 2000];
      retryTimes.forEach(time => {
        setTimeout(loadVoices, time);
      });

      return () => {
        window.speechSynthesis?.cancel();
      };
    } else {
      console.warn('Speech synthesis is not supported');
      setError('Speech synthesis is not supported in this browser');
    }
  }, []);

  const speak = useCallback((text) => {
    return new Promise((resolve, reject) => {
      if (!supported || !text) {
        console.warn('Cannot speak:', !supported ? 'Speech not supported' : 'No text provided');
        reject(new Error(!supported ? 'Speech not supported' : 'No text provided'));
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
        
        // Create utterance with full text
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          console.log('Speech started');
          setSpeaking(true);
        };

        utterance.onend = () => {
          console.log('Speech ended normally');
          setSpeaking(false);
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('Speech error occurred:', event);
          setError(`Speech error: ${event.error}`);
          setSpeaking(false);
          reject(new Error(`Speech error: ${event.error}`));
        };

        // Chrome workaround: speak a short text first
        const warmup = new SpeechSynthesisUtterance('');
        warmup.volume = 0;
        warmup.onend = () => {
          console.log('Warmup ended, starting main speech');
          window.speechSynthesis.speak(utterance);
        };
        window.speechSynthesis.speak(warmup);

      } catch (err) {
        console.error('Speech synthesis error:', err);
        setError(`Speech synthesis error: ${err.message}`);
        setSpeaking(false);
        reject(err);
      }
    });
  }, [supported, selectedVoice]);

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
    error
  };
}
