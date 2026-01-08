/**
 * Part - Renders a single part of a chat message
 * Uses the tool registry for automatic tool UI lookup
 */
import React from 'react';
import { renderToolPart, getToolMeta, ToolCard } from '../../tools';

export default function Part({ part }) {
  if (!part || !part.type) {
    return null;
  }

  // Plain text rendering
  if (part.type === 'text') {
    return <span>{part.text}</span>;
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
