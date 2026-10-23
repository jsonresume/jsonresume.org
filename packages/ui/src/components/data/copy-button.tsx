'use client';

import { useEffect, useRef, useState } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { Button, type ButtonProps } from '../button/button';

export interface CopyButtonProps
  extends Omit<ButtonProps, 'onClick' | 'children'> {
  /** Text to copy. */
  value: string;
  label?: string;
  copiedLabel?: string;
  /** Spoken confirmation. */
  announcement?: string;
}

/** Copies a value (a link, an API key) and confirms it. */
export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  announcement = 'Copied to clipboard',
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  return (
    <Button
      {...props}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? copiedLabel : label}
      <span className={visuallyHidden} aria-live="polite">
        {copied ? announcement : ''}
      </span>
    </Button>
  );
}
