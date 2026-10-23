import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { PlotSeries } from './time-series-plot';
import * as s from './time-series.css';

interface TooltipProps {
  date: string;
  series: ReadonlyArray<PlotSeries>;
  index: number;
  /** Left edge in px; the caller keeps it inside the plot. */
  x: number;
  y: number;
  formatValue: (value: number) => string;
}

/** One readout for every series at the hovered date: value first, then its name. */
export function TimeSeriesTooltip({
  date,
  series,
  index,
  x,
  y,
  formatValue,
}: TooltipProps) {
  return (
    <div
      className={s.tooltip}
      style={assignInlineVars({ [s.tipX]: `${x}px`, [s.tipY]: `${y}px` })}
      aria-hidden="true"
    >
      <span className={s.tooltipDate}>{date}</span>
      {series.map((ser, i) => (
        <span key={ser.key} className={s.tooltipRow}>
          <span className={s.tooltipKey({ index: i === 0 ? 0 : 1 })} />
          <span className={s.tooltipValue}>
            {formatValue(ser.values[index] ?? 0)}
          </span>
          <span className={s.tooltipLabel}>{ser.label}</span>
        </span>
      ))}
    </div>
  );
}
