'use client';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useId } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import { compactNumber } from './scale';
import * as s from './bar-list.css';
import * as v from './viz.css';

export interface BarListItem {
  label: string;
  value: number;
  href?: string;
  /** A second line, e.g. the full URL. */
  detail?: string;
}

export interface BarListProps {
  title: string;
  items: ReadonlyArray<BarListItem>;
  formatValue?: (value: number) => string;
  /** Rows shown before the rest fold into "Other". Defaults to 6. */
  limit?: number;
  emptyLabel?: string;
  /** Header for the value column, e.g. "Views". */
  valueLabel?: string;
  /** Header for the label column. Defaults to the title. */
  itemLabel?: string;
  className?: string;
}

const percent = (part: number, total: number) =>
  total > 0 ? `${Math.round((part / total) * 100)}%` : '0%';

/** Ranked categories as labelled thin bars: top sources, countries, devices. */
export function BarList({
  title,
  items,
  formatValue = compactNumber,
  limit = 6,
  emptyLabel = 'Nothing yet',
  valueLabel = 'Count',
  itemLabel,
  className,
}: BarListProps) {
  const id = useId();
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, limit);
  const rest = sorted.slice(limit).reduce((sum, item) => sum + item.value, 0);
  const rows =
    rest > 0 ? [...top, { label: 'Other', value: rest, other: true }] : top;
  const total = sorted.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(1, ...rows.map((row) => row.value));

  return (
    <figure
      className={cx(v.chart, s.root, className)}
      aria-labelledby={`${id}-t`}
    >
      <figcaption id={`${id}-t`} className={v.chartTitle}>
        {title}
      </figcaption>
      {rows.length === 0 ? (
        <p className={s.empty}>{emptyLabel}</p>
      ) : (
        <>
          <div className={s.header} aria-hidden="true">
            <span>{itemLabel ?? title}</span>
            <span>{valueLabel}</span>
          </div>
          <ul className={s.list} aria-labelledby={`${id}-t`}>
            {rows.map((row) => {
              const other = 'other' in row;
              const share = percent(row.value, total);
              const href = 'href' in row ? row.href : undefined;
              const detail = 'detail' in row ? row.detail : undefined;
              return (
                <li key={row.label} className={s.item}>
                  <span className={s.label}>
                    {href ? (
                      <a className={s.link} href={href}>
                        {row.label}
                      </a>
                    ) : (
                      row.label
                    )}
                    {detail ? (
                      <span className={s.detail}> {detail}</span>
                    ) : null}
                  </span>
                  <span className={s.value}>
                    <span className={s.share} aria-hidden="true">
                      {share}
                    </span>
                    {formatValue(row.value)}
                    <span className={visuallyHidden}>
                      {` ${valueLabel.toLowerCase()}, ${share} of the total`}
                    </span>
                  </span>
                  <span
                    className={cx(s.bar, other && s.barOther)}
                    style={assignInlineVars({
                      [s.fill]: `${(row.value / max) * 100}%`,
                    })}
                    aria-hidden="true"
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </figure>
  );
}
