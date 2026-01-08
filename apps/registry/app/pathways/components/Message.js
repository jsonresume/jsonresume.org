'use client';

import { Streamdown } from 'streamdown';
import Part from './Part';

export default function Message({ message, isStreaming = false }) {
  // Handle both content string and parts array
  const renderContent = () => {
    if (message.content) {
      return (
        <Streamdown isAnimating={isStreaming && message.role === 'assistant'}>
          {message.content}
        </Streamdown>
      );
    }
    if (message.parts && Array.isArray(message.parts)) {
      return message.parts.map((part, idx) => (
        <Part key={idx} part={part} isStreaming={isStreaming} />
      ));
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <strong className="capitalize text-xs text-gray-600">{`${message.role}:`}</strong>
      <div className="prose prose-sm prose-gray max-w-none">
        {renderContent()}
      </div>
    </div>
  );
}
