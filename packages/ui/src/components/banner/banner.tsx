'use client';

import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import { Button } from '../button/button';
import { Container } from '../layout/layout';
import * as s from './banner.css';

export interface BannerProps extends HTMLAttributes<HTMLElement> {
  tone?: 'brand' | 'info' | 'warning' | 'neutral';
  /** Call to action, e.g. a Sign in button. */
  action?: ReactNode;
  /** Show a dismiss button. Pair with onDismiss to remember the choice. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Names the banner region for screen readers. */
  label?: string;
  dismissLabel?: string;
}

/** A page-wide notice above the content, e.g. "You're viewing a public dashboard". */
export function Banner({
  tone,
  action,
  dismissible = false,
  onDismiss,
  label = 'Notice',
  dismissLabel = 'Dismiss',
  className,
  children,
  ...props
}: BannerProps) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <section
      aria-label={label}
      className={cx(s.banner({ tone }), className)}
      {...props}
    >
      <Container className={s.inner}>
        <div className={s.content}>{children}</div>
        {action || dismissible ? (
          <div className={s.actions}>
            {action}
            {dismissible ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setOpen(false);
                  onDismiss?.();
                }}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="m4 4 8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <span className={visuallyHidden}>{dismissLabel}</span>
              </Button>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
