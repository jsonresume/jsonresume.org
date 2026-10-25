import type { HTMLAttributes, ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import * as s from './data.css';
import { Sparkline } from './sparkline';

export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  unit?: string;
  /** Change since a previous period. Positive is good unless `lowerIsBetter`. */
  change?: { value: number; period?: string; format?: (n: number) => string };
  lowerIsBetter?: boolean;
  /**
   * Change as a fraction of the previous period (0.12 is +12%), named by
   * `label`, e.g. "vs previous 30 days". Shown signed, with an arrow.
   */
  delta?: { value: number; label: string; positiveIsGood?: boolean };
  /** Recent values, oldest first, drawn as a sparkline. */
  trend?: ReadonlyArray<number>;
  note?: ReactNode;
}

const signedPercent = (fraction: number) => {
  const rounded = Math.round(fraction * 100);
  return `${rounded > 0 ? '+' : rounded < 0 ? '−' : ''}${Math.abs(rounded)}%`;
};

/** A key number with its label and, optionally, how it changed. */
export function StatTile({
  label,
  value,
  unit,
  change,
  lowerIsBetter = false,
  delta,
  trend,
  note,
  className,
  ...props
}: StatTileProps) {
  const movement = delta
    ? {
        value: Math.round(delta.value * 100),
        period: delta.label,
        format: () => signedPercent(delta.value),
        lowerIsBetter: delta.positiveIsGood === false,
      }
    : change
    ? { ...change, lowerIsBetter }
    : undefined;
  let changeLine: ReactNode = null;
  if (movement) {
    const up = movement.value > 0;
    const flat = movement.value === 0;
    const good = flat
      ? 'neutral'
      : up !== movement.lowerIsBetter
      ? 'good'
      : 'bad';
    const shown = (movement.format ?? ((n) => `${Math.abs(n)}%`))(
      movement.value
    );
    changeLine = (
      <p className={s.trend({ tone: good })}>
        <span aria-hidden="true">{flat ? '–' : up ? '▲' : '▼'} </span>
        <span className={visuallyHidden}>
          {flat ? 'No change' : up ? 'Up' : 'Down'}{' '}
        </span>
        {flat ? null : shown}
        {movement.period ? ` ${movement.period}` : null}
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
      <div className={s.statRow}>
        <p className={s.statValue}>
          {value}
          {unit ? <span className={s.statUnit}>{unit}</span> : null}
        </p>
        {trend ? <Sparkline values={trend} /> : null}
      </div>
      {changeLine}
      {note ? <p className={s.statNote}>{note}</p> : null}
    </div>
  );
}
