'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useRef, type ReactNode } from 'react';
import * as s from './workspace.css';

export interface VirtualListProps<T> {
  items: T[];
  /** Renders one item; keep row heights close to estimateSize. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Estimated row height in px; real heights are measured. */
  estimateSize?: number;
  /** Visible height (any CSS length). */
  height: string;
  label: string;
  getKey?: (item: T, index: number) => string | number;
}

/**
 * Renders only the rows in view, for very long lists (chat history, logs).
 * Rows keep list semantics with their position in the set. Row geometry is
 * set inline because it changes on every scroll frame.
 */
export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = 56,
  height,
  label,
  getKey,
}: VirtualListProps<T>) {
  const parent = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parent.current,
    estimateSize: () => estimateSize,
    overscan: 6,
    getItemKey: getKey ? (i) => getKey(items[i] as T, i) : undefined,
  });
  return (
    <div
      ref={parent}
      className={s.virtualViewport}
      style={assignInlineVars({ [s.viewportHeight]: height })}
      tabIndex={0}
      aria-label={label}
      role="region"
    >
      <ul
        className={s.virtualSizer}
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((row) => (
          <li
            key={row.key}
            ref={virtualizer.measureElement}
            data-index={row.index}
            aria-setsize={items.length}
            aria-posinset={row.index + 1}
            className={s.virtualRow}
            style={{ transform: `translateY(${row.start}px)` }}
          >
            {renderItem(items[row.index] as T, row.index)}
          </li>
        ))}
      </ul>
    </div>
  );
}
