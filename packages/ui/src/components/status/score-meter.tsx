import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { ReactNode } from 'react';
import * as s from './status.css';

export interface ScoreBand {
  /** Lowest score in this band. */
  min: number;
  label: string;
  tone: 'danger' | 'warning' | 'success' | 'neutral';
}

export interface ScoreMeterProps {
  value: number;
  max?: number;
  /** Visible name, e.g. "ATS score". */
  label: ReactNode;
  /** Plain-text name for assistive technology when label isn't a string. */
  ariaLabel?: string;
  bands?: ScoreBand[];
  variant?: 'ring' | 'bar';
  /** Ring diameter in px. */
  size?: number;
}

export const defaultBands: ScoreBand[] = [
  { min: 0, label: 'Needs work', tone: 'danger' },
  { min: 50, label: 'Fair', tone: 'warning' },
  { min: 80, label: 'Strong', tone: 'success' },
];

/** A score with rating bands, as a ring or a bar. Exposed as an ARIA meter. */
export function ScoreMeter({
  value,
  max = 100,
  label,
  ariaLabel,
  bands = defaultBands,
  variant = 'ring',
  size = 128,
}: ScoreMeterProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = (clamped / max) * 100;
  const band =
    [...bands].sort((a, b) => b.min - a.min).find((b) => percent >= b.min) ??
    bands[0];
  const name = ariaLabel ?? (typeof label === 'string' ? label : undefined);
  const meterProps = {
    role: 'meter',
    'aria-label': name,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuenow': clamped,
    'aria-valuetext': `${Math.round(clamped)} out of ${max}${
      band ? `, ${band.label}` : ''
    }`,
  } as const;
  const style = assignInlineVars({ [s.progress]: String(percent) });

  if (variant === 'bar') {
    return (
      <div
        className={`${s.meter({ tone: band?.tone })} ${s.bar}`}
        style={style}
      >
        <div className={s.barHeader}>
          <span className={s.meterTitle}>{label}</span>
          <span>
            <span className={s.scoreNumber}>{Math.round(clamped)}</span>
            <span className={s.scoreOutOf}> / {max}</span>
          </span>
        </div>
        <div className={s.barTrack} {...meterProps}>
          <div className={s.barFill} />
        </div>
        {band ? <span className={s.band}>{band.label}</span> : null}
      </div>
    );
  }

  const stroke = Math.max(6, size / 14);
  return (
    <div className={s.meter({ tone: band?.tone })} style={style}>
      <div className={s.ring} {...meterProps}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          <circle
            className={s.ringTrack}
            cx={size / 2}
            cy={size / 2}
            r={(size - stroke) / 2}
            strokeWidth={stroke}
          />
          <circle
            className={s.ringValue}
            cx={size / 2}
            cy={size / 2}
            r={(size - stroke) / 2}
            strokeWidth={stroke}
            pathLength={100}
          />
        </svg>
        <span className={s.ringLabel} aria-hidden="true">
          <span
            className={s.scoreNumber}
            style={assignInlineVars({ [s.numberSize]: `${size / 3.2}px` })}
          >
            {Math.round(clamped)}
          </span>
          <span className={s.scoreOutOf}>of {max}</span>
        </span>
      </div>
      <span className={s.meterTitle}>{label}</span>
      {band ? <span className={s.band}>{band.label}</span> : null}
    </div>
  );
}
