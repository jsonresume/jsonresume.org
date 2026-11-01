import type { ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import type { TreeTone } from './render-types';
import * as s from './tree-legend.css';

export interface TreeLegendProps {
  /** What each tone means on this map, in the order to read them. */
  items: ReadonlyArray<{ tone: TreeTone; label: ReactNode }>;
  /** Names the list for screen readers. */
  label?: string;
  className?: string;
}

/** A TreeMap's key: each tone drawn as the map draws it, with what it means here. */
export function TreeLegend({
  items,
  label = 'Key',
  className,
}: TreeLegendProps) {
  return (
    <ul className={cx(s.legend, className)} aria-label={label}>
      {items.map((item) => (
        <li key={item.tone} className={s.item}>
          <span className={s.swatch[item.tone]} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
