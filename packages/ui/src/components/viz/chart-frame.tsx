'use client';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Table, Td, Th } from '../display/display';
import * as s from './viz.css';

export interface ChartFrameProps {
  title: string;
  /** One sentence describing what the chart shows, for screen readers. */
  summary: string;
  table: { columns: string[]; rows: Array<Array<string | number>> };
  /** Swatches mirror the mark: a block for bars and areas, a stroke for lines. */
  legend?: Array<{ label: string; color: string; mark?: 'rect' | 'line' }>;
  /**
   * 'img' (default) wraps a static plot as one image with `summary` as its
   * name; 'custom' leaves the plot to label itself (interactive charts).
   */
  plot?: 'img' | 'custom';
  className?: string;
  children: ReactNode;
}

/** Title, legend, the SVG, and a "Show data" table so the numbers are always reachable. */
export function ChartFrame({
  title,
  summary,
  table,
  legend,
  plot = 'img',
  className,
  children,
}: ChartFrameProps) {
  const id = useId();
  return (
    <figure className={cx(s.chart, className)} aria-labelledby={`${id}-t`}>
      <figcaption id={`${id}-t`} className={s.chartTitle}>
        {title}
      </figcaption>
      {legend ? (
        <ul className={s.legend}>
          {legend.map((l) => (
            <li key={l.label} className={s.legendItem}>
              <span
                className={l.mark === 'line' ? s.legendLine : s.legendSwatch}
                style={assignInlineVars({ [s.swatchColor]: l.color })}
              />
              {l.label}
            </li>
          ))}
        </ul>
      ) : null}
      {plot === 'img' ? (
        <div role="img" aria-label={summary}>
          {children}
        </div>
      ) : (
        children
      )}
      <details className={s.dataToggle}>
        <summary>Show data</summary>
        <Table>
          <thead>
            <tr>
              {table.columns.map((c) => (
                <Th key={c}>{c}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i}>
                {r.map((v, j) => (
                  <Td key={j}>{v}</Td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </details>
    </figure>
  );
}
