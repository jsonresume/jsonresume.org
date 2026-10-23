import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { HTMLAttributes, ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import * as s from './workspace.css';

export interface GraphRegionProps extends HTMLAttributes<HTMLElement> {
  /** Names the visualization. */
  label: string;
  /** What the graph shows and how to explore it, for screen readers. */
  description?: string;
  height?: string;
  /** Overlays (controls, legend, node card) placed in corners with GraphOverlay. */
  children: ReactNode;
}

/**
 * The frame around a graph canvas (force graph, flow): a labelled region
 * with a description, plus corner overlays for controls and legend. The
 * graph engine itself renders inside.
 */
export function GraphRegion({
  label,
  description,
  height = '28rem',
  className,
  children,
  ...props
}: GraphRegionProps) {
  return (
    <section
      aria-label={label}
      className={cx(s.graphRegion, className)}
      style={assignInlineVars({ [s.graphHeight]: height })}
      {...props}
    >
      {description ? <p className={visuallyHidden}>{description}</p> : null}
      {children}
    </section>
  );
}

export function GraphOverlay({
  corner,
  children,
}: {
  corner: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  children: ReactNode;
}) {
  return <div className={s.graphOverlay({ corner })}>{children}</div>;
}

export interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  label?: string;
}

const icon = (d: string) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

/** Zoom and fit buttons, each labelled. */
export function GraphControls({
  onZoomIn,
  onZoomOut,
  onFit,
  label = 'Graph view',
}: GraphControlsProps) {
  return (
    <div role="group" aria-label={label} className={s.graphControls}>
      <button
        type="button"
        className={s.graphControl}
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        {icon('M8 3v10M3 8h10')}
      </button>
      <button
        type="button"
        className={s.graphControl}
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        {icon('M3 8h10')}
      </button>
      <button
        type="button"
        className={s.graphControl}
        onClick={onFit}
        aria-label="Fit to view"
      >
        {icon('M3 6V3h3M10 3h3v3M13 10v3h-3M6 13H3v-3')}
      </button>
    </div>
  );
}

export interface LegendEntry {
  label: string;
  color: string;
  shape?: 'circle' | 'square' | 'line';
}

/** What the colors and shapes mean. */
export function GraphLegend({
  items,
  label = 'Legend',
}: {
  items: LegendEntry[];
  label?: string;
}) {
  return (
    <ul className={s.graphLegend} aria-label={label}>
      {items.map((item) => (
        <li key={item.label} className={s.graphLegendItem}>
          <span
            className={s.graphLegendMark({ shape: item.shape ?? 'circle' })}
            style={assignInlineVars({ [s.legendColor]: item.color })}
            aria-hidden="true"
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/** Details for the selected node, shown over the graph. */
export function GraphNodeCard({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <section className={s.nodeCard} aria-label={label} aria-live="polite">
      {children}
    </section>
  );
}
