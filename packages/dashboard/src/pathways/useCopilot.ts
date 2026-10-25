import type { CopilotEvent, CopilotMessage } from '@repo/api';
import { Effect, Fiber, Stream } from 'effect';
import { useEffect, useRef, useState } from 'react';
import { reply } from './stream';

export interface ToolUse {
  id: string;
  name: string;
  status: 'running' | 'done' | 'error';
}

export interface Turn {
  role: 'user' | 'assistant';
  text: string;
  tools: ToolUse[];
  /** The reply is still coming. */
  streaming?: boolean;
  error?: string;
}

const storageKey = (username: string) => `pathways:${username}`;

const load = (username: string): Turn[] => {
  try {
    const saved = localStorage.getItem(storageKey(username));
    return saved ? (JSON.parse(saved) as Turn[]) : [];
  } catch {
    return [];
  }
};

const apply = (turn: Turn, event: CopilotEvent): Turn => {
  switch (event.type) {
    case 'text':
      return { ...turn, text: turn.text + event.delta };
    case 'tool': {
      const others = turn.tools.filter((t) => t.id !== event.id);
      const { id, name, status } = event;
      return { ...turn, tools: [...others, { id, name, status }] };
    }
    case 'done':
      return { ...turn, streaming: false };
    case 'error':
      return { ...turn, streaming: false, error: event.message };
  }
};

/**
 * A conversation with the copilot, kept in this browser per user: send a
 * message, watch the reply stream in, stop it, or start over.
 */
export function useCopilot(username: string) {
  // Dashboard pages render in the browser only, so storage is there.
  const [turns, setTurns] = useState<Turn[]>(() => load(username));
  const running = useRef<Fiber.Fiber<void> | undefined>(undefined);
  useEffect(() => {
    if (turns.some((t) => t.streaming)) return;
    try {
      localStorage.setItem(
        storageKey(username),
        JSON.stringify(turns.slice(-60))
      );
    } catch {
      // Private browsing: the conversation just isn't kept.
    }
  }, [turns, username]);

  const updateLast = (f: (turn: Turn) => Turn) =>
    setTurns((all) => [...all.slice(0, -1), f(all[all.length - 1] as Turn)]);

  const send = (text: string) => {
    if (!text.trim() || running.current) return;
    const history: CopilotMessage[] = [
      ...turns
        .filter((t) => t.text && !t.error)
        .map((t) => ({ role: t.role, content: t.text })),
      { role: 'user', content: text },
    ];
    setTurns((all) => [
      ...all,
      { role: 'user', text, tools: [] },
      { role: 'assistant', text: '', tools: [], streaming: true },
    ]);
    running.current = Effect.runFork(
      reply(history).pipe(
        Stream.runForEach((event) =>
          Effect.sync(() => updateLast((turn) => apply(turn, event)))
        ),
        Effect.ensuring(
          Effect.sync(() => {
            running.current = undefined;
            updateLast((turn) => ({ ...turn, streaming: false }));
          })
        )
      )
    );
  };

  const stop = () => {
    if (running.current) Effect.runFork(Fiber.interrupt(running.current));
  };

  const reset = () => {
    stop();
    setTurns([]);
  };

  return {
    turns,
    send,
    stop,
    reset,
    busy: turns.some((t) => t.streaming),
  };
}
