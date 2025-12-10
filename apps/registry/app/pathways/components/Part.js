// Render a single part of a chat message.
// Handles plain text and tool invocations (updateResume).
import React from 'react';

export default function Part({ part }) {
  if (!part || !part.type) {
    return null;
  }

  switch (part.type) {
    case 'text':
      return <span>{part.text}</span>;

    // AI SDK v5 tool format - tool-updateResume
    case 'tool-updateResume': {
      // Only show when input is available (not while streaming)
      if (
        part.state !== 'input-available' &&
        part.state !== 'output-available'
      ) {
        return null;
      }

      const { input } = part;
      return (
        <div className="p-2 rounded-lg bg-blue-50 text-blue-900 text-xs space-y-2">
          <div className="font-semibold">📝 Updating resume...</div>
          {input?.explanation && (
            <div className="text-sm">{input.explanation}</div>
          )}
          {input?.changes && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-medium">
                View changes
              </summary>
              <pre className="whitespace-pre-wrap break-words bg-white/50 p-2 rounded mt-1 text-xs">
                {JSON.stringify(input.changes, null, 2)}
              </pre>
            </details>
          )}
          {part.state === 'output-available' && part.output && (
            <div className="text-green-700 font-medium mt-2">
              ✓ {part.output}
            </div>
          )}
        </div>
      );
    }

    // Handle step indicators
    case 'step-start':
    case 'step-finish':
      return null; // Don't render step indicators

    default:
      return null;
  }
}
