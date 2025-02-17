import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@repo/ui';
import { Send, Mic, MicOff } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

const AIChatEditor = ({ resume, onResumeChange, onApplyChanges }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const { speak, stop, speaking } = useSpeech();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addSystemMessage = useCallback((content, type = 'info') => {
    const systemMessage = {
      role: 'system',
      content,
      type,
      id: Date.now()
    };
    setMessages(prev => [...prev, systemMessage]);
  }, []);

  const handleSubmitMessage = async (message) => {
    try {
      setIsLoading(true);
      const newUserMessage = {
        role: 'user',
        content: message,
        id: Date.now()
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          currentResume: resume
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        id: Date.now(),
        suggestedChanges: data.suggestedChanges
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Log suggested changes
      if (data.suggestedChanges) {
        console.log('Received suggested changes:', data.suggestedChanges);
        onResumeChange(data.suggestedChanges);
      }

      // Speak the assistant's message if it's not just suggesting changes
      if (!data.suggestedChanges) {
        try {
          await speak(data.message);
        } catch (err) {
          console.error('Error during speech:', err);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      addSystemMessage(error.message || 'Failed to process message', 'error');
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  const handleApplyChanges = useCallback((changes, messageId) => {
    console.log('Applying changes...', changes);
    if (!changes) {
      console.log('No changes to apply');
      return;
    }
    
    if (onApplyChanges) {
      try {
        onApplyChanges(changes);
        console.log('Changes applied successfully');
        addSystemMessage('✅ Changes have been successfully applied to your resume', 'success');
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, changesApplied: true } : msg
        ));
      } catch (error) {
        console.error('Error applying changes:', error);
        addSystemMessage('❌ Failed to apply changes: ' + error.message, 'error');
      }
    } else {
      console.warn('onApplyChanges callback is not defined');
      addSystemMessage('❌ Unable to apply changes: System not configured properly', 'error');
    }
  }, [onApplyChanges, addSystemMessage]);

  const startRecording = async () => {
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
          setIsLoading(true);
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Failed to transcribe audio');
          
          const data = await response.json();
          if (data.error) throw new Error(data.error);
          
          setInputMessage(data.text);
        } catch (error) {
          console.error('Transcription error:', error);
          addSystemMessage('Failed to transcribe audio: ' + error.message, 'error');
        } finally {
          setIsLoading(false);
        }

        // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      addSystemMessage('Failed to access microphone: ' + error.message, 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' 
                ? 'justify-end' 
                : message.role === 'system'
                  ? 'justify-center'
                  : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.role === 'system'
                    ? message.type === 'error'
                      ? 'bg-red-100 text-red-700'
                      : message.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.role === 'assistant' && message.suggestedChanges && (
                <div className="mt-2">
                  <pre className="bg-gray-800 text-white p-3 rounded-lg overflow-x-auto my-2 text-sm">
                    {JSON.stringify(message.suggestedChanges, null, 2)}
                  </pre>
                  <Button
                    onClick={() => handleApplyChanges(message.suggestedChanges, message.id)}
                    disabled={message.changesApplied}
                    className={`
                      w-full text-center py-2 px-4 rounded
                      ${message.changesApplied 
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'}
                    `}
                  >
                    {message.changesApplied ? '✓ Changes Applied' : 'Apply Changes'}
                  </Button>
                </div>
              )}
              {message.role === 'assistant' && speaking && (
                <button
                  onClick={stop}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Stop Speaking
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitMessage(inputMessage)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
          />
          <Button
            onClick={() => handleSubmitMessage(inputMessage)}
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatEditor;
