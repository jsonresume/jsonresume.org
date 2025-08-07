// Render a single part of a chat message.
// Handles plain text and tool invocations (updateResume).
import React from 'react';

export default function Part({ part }) {
  switch (part.type) {
    case 'text':
      return <span>{part.text}</span>;

    case 'tool-invocation': {
      const { toolCallId, toolName, state, input, output } =
        part.toolInvocation;
      if (toolName !== 'updateResume' && toolName !== 'update_resume')
        return null;

      if (state === 'call') {
        return (
          <div
            key={toolCallId}
            className="p-2 rounded-lg bg-green-50 text-green-900 text-xs"
          >
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(input, null, 2)}
            </pre>
          </div>
        );
      }

      if (state === 'result') {
        return (
          <div key={toolCallId} className="p-2 rounded-lg space-y-1">
            {input?.explanation && <span>{input.explanation}</span>}
            {input?.changes && (
              <div className="text-xs bg-green-50 text-green-900">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(input.changes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      }
      return null;
    }
    default:
      return null;
  }
}
