'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@repo/ui';
import { Mic, MicOff, Send } from 'lucide-react';

const AIChatEditor = ({ resume, onResumeChange, onApplyChanges }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [appliedChanges, setAppliedChanges] = useState(new Set());
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm; codecs=opus' });
        setIsProcessing(true);

        try {
          // First, transcribe the audio
          const formData = new FormData();
          // Create a File object from the Blob with a specific name
          const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm; codecs=opus' });
          formData.append('audio', audioFile);

          const transcribeResponse = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          const transcribeData = await transcribeResponse.json();

          if (!transcribeResponse.ok) {
            throw new Error(transcribeData.details || transcribeData.error || 'Failed to transcribe audio');
          }

          // Show transcribed text as user message
          const userMessage = {
            role: 'user',
            content: transcribeData.text,
            id: Date.now().toString()
          };

          setMessages(prev => [...prev, {
            role: 'user',
            content: `🎤 "${transcribeData.text}"`,
            id: Date.now().toString()
          }]);

          const chatResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [...messages, userMessage],
              currentResume: resume,
            }),
          });

          const chatData = await chatResponse.json();

          if (!chatResponse.ok) {
            throw new Error(chatData.error || 'Failed to process message');
          }

          setMessages(prev => [...prev, {
            role: 'assistant',
            content: chatData.message,
            suggestedChanges: chatData.suggestedChanges,
            id: (Date.now() + 1).toString()
          }]);
        } catch (error) {
          console.error('Error processing audio:', error);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Sorry, there was an error processing your audio message: ${error.message}`,
            id: (Date.now() + 1).toString()
          }]);
        } finally {
          setIsProcessing(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please make sure you have granted microphone permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleApplyChanges = useCallback((changes, messageId) => {
    onApplyChanges(changes);
    setAppliedChanges(prev => new Set([...prev, messageId]));
  }, [onApplyChanges]);

  const handleRejectChanges = useCallback((changes, messageId) => {
    setAppliedChanges(prev => new Set([...prev, messageId]));
  }, []);

  const isChangeApplied = useCallback((messageId) => {
    return appliedChanges.has(messageId);
  }, [appliedChanges]);

  const handleSubmit = async () => {
    if (!inputText.trim() && !isRecording) return;

    const userMessage = {
      role: 'user',
      content: inputText,
      id: Date.now().toString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentResume: resume,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          suggestedChanges: data.suggestedChanges,
          id: (Date.now() + 1).toString()
        }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        id: (Date.now() + 1).toString()
      }]);
    }

    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.suggestedChanges && Object.keys(message.suggestedChanges).length > 0 && (
                <div className="mt-2">
                  <pre className="bg-gray-800 text-white p-2 rounded overflow-x-auto">
                    {JSON.stringify(message.suggestedChanges, null, 2)}
                  </pre>
                  <div className="mt-2 flex space-x-2">
                    <Button
                      onClick={() => handleApplyChanges(message.suggestedChanges, message.id)}
                      disabled={isChangeApplied(message.id)}
                      className={isChangeApplied(message.id) ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {isChangeApplied(message.id) ? 'Applied' : 'Apply Changes'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleRejectChanges(message.suggestedChanges, message.id)}
                      disabled={isChangeApplied(message.id)}
                      className={isChangeApplied(message.id) ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {isChangeApplied(message.id) ? 'Rejected' : 'Reject'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              Processing...
            </div>
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message or use the microphone..."
            className="flex-1 p-2 border rounded-lg resize-none"
            rows={2}
          />
          <div className="flex flex-col space-y-2">
            <Button
              variant={isRecording ? 'destructive' : 'outline'}
              onClick={() => {
                if (isRecording) {
                  handleStopRecording();
                } else {
                  handleStartRecording();
                }
              }}
            >
              {isRecording ? <MicOff /> : <Mic />}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!inputText.trim() && !isRecording || isProcessing}
            >
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatEditor;
