import { useEffect, useRef } from 'react';
import Message from './Message';

export default function Messages({ messages, isLoading }) {
  const listRef = useRef(null);
  const autoScrollRef = useRef(true);

  // Scroll handler to detect user interaction
  useEffect(() => {
    const container = listRef.current?.parentElement;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 20; // px from bottom considered as "at bottom"
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <=
        threshold;
      autoScrollRef.current = atBottom;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    const container = listRef.current?.parentElement;
    if (container && autoScrollRef.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);
  return (
    <div ref={listRef} className="space-y-3">
      {messages?.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      {isLoading && (
        <p className="text-sm text-gray-500">Copilot is thinking…</p>
      )}
    </div>
  );
}
