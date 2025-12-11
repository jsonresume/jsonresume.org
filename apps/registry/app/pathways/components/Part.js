// Render a single part of a chat message.
// Handles plain text and tool invocations (updateResume, job tools).
import React from 'react';

export default function Part({ part }) {
  if (!part || !part.type) {
    return null;
  }

  switch (part.type) {
    case 'text':
      return <span>{part.text}</span>;

    // AI SDK v6 tool format - tool-invocation with toolInvocation object
    case 'tool-invocation': {
      const { toolInvocation } = part;
      if (!toolInvocation) return null;

      const { toolName, args, state, result } = toolInvocation;

      // Don't show while still calling
      if (state === 'call') {
        return (
          <div className="p-2 rounded-lg bg-gray-50 text-gray-600 text-xs">
            <div className="font-semibold">⏳ Calling {toolName}...</div>
          </div>
        );
      }

      // Handle updateResume tool
      if (toolName === 'updateResume') {
        return (
          <div className="p-2 rounded-lg bg-blue-50 text-blue-900 text-xs space-y-2">
            <div className="font-semibold">📝 Updating resume...</div>
            {args?.explanation && (
              <div className="text-sm">{args.explanation}</div>
            )}
            {args?.changes && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-medium">
                  View changes
                </summary>
                <pre className="whitespace-pre-wrap break-words bg-white/50 p-2 rounded mt-1 text-xs">
                  {JSON.stringify(args.changes, null, 2)}
                </pre>
              </details>
            )}
            {state === 'result' && result?.success && (
              <div className="text-green-700 font-medium mt-2">
                ✓ {result.message || 'Changes applied'}
              </div>
            )}
          </div>
        );
      }

      // Handle job tools
      if (toolName === 'filterJobs') {
        return (
          <div className="p-2 rounded-lg bg-purple-50 text-purple-900 text-xs space-y-2">
            <div className="font-semibold">🔍 Filtering jobs...</div>
            {args?.criteria && (
              <div className="text-sm">Action: {args.action || 'filter'}</div>
            )}
            {state === 'result' && result?.success && (
              <div className="text-green-700 font-medium mt-2">
                ✓ Filter applied
              </div>
            )}
          </div>
        );
      }

      if (toolName === 'showJobs') {
        return (
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-900 text-xs space-y-2">
            <div className="font-semibold">👁️ Showing jobs...</div>
            {args?.query && (
              <div className="text-sm">Query: "{args.query}"</div>
            )}
            {state === 'result' && (
              <div className="text-green-700 font-medium mt-2">
                ✓ Jobs filtered
              </div>
            )}
          </div>
        );
      }

      if (toolName === 'getJobInsights') {
        return (
          <div className="p-2 rounded-lg bg-amber-50 text-amber-900 text-xs space-y-2">
            <div className="font-semibold">📊 Getting job insights...</div>
            {args?.insightType && (
              <div className="text-sm">Type: {args.insightType}</div>
            )}
            {state === 'result' && result?.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-medium">
                  View insights
                </summary>
                <pre className="whitespace-pre-wrap break-words bg-white/50 p-2 rounded mt-1 text-xs">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        );
      }

      if (toolName === 'refreshJobMatches') {
        return (
          <div className="p-2 rounded-lg bg-green-50 text-green-900 text-xs space-y-2">
            <div className="font-semibold">🔄 Refreshing job matches...</div>
            {state === 'result' && (
              <div className="text-green-700 font-medium mt-2">
                ✓ Graph refreshed
              </div>
            )}
          </div>
        );
      }

      // Generic tool display for unknown tools
      return (
        <div className="p-2 rounded-lg bg-gray-50 text-gray-600 text-xs">
          <div className="font-semibold">🔧 {toolName}</div>
          {state === 'result' && (
            <div className="text-green-700 font-medium mt-2">✓ Complete</div>
          )}
        </div>
      );
    }

    // AI SDK v5 tool format - tool-updateResume (legacy support)
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
              ✓{' '}
              {typeof part.output === 'string'
                ? part.output
                : 'Changes applied'}
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
