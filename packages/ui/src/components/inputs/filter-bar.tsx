import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../button/button';
import { Chip } from './chip';
import * as s from './inputs.css';

export interface ActiveFilter {
  key: string;
  /** e.g. "Remote" or "Salary: $150k+" */
  label: string;
  onRemove: () => void;
}

export interface FilterBarProps extends HTMLAttributes<HTMLElement> {
  /** The filter controls: Selects, SearchField, Switches. */
  children: ReactNode;
  active?: ActiveFilter[];
  onClearAll?: () => void;
  /** Result count, announced politely when it changes. */
  resultCount?: number;
  resultLabel?: (count: number) => string;
  label?: string;
}

/** Facet filters together, with active-filter chips, a result count and Clear all. */
export function FilterBar({
  children,
  active = [],
  onClearAll,
  resultCount,
  resultLabel = (n) => `${n} ${n === 1 ? 'result' : 'results'}`,
  label = 'Filters',
  className,
  ...props
}: FilterBarProps) {
  return (
    <section
      aria-label={label}
      className={cx(s.filterBar, className)}
      {...props}
    >
      <div className={s.filterControls}>{children}</div>
      {active.length || resultCount !== undefined ? (
        <div className={s.filterSummary}>
          {resultCount !== undefined ? (
            <span aria-live="polite">{resultLabel(resultCount)}</span>
          ) : null}
          {active.length ? (
            <ul className={s.chipList} aria-label="Active filters">
              {active.map((f) => (
                <li key={f.key}>
                  <Chip onRemove={f.onRemove} label={f.label}>
                    {f.label}
                  </Chip>
                </li>
              ))}
            </ul>
          ) : null}
          {active.length && onClearAll ? (
            <Button variant="link" onClick={onClearAll}>
              Clear all
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
