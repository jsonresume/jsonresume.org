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

        // Log all parts for debugging
        if (part.type === 'tool-invocation') {
          console.log(
            '[useResumeUpdater] Found tool-invocation part:',
            JSON.stringify(
              {
                toolName: part.toolInvocation?.toolName,
                state: part.toolInvocation?.state,
                toolCallId: part.toolInvocation?.toolCallId,
                argsKeys: Object.keys(part.toolInvocation?.args || {}),
              },
              null,
              2
            )
          );
        }

        // AI SDK v6 format: tool-invocation with toolName
        if (
          part.type === 'tool-invocation' &&
          part.toolInvocation?.toolName === 'updateResume' &&
          part.toolInvocation?.state === 'result' &&
          !handledToolCalls.current.has(part.toolInvocation?.toolCallId)
        ) {
          const { changes } = part.toolInvocation?.args ?? {};
          console.log('[useResumeUpdater] updateResume detected!');
          console.log(
            '[useResumeUpdater] Changes received:',
            JSON.stringify(changes, null, 2)
          );
          console.log(
            '[useResumeUpdater] Changes keys:',
            Object.keys(changes || {})
          );

          if (changes && typeof changes === 'object') {
            console.log('[useResumeUpdater] Applying changes to resume...');
            setResumeData((prev) => {
              console.log(
                '[useResumeUpdater] Previous resume:',
                JSON.stringify(prev, null, 2)
              );
              const updated = applyResumeChanges(prev, changes);
              console.log(
                '[useResumeUpdater] Updated resume:',
                JSON.stringify(updated, null, 2)
              );
              return updated;
            });
            setResumeJson((prev) => {
              try {
                const prevObj = JSON.parse(prev);
                const updated = applyResumeChanges(prevObj, changes);
                console.log('[useResumeUpdater] Updated JSON resume');
                return JSON.stringify(updated, null, 2);
              } catch (e) {
                console.error('[useResumeUpdater] Error updating JSON:', e);
                return prev;
              }
            });
          } else {
            console.warn('[useResumeUpdater] No valid changes object found');
          }
          handledToolCalls.current.add(part.toolInvocation.toolCallId);
        }

        // Also check for legacy format (tool-updateResume)
        if (
          part.type === 'tool-updateResume' &&
          part.state === 'input-available' &&
          !handledToolCalls.current.has(part.toolCallId)
        ) {
          console.log('[useResumeUpdater] LEGACY format detected!');
          console.log('[useResumeUpdater] Legacy part:', part);
          const { changes } = part.input ?? {};
          console.log(
            '[useResumeUpdater] Legacy changes:',
            JSON.stringify(changes, null, 2)
          );
          if (changes && typeof changes === 'object') {
            console.log('[useResumeUpdater] LEGACY: Applying changes...');
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
