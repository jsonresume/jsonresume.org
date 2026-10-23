'use client';

import { useState, type ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { Button } from '../button/button';
import { CopyButton } from './copy-button';
import * as s from './data.css';

export interface SecretFieldProps {
  /** The full secret. Only shown when revealed. */
  value: string;
  /** Names the secret for screen readers, e.g. "API key for CI". */
  label: string;
  /** Characters to keep visible at the end while masked. */
  visibleChars?: number;
  /** Extra actions: Rotate, Revoke. */
  actions?: ReactNode;
}

/** A masked secret (an API key) with reveal, copy and room for rotate or revoke. */
export function SecretField({
  value,
  label,
  visibleChars = 4,
  actions,
}: SecretFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const masked = `${'•'.repeat(
    Math.max(8, value.length - visibleChars - 6)
  )}${value.slice(-visibleChars)}`;
  return (
    <div className={s.secret} role="group" aria-label={label}>
      <code className={s.secretValue} aria-hidden={!revealed || undefined}>
        {revealed ? value : masked}
      </code>
      {revealed ? null : (
        <span className={visuallyHidden}>
          Hidden, ends in {value.slice(-visibleChars)}
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setRevealed((r) => !r)}
        aria-pressed={revealed}
      >
        {revealed ? 'Hide' : 'Reveal'}
      </Button>
      <CopyButton value={value} variant="ghost" size="sm" />
      {actions}
    </div>
  );
}
