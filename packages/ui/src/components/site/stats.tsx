import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as s from './stats.css';

/** A row of headline figures for landing pages ("67 themes"). */
export function Stats({ className, ...props }: StatsProps) {
  return <dl className={cx(s.stats, className)} {...props} />;
}

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** The figure, shown large. Format it for reading: "4,800+". */
  value: ReactNode;
  label: ReactNode;
}

/**
 * One figure and its label. The label is the <dt> so the pair reads
 * "Themes: 67"; the figure is drawn above it.
 */
export function Stat({ value, label, className, ...props }: StatProps) {
  return (
    <div className={cx(s.stat, className)} {...props}>
      <dt className={s.label}>{label}</dt>
      <dd className={s.value}>{value}</dd>
    </div>
  );
}

export type StatsProps = HTMLAttributes<HTMLDListElement>;
