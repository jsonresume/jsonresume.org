'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import Message from './Message';

export default function Messages({
  messages,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
}) {
  const virtuosoRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);
  const [prependedCount, setPrependedCount] = useState(0);

  // When new messages come in and we're at bottom, stay at bottom
  useEffect(() => {
    if (atBottom && virtuosoRef.current && messages?.length > 0) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: 'smooth',
      });
    }
  }, [messages?.length, atBottom]);

  // Handle reaching the top - load older messages
  const handleStartReached = useCallback(() => {
    if (hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore().then((olderMessages) => {
        if (olderMessages?.length > 0) {
          setPrependedCount((prev) => prev + olderMessages.length);
        }
      });
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Track if user is at bottom
  const handleAtBottomStateChange = useCallback((bottom) => {
    setAtBottom(bottom);
  }, []);

  // Render a single message item
  const itemContent = useCallback((index, message) => {
    return <Message key={message.id} message={message} />;
  }, []);

  // Header component shown when loading more at top
  const Header = useCallback(() => {
    if (isLoadingMore) {
      return (
        <div className="py-2 text-center text-xs text-gray-400">
          Loading older messages...
        </div>
      );
    }
    if (!hasMore && messages?.length > 0) {
      return (
        <div className="py-2 text-center text-xs text-gray-300">
          Start of conversation
        </div>
      );
    }
    return null;
  }, [isLoadingMore, hasMore, messages?.length]);

  // Footer for loading indicator
  const Footer = useCallback(() => {
    if (isLoading) {
      return <p className="text-sm text-gray-500 py-2">Copilot is thinking…</p>;
    }
    return null;
  }, [isLoading]);

  if (!messages || messages.length === 0) {
    return (
      <div className="space-y-3">
        {isLoading && (
          <p className="text-sm text-gray-500">Copilot is thinking…</p>
        )}
      </div>
    );
  }

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={messages}
      firstItemIndex={Math.max(0, 10000 - prependedCount)}
      initialTopMostItemIndex={messages.length - 1}
      itemContent={itemContent}
      startReached={handleStartReached}
      atBottomStateChange={handleAtBottomStateChange}
      atBottomThreshold={50}
      followOutput="smooth"
      components={{
        Header,
        Footer,
      }}
      style={{ height: '100%' }}
      className="space-y-3"
    />
  );
}
