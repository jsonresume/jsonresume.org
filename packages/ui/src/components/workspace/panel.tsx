'use client';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as s from './workspace.css';

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /** Controls in the header (close, more). */
  actions?: ReactNode;
  /** Sticky footer, e.g. Apply / Cancel. */
  footer?: ReactNode;
  /** Bound the panel's height (any CSS length); the body scrolls. */
  maxHeight?: string;
  headingLevel?: 2 | 3 | 4;
}

/** A bounded work area: header with actions, scrolling body, footer with actions. */
export function Panel({
  title,
  actions,
  footer,
  maxHeight,
  headingLevel = 2,
  className,
  style,
  children,
  ...props
}: PanelProps) {
  const id = useId();
  const Heading = `h${headingLevel}` as const;
  return (
    <section
      aria-labelledby={id}
      className={cx(s.panel, className)}
      style={
        maxHeight
          ? { ...assignInlineVars({ [s.panelHeight]: maxHeight }), ...style }
          : style
      }
      {...props}
    >
      <div className={s.panelHeader}>
        <Heading id={id} className={s.panelTitle}>
          {title}
        </Heading>
        {actions ? <div className={s.panelActions}>{actions}</div> : null}
      </div>
      <div className={s.panelBody}>{children}</div>
      {footer ? <div className={s.panelFooter}>{footer}</div> : null}
    </section>
  );
}
