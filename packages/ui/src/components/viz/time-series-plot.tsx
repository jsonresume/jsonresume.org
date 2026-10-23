import type { Geometry } from './time-series-geometry';
import { path, xLabelIndices } from './time-series-geometry';
import * as s from './time-series.css';

export interface PlotSeries {
  key: string;
  label: string;
  mark: 'area' | 'line';
  values: ReadonlyArray<number>;
}

interface PlotProps {
  g: Geometry;
  dates: ReadonlyArray<string>;
  series: ReadonlyArray<PlotSeries>;
  active: number | null;
  empty: boolean;
  emptyLabel: string;
  formatValue: (value: number) => string;
  formatDate: (date: string) => string;
}

const slot = (i: number) => (i === 0 ? 0 : 1) as 0 | 1;

/** The SVG: grid and ticks, areas under lines, end dots, and the crosshair. */
export function TimeSeriesPlot({
  g,
  dates,
  series,
  active,
  empty,
  emptyLabel,
  formatValue,
  formatDate,
}: PlotProps) {
  const last = dates.length - 1;
  const labels = xLabelIndices(dates.length, g);
  const base = g.top + g.innerH;
  return (
    <svg
      className={s.svg}
      width={g.width}
      height={g.height}
      viewBox={`0 0 ${g.width} ${g.height}`}
      aria-hidden="true"
    >
      {(empty ? [0] : g.ticks).map((t) => (
        <g key={t}>
          {t > 0 ? (
            <line
              className={s.grid}
              x1={g.left}
              x2={g.width - g.right}
              y1={g.y(t)}
              y2={g.y(t)}
            />
          ) : null}
          <text
            className={s.tick}
            x={g.left - 8}
            y={g.y(t) + 4}
            textAnchor="end"
          >
            {formatValue(t)}
          </text>
        </g>
      ))}
      <line
        className={s.baseline}
        x1={g.left}
        x2={g.width - g.right}
        y1={base}
        y2={base}
      />
      {labels.map((i) => (
        <text
          key={i}
          className={s.tick}
          x={g.x(i)}
          y={g.height - 6}
          textAnchor={
            labels.length > 1 && i === last
              ? 'end'
              : i === 0 && labels.length > 1
              ? 'start'
              : 'middle'
          }
        >
          {formatDate(dates[i] ?? '')}
        </text>
      ))}
      {empty ? (
        <text
          className={s.empty}
          x={g.left + g.innerW / 2}
          y={g.top + g.innerH / 2}
          textAnchor="middle"
        >
          {emptyLabel}
        </text>
      ) : (
        <>
          {series.map((ser, i) =>
            ser.mark === 'area' ? (
              <path
                key={`a-${ser.key}`}
                className={s.area({ index: slot(i) })}
                d={path(ser.values, g, true)}
              />
            ) : null
          )}
          {series.map((ser, i) => (
            <path
              key={`l-${ser.key}`}
              className={s.line({ index: slot(i) })}
              d={path(ser.values, g)}
            />
          ))}
          {active !== null ? (
            <line
              className={s.crosshair}
              x1={g.x(active)}
              x2={g.x(active)}
              y1={g.top}
              y2={base}
            />
          ) : null}
          {series.map((ser, i) => {
            const at = active ?? last;
            return (
              <circle
                key={`d-${ser.key}`}
                className={s.dot({ index: slot(i) })}
                cx={g.x(at)}
                cy={g.y(ser.values[at] ?? 0)}
                r={4}
              />
            );
          })}
        </>
      )}
    </svg>
  );
}
