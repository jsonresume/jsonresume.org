import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import * as s from './tree-map-skeleton.css';

export interface TreeMapSkeletonProps {
  /** What is loading, for assistive technology ("Your career graph"). */
  label: string;
  /** How many squares each band holds, the bottom band first. */
  rows?: ReadonlyArray<number>;
  /**
   * Shown over the placeholder: what the wait is doing (a ProgressSteps,
   * say). A live region, so changes to it are announced.
   */
  children?: ReactNode;
  className?: string;
}

const ROWS = [4, 8, 9, 5, 7, 3];
const SIZES = ['medium', 'small', 'large', 'small', 'medium'] as const;

/**
 * A TreeMap's shape while its data loads: bands of placeholder squares,
 * the bottom band first, with what the wait is doing laid over them.
 * Fills its parent, like TreeMap.
 */
export function TreeMapSkeleton({
  label,
  rows = ROWS,
  children,
  className,
}: TreeMapSkeletonProps) {
  // Drawn top band first, as TreeMap puts the last band at the top.
  const top = [...rows].reverse();
  return (
    <div
      className={cx(s.root, className)}
      role="group"
      aria-label={label}
      aria-busy="true"
    >
      <div className={s.bands} aria-hidden="true">
        {top.map((count, band) => (
          <div
            key={band}
            className={s.band}
            style={assignInlineVars({ [s.delay]: `${band * 140}ms` })}
          >
            <span className={s.bandName} />
            <span className={s.squares}>
              {Array.from({ length: count }, (_, i) => (
                <span
                  key={i}
                  className={
                    s.sizes[SIZES[(i + band) % SIZES.length] ?? 'small']
                  }
                />
              ))}
            </span>
          </div>
        ))}
      </div>
      {children ? (
        <div className={s.caption} role="status">
          {children}
        </div>
      ) : null}
    </div>
  );
}
