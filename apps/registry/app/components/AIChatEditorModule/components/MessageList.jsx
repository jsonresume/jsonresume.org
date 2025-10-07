import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@repo/ui';

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
      const viewport = chatContainerRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <ScrollArea ref={chatContainerRef} className="flex-1 p-4">
      <div className="space-y-4">
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
    </ScrollArea>
  );
};
