'use client';

import { useRef, useEffect } from 'react';
import applyResumeChanges from '../utils/applyResumeChanges';

export default function useResumeUpdater({
  messages,
  addToolResult,
  setResumeData,
  setResumeJson,
}) {
  const handledToolCalls = useRef(new Set());

  useEffect(() => {
    for (const msg of messages) {
      for (const part of msg.parts ?? []) {
        // AI SDK v6 format: tool-invocation with toolName
        if (
          part.type === 'tool-invocation' &&
          part.toolInvocation?.toolName === 'updateResume' &&
          part.toolInvocation?.state === 'result' &&
          !handledToolCalls.current.has(part.toolInvocation?.toolCallId)
        ) {
          const { changes } = part.toolInvocation?.args ?? {};
          if (changes && typeof changes === 'object') {
            setResumeData((prev) => applyResumeChanges(prev, changes));
            setResumeJson((prev) => {
              try {
                return JSON.stringify(
                  applyResumeChanges(JSON.parse(prev), changes),
                  null,
                  2
                );
              } catch {
                return prev;
              }
            });
          }
          handledToolCalls.current.add(part.toolInvocation.toolCallId);
        }

        // Also check for legacy format (tool-updateResume)
        if (
          part.type === 'tool-updateResume' &&
          part.state === 'input-available' &&
          !handledToolCalls.current.has(part.toolCallId)
        ) {
          const { changes } = part.input ?? {};
          if (changes && typeof changes === 'object') {
            setResumeData((prev) => applyResumeChanges(prev, changes));
            setResumeJson((prev) => {
              try {
                return JSON.stringify(
                  applyResumeChanges(JSON.parse(prev), changes),
                  null,
                  2
                );
              } catch {
                return prev;
              }
            });
          }
          addToolResult?.({
            toolCallId: part.toolCallId,
            result: 'Changes applied',
          });
          handledToolCalls.current.add(part.toolCallId);
        }
      }
    }
  }, [messages, addToolResult, setResumeData, setResumeJson]);

  return null; // This hook only handles side effects
}
