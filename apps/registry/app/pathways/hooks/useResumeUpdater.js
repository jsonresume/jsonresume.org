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
        // Check for tool-updateResume parts (v5 format)
        if (
          part.type === 'tool-updateResume' &&
          part.state === 'input-available' &&
          !handledToolCalls.current.has(part.toolCallId)
        ) {
          const { changes } = part.input ?? {};
          if (changes && typeof changes === 'object') {
            setResumeData((prev) => applyResumeChanges(prev, changes));
            setResumeJson((prev) =>
              JSON.stringify(
                applyResumeChanges(JSON.parse(prev), changes),
                null,
                2
              )
            );
          }
          addToolResult({
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
