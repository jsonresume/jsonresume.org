import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as s from './data.css';

export interface DescriptionItem {
  term: ReactNode;
  description: ReactNode;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  /** inline: label beside value; stacked: label above value; columns: a grid of facts. */
  layout?: 'inline' | 'stacked' | 'columns';
}

/** Labelled facts in pairs: Location, Salary, Type. */
export function DescriptionList({
  items,
  layout,
  className,
  ...props
}: DescriptionListProps) {
  return (
    <dl className={cx(s.dl({ layout }), className)} {...props}>
      {items.map((item, i) => (
        <div key={i} className={s.dlItem}>
          <dt className={s.dt}>{item.term}</dt>
          <dd className={s.dd}>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
