'use client';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  Children,
  Fragment,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './workspace.css';

export interface SplitViewProps extends HTMLAttributes<HTMLDivElement> {
  /** Two or more panes. */
  children: ReactNode;
  /** Starting sizes in percent, one per pane (defaults to equal). */
  defaultSizes?: number[];
  /** Smallest size of any pane, in percent. */
  minSize?: number;
  /** Names for the panes, used to label the separators ("Resize Editor and Preview"). */
  paneLabels?: string[];
  onSizesChange?: (sizes: number[]) => void;
}

/**
 * Resizable panes side by side (stacked on small screens). Separators follow
 * the ARIA window-splitter pattern: focusable, arrow keys resize, Home/End
 * collapse to the minimum.
 */
export function SplitView({
  children,
  defaultSizes,
  minSize = 15,
  paneLabels = [],
  onSizesChange,
  className,
  ...props
}: SplitViewProps) {
  const panes = Children.toArray(children);
  const [sizes, setSizes] = useState(
    () => defaultSizes ?? panes.map(() => 100 / panes.length)
  );
  const [dragging, setDragging] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const resize = (i: number, nextLeft: number) => {
    setSizes((current) => {
      const pair = (current[i] ?? 0) + (current[i + 1] ?? 0);
      const left = Math.min(Math.max(nextLeft, minSize), pair - minSize);
      const next = [...current];
      next[i] = left;
      next[i + 1] = pair - left;
      onSizesChange?.(next);
      return next;
    });
  };

  const before = (i: number) => sizes.slice(0, i).reduce((a, b) => a + b, 0);

  return (
    <div ref={root} className={cx(s.split, className)} {...props}>
      {panes.map((pane, i) => (
        <Fragment key={i}>
          <div
            className={s.pane}
            style={assignInlineVars({ [s.paneSize]: `${sizes[i]}%` })}
          >
            {pane}
          </div>
          {i < panes.length - 1 ? (
            <div
              role="separator"
              tabIndex={0}
              aria-orientation="vertical"
              aria-label={`Resize ${paneLabels[i] ?? `pane ${i + 1}`} and ${
                paneLabels[i + 1] ?? `pane ${i + 2}`
              }`}
              aria-valuenow={Math.round(sizes[i] ?? 0)}
              aria-valuemin={minSize}
              aria-valuemax={100 - minSize}
              data-dragging={dragging === i}
              className={s.separator}
              onKeyDown={(e) => {
                const step = e.shiftKey ? 10 : 2;
                const current = sizes[i] ?? 0;
                if (e.key === 'ArrowLeft') resize(i, current - step);
                else if (e.key === 'ArrowRight') resize(i, current + step);
                else if (e.key === 'Home') resize(i, minSize);
                else if (e.key === 'End') resize(i, Infinity);
                else return;
                e.preventDefault();
              }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(i);
              }}
              onPointerMove={(e) => {
                if (dragging !== i || !root.current) return;
                const box = root.current.getBoundingClientRect();
                const pointer = ((e.clientX - box.left) / box.width) * 100;
                resize(i, pointer - before(i));
              }}
              onPointerUp={() => setDragging(null)}
            />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
