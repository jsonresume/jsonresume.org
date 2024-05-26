'use client';
import React, { useState, useEffect } from 'react';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const ChatBot = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      console.log({ event });
      const interimTranscript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(interimTranscript);
    };

    recognition.onend = () => {
      console.log('recognition stopped listening');
      setIsListening(false);
    };
  }, []);

  console.log("why it on't listen");

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  const handleSend = async () => {
    if (transcript) {
      // Send the transcription to OpenAI
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcript }),
      });
      const data = await response.json();
      console.log(data); // Handle the response from
    }
  };

  return (
    <div>
      <h1>Chat Bot</h1>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p>Transcript: {transcript}</p>
      <button onClick={handleSend} disabled={!transcript}>
        Send to OpenAI
      </button>
    </div>
  );
};

export default ChatBot;
