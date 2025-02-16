import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState(null);
  const speechQueue = useRef([]);
  const isSpeaking = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      console.log('Speech synthesis is supported');
      setSupported(true);
      
      // Keep speech synthesis active
      const intervalId = setInterval(() => {
        if (isSpeaking.current) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 5000);
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
        setVoices(availableVoices);
        
        // Try to find an English voice
        const englishVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB')
        );
        console.log('English voices:', englishVoices.map(v => `${v.name} (${v.lang})`));
        
        if (englishVoices.length > 0) {
          // Prefer US English
          const preferredVoice = englishVoices.find(v => v.lang === 'en-US') || englishVoices[0];
          console.log('Selected voice:', preferredVoice.name);
          setSelectedVoice(preferredVoice);
          setError(null);
        } else if (availableVoices.length > 0) {
          const fallbackVoice = availableVoices[0];
          console.log('Falling back to voice:', fallbackVoice.name);
          setSelectedVoice(fallbackVoice);
          setError('No English voice found, using fallback voice');
        } else {
          console.warn('No voices available');
          setError('No voices available for speech synthesis');
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices changed event fired');
        loadVoices();
      };
      setTimeout(loadVoices, 100);

      return () => {
        clearInterval(intervalId);
        window.speechSynthesis?.cancel();
      };
    } else {
      console.warn('Speech synthesis is not supported');
      setError('Speech synthesis is not supported in this browser');
    }
  }, []);

  // Split text into sentences
  const splitIntoChunks = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.map(sentence => sentence.trim()).filter(Boolean);
  };

  const processNextInQueue = useCallback(() => {
    if (speechQueue.current.length === 0) {
      isSpeaking.current = false;
      setSpeaking(false);
      return;
    }

    const chunk = speechQueue.current[0];
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.voice = selectedVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      speechQueue.current.shift();
      processNextInQueue();
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setError(`Speech error: ${event.error}`);
      speechQueue.current = [];
      isSpeaking.current = false;
      setSpeaking(false);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis error:', err);
      setError(`Speech synthesis error: ${err.message}`);
      speechQueue.current = [];
      isSpeaking.current = false;
      setSpeaking(false);
    }
  }, [selectedVoice]);

  const speak = useCallback((text) => {
    if (!supported || !text) {
      console.warn('Cannot speak:', !supported ? 'Speech not supported' : 'No text provided');
      return;
    }

    if (!selectedVoice) {
      console.warn('No voice selected yet');
      return;
    }

    try {
      // Cancel any ongoing speech and reset state
      console.log('Stopping previous speech');
      window.speechSynthesis.cancel();
      speechQueue.current = [];
      isSpeaking.current = false;
      
      // Split text into sentences and add to queue
      const chunks = splitIntoChunks(text);
      console.log('Speaking chunks:', chunks);
      
      speechQueue.current = chunks;
      isSpeaking.current = true;
      setSpeaking(true);
      
      processNextInQueue();
    } catch (err) {
      console.error('Speech synthesis error:', err);
      setError(`Speech synthesis error: ${err.message}`);
      speechQueue.current = [];
      isSpeaking.current = false;
      setSpeaking(false);
    }
  }, [supported, selectedVoice, processNextInQueue]);

  const stop = useCallback(() => {
    if (!supported) return;
    console.log('Stopping speech');
    window.speechSynthesis.cancel();
    speechQueue.current = [];
    isSpeaking.current = false;
    setSpeaking(false);
  }, [supported]);

  return {
    speak,
    stop,
    speaking,
    supported,
    voices,
    selectedVoice,
    setSelectedVoice,
    error
  };
}
