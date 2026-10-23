import type { HTMLAttributes, ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import * as s from './data.css';

export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  unit?: string;
  /** Change since a previous period. Positive is good unless `lowerIsBetter`. */
  change?: { value: number; period?: string; format?: (n: number) => string };
  lowerIsBetter?: boolean;
  note?: ReactNode;
}

/** A key number with its label and, optionally, how it changed. */
export function StatTile({
  label,
  value,
  unit,
  change,
  lowerIsBetter = false,
  note,
  className,
  ...props
}: StatTileProps) {
  let trend: ReactNode = null;
  if (change) {
    const up = change.value > 0;
    const flat = change.value === 0;
    const good = flat ? 'neutral' : up !== lowerIsBetter ? 'good' : 'bad';
    const shown = (change.format ?? ((n) => `${Math.abs(n)}%`))(change.value);
    trend = (
      <p className={s.trend({ tone: good })}>
        <span aria-hidden="true">{flat ? '–' : up ? '▲' : '▼'} </span>
        <span className={visuallyHidden}>
          {flat ? 'No change' : up ? 'Up' : 'Down'}{' '}
        </span>
        {flat ? null : shown}
        {change.period ? ` ${change.period}` : null}
      </p>
    );
  }
  return (
    <div
      role="group"
      aria-label={label}
      className={cx(s.stat, className)}
      {...props}
    >
      <p className={s.statLabel}>{label}</p>
      <p className={s.statValue}>
        {value}
        {unit ? <span className={s.statUnit}>{unit}</span> : null}
      </p>
      {trend}
      {note ? <p className={s.statNote}>{note}</p> : null}
    </div>
  );
}
