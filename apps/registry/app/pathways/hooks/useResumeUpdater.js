'use client';

import { useRef, useEffect } from 'react';
import applyResumeChanges from '../utils/applyResumeChanges';

/**
 * Hook to handle resume updates from AI tool invocations.
 *
 * IMPORTANT: setResumeData is `updateResume` from PathwaysContext which expects
 * a direct value, NOT a functional update like React's setState.
 * We use a ref to track the latest resumeData to avoid stale closures.
 */
export default function useResumeUpdater({
  messages,
  resumeData,
  setResumeData,
  saveResumeChanges,
}) {
  const handledToolCalls = useRef(new Set());
  // Keep a ref to the latest resume data to avoid stale closures
  const resumeDataRef = useRef(resumeData);
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  useEffect(() => {
    for (const msg of messages) {
      for (const part of msg.parts ?? []) {
        // AI SDK v6 format: part.type === 'tool-{toolName}'
        // State is 'output-available' when complete, 'input-available' during streaming
        if (
          part.type === 'tool-updateResume' &&
          (part.state === 'output-available' ||
            part.state === 'input-available') &&
          !handledToolCalls.current.has(part.toolCallId)
        ) {
          const { changes, explanation } = part.input ?? {};

          if (changes && typeof changes === 'object') {
            const currentResume = resumeDataRef.current;
            const updated = applyResumeChanges(currentResume, changes);
            // updateResume takes a direct value (not functional update)
            setResumeData(updated);

            // Persist to database with history
            if (saveResumeChanges) {
              saveResumeChanges(changes, explanation, 'ai_update').catch(
                (err) => console.error('Failed to persist resume changes:', err)
              );
            }
          }
          handledToolCalls.current.add(part.toolCallId);
        }
      }
    }
  }, [messages, setResumeData, saveResumeChanges]);

  return null;
}
