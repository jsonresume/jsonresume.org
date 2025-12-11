'use client';

import { useRef, useEffect } from 'react';
import applyResumeChanges from '../utils/applyResumeChanges';

export default function useResumeUpdater({
  messages,
  resumeData, // Current resume data (needed for merging)
  setResumeData, // updateResume function (takes direct value, NOT functional update)
}) {
  const handledToolCalls = useRef(new Set());
  // Keep a ref to the latest resume data to avoid stale closures
  const resumeDataRef = useRef(resumeData);
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  useEffect(() => {
    console.log(
      '[useResumeUpdater] Processing messages, count:',
      messages.length
    );

    for (const msg of messages) {
      // Log message structure
      console.log('[useResumeUpdater] Message:', {
        id: msg.id,
        role: msg.role,
        partsCount: msg.parts?.length ?? 0,
        partTypes: msg.parts?.map((p) => p.type) ?? [],
      });

      for (const part of msg.parts ?? []) {
        // Log ALL part types
        console.log('[useResumeUpdater] Part type:', part.type, part);

        // AI SDK v6 format: part.type === 'tool-{toolName}'
        // per docs: state is 'output-available' when complete, part.input has args
        if (
          part.type === 'tool-updateResume' &&
          part.state === 'output-available' &&
          !handledToolCalls.current.has(part.toolCallId)
        ) {
          console.log('[useResumeUpdater] v6 tool-updateResume detected!');
          console.log('[useResumeUpdater] Part state:', part.state);
          console.log('[useResumeUpdater] Part input:', part.input);
          const { changes } = part.input ?? {};
          console.log(
            '[useResumeUpdater] Changes received:',
            JSON.stringify(changes, null, 2)
          );

          if (changes && typeof changes === 'object') {
            console.log('[useResumeUpdater] Applying changes to resume...');
            const currentResume = resumeDataRef.current;
            console.log(
              '[useResumeUpdater] Previous resume:',
              JSON.stringify(currentResume, null, 2)
            );
            const updated = applyResumeChanges(currentResume, changes);
            console.log(
              '[useResumeUpdater] Updated resume:',
              JSON.stringify(updated, null, 2)
            );
            // updateResume takes a direct value (not functional update)
            setResumeData(updated);
          } else {
            console.warn('[useResumeUpdater] No valid changes object found');
          }
          handledToolCalls.current.add(part.toolCallId);
        }

        // Fallback: also check 'input-available' state (streaming in progress)
        // This allows processing as soon as input is available
        if (
          part.type === 'tool-updateResume' &&
          part.state === 'input-available' &&
          !handledToolCalls.current.has(part.toolCallId)
        ) {
          console.log(
            '[useResumeUpdater] v6 tool-updateResume input-available!'
          );
          console.log('[useResumeUpdater] Part:', part);
          const { changes } = part.input ?? {};
          console.log(
            '[useResumeUpdater] Changes:',
            JSON.stringify(changes, null, 2)
          );
          if (changes && typeof changes === 'object') {
            console.log('[useResumeUpdater] Applying changes (input-avail)...');
            const currentResume = resumeDataRef.current;
            const updated = applyResumeChanges(currentResume, changes);
            console.log(
              '[useResumeUpdater] Updated resume:',
              JSON.stringify(updated, null, 2)
            );
            // updateResume takes a direct value (not functional update)
            setResumeData(updated);
          }
          // Mark as handled so we don't re-process on output-available
          handledToolCalls.current.add(part.toolCallId);
        }
      }
    }
  }, [messages, setResumeData]);

  return null; // This hook only handles side effects
}
