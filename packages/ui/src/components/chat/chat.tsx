'use client';

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import { Avatar } from '../display/display';
import * as s from './chat.css';

export interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** Change this (e.g. message count or streamed length) to keep the view pinned to the newest message. */
  scrollKey?: unknown;
}

/**
 * The conversation log. New messages are announced politely, and the view
 * follows new content only while the reader is already at the bottom.
 */
export function ChatMessages({
  label = 'Conversation',
  scrollKey,
  className,
  children,
  ...props
}: ChatMessagesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  useEffect(() => {
    const el = ref.current;
    if (el && pinned.current) el.scrollTop = el.scrollHeight;
  }, [scrollKey]);
  return (
    <div
      ref={ref}
      role="log"
      aria-label={label}
      aria-live="polite"
      className={cx(s.log, className)}
      onScroll={(e) => {
        const el = e.currentTarget;
        pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  /** Shown above the message and to screen readers ("You", "Copilot"). */
  author?: string;
  avatarUrl?: string | null;
  /** Show a typing indicator (no content yet). */
  pending?: boolean;
  children?: ReactNode;
}

/** One turn: the user's message, an assistant reply (use Markdown for its text), or a system note. */
export function ChatMessage({
  role,
  author,
  avatarUrl,
  pending = false,
  children,
}: ChatMessageProps) {
  const name =
    author ??
    (role === 'user' ? 'You' : role === 'assistant' ? 'Assistant' : 'System');
  return (
    <article className={s.message({ role })} aria-label={`${name} said`}>
      {role === 'system' ? null : (
        <Avatar name={name} src={avatarUrl} size="sm" shape="circle" alt="" />
      )}
      <div className={s.bubble({ role })}>
        {role === 'system' ? null : <span className={s.author}>{name}</span>}
        {pending ? (
          <span className={s.typing}>
            <span className={s.typingDot} />
            <span className={s.typingDot} />
            <span className={s.typingDot} />
            <span className={visuallyHidden}>{name} is typing</span>
          </span>
        ) : (
          children
        )}
      </div>
    </article>
  );
}

export interface ChatToolCallProps {
  /** The tool's name, e.g. update_resume. */
  name: string;
  status: 'running' | 'done' | 'error';
  /** A one-line summary of what it did. */
  summary?: ReactNode;
  /** Input or output, shown when expanded. */
  details?: string;
}

const statusLabel = {
  running: 'Running',
  done: 'Done',
  error: 'Failed',
} as const;

/** A tool call inside an assistant message, expandable to show its details. */
export function ChatToolCall({
  name,
  status,
  summary,
  details,
}: ChatToolCallProps) {
  return (
    <details className={s.tool}>
      <summary className={s.toolSummary}>
        <span aria-hidden="true">
          {status === 'running' ? '⋯' : status === 'done' ? '✓' : '✕'}
        </span>
        <span className={s.toolName}>{name}</span>
        <span>· {statusLabel[status]}</span>
        {summary ? <span>· {summary}</span> : null}
      </summary>
      {details ? <pre className={s.toolBody}>{details}</pre> : null}
    </details>
  );
}
