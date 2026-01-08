/**
 * Part - Renders a single part of a chat message
 * Uses the tool registry for automatic tool UI lookup
 */
'use client';

import React from 'react';
import { Streamdown } from 'streamdown';
import { renderToolPart, getToolMeta, ToolCard } from '../../tools';

export default function Part({ part, isStreaming = false }) {
  if (!part || !part.type) {
    return null;
  }

  // Plain text rendering with markdown support
  if (part.type === 'text') {
    return <Streamdown isAnimating={isStreaming}>{part.text}</Streamdown>;
  }

  // Step indicators (silent)
  if (part.type === 'step-start' || part.type === 'step-finish') {
    return null;
  }

  // Tool parts: type === 'tool-{toolName}'
  if (part.type.startsWith('tool-')) {
    const toolName = part.type.replace('tool-', '');

    // Show loading state for 'call' state
    if (part.state === 'call') {
      const meta = getToolMeta(toolName);
      return (
        <ToolCard
          icon={meta.icon}
          title={meta.processingMessage}
          color="gray"
          state="call"
        />
      );
    }

    // Render using the tool UI registry
    return renderToolPart(toolName, part);
  }

  // Unknown part types
  return null;
}
