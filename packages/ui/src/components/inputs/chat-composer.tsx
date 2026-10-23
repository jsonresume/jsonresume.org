'use client';

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { Button } from '../button/button';
import * as s from './inputs.css';

export interface ChatComposerProps {
  onSubmit: (message: string) => void;
  /** While a reply streams: the Send button shows progress and Enter won't send. */
  busy?: boolean;
  placeholder?: string;
  /** Extra controls before Send, e.g. a voice input button. */
  actions?: ReactNode;
  label?: string;
  sendLabel?: string;
  hint?: ReactNode;
}

/** Multi-line message input: Enter sends, Shift+Enter adds a line, and it grows with the text. */
export function ChatComposer({
  onSubmit,
  busy = false,
  placeholder = 'Ask anything about your resume…',
  actions,
  label = 'Message',
  sendLabel = 'Send',
  hint,
}: ChatComposerProps) {
  const [text, setText] = useState('');
  const area = useRef<HTMLTextAreaElement>(null);
  const id = useId();

  // Grow with the content up to the max height set in CSS.
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const send = (e?: FormEvent) => {
    e?.preventDefault();
    const message = text.trim();
    if (!message || busy) return;
    onSubmit(message);
    setText('');
  };

  return (
    <form className={s.composer} onSubmit={send}>
      <label className={visuallyHidden} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        ref={area}
        rows={1}
        className={s.composerInput}
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing)
            send(e);
        }}
      />
      <div className={s.composerActions}>
        {actions}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={busy}
          disabled={!text.trim()}
        >
          {sendLabel}
        </Button>
      </div>
      {hint ? <p className={s.composerHint}>{hint}</p> : null}
    </form>
  );
}
