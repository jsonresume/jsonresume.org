import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';

export const MessageList = ({
  messages,
  isLoading,
  speaking,
  onStopSpeaking,
  onApplyChanges,
}) => {
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          speaking={speaking}
          onStopSpeaking={onStopSpeaking}
          onApplyChanges={onApplyChanges}
        />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 p-3 rounded-lg">
            <span className="animate-pulse">Thinking...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
