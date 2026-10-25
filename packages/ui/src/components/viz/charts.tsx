import { vars } from '../../tokens/contract.css';
import { ChartFrame } from './chart-frame';
import { nice } from './scale';
import * as s from './viz.css';

export interface BarDatum {
  label: string;
  value: number;
  highlight?: boolean;
}

export interface BarChartProps {
  title: string;
  summary: string;
  data: BarDatum[];
  formatValue?: (v: number) => string;
  height?: number;
}

/** Vertical bars for comparing a handful of categories. */
export function BarChart({
  title,
  summary,
  data,
  formatValue = String,
  height = 220,
}: BarChartProps) {
  const width = 600;
  const pad = { top: 12, right: 8, bottom: 28, left: 44 };
  const max = nice(Math.max(...data.map((d) => d.value), 0));
  const inner = {
    w: width - pad.left - pad.right,
    h: height - pad.top - pad.bottom,
  };
  const band = inner.w / Math.max(data.length, 1);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  return (
    <ChartFrame
      title={title}
      summary={summary}
      table={{
        columns: ['Category', 'Value'],
        rows: data.map((d) => [d.label, formatValue(d.value)]),
      }}
    >
      <svg
        className={s.svg}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        {ticks.map((t) => {
          const y = pad.top + inner.h - (t / max) * inner.h;
          return (
            <g key={t}>
              <line
                className={s.grid}
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
              />
              <text
                className={s.tick}
                x={pad.left - 6}
                y={y + 4}
                textAnchor="end"
              >
                {formatValue(t)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = (d.value / max) * inner.h;
          const x = pad.left + i * band + band * 0.15;
          return (
            <g key={d.label}>
              <rect
                className={d.highlight ? s.barHighlight : s.barRect}
                x={x}
                y={pad.top + inner.h - h}
                width={band * 0.7}
                height={h}
                rx={2}
              >
                <title>{`${d.label}: ${formatValue(d.value)}`}</title>
              </rect>
              <text
                className={s.tick}
                x={x + band * 0.35}
                y={height - 8}
                textAnchor="middle"
              >
                {d.label}
              </text>
            </g>
          );
        })}
        <line
          className={s.axis}
          x1={pad.left}
          x2={width - pad.right}
          y1={pad.top + inner.h}
          y2={pad.top + inner.h}
        />
      </svg>
    </ChartFrame>
  );
}

export interface LineSeries {
  name: string;
  values: number[];
}

export interface LineChartProps {
  title: string;
  summary: string;
  labels: string[];
  series: LineSeries[];
  formatValue?: (v: number) => string;
  height?: number;
}

const seriesColors = [
  vars.color.action.ink,
  vars.color.action.primary,
  vars.color.status.info,
  vars.color.status.success,
];

/** Trends over time for up to four series. */
export function LineChart({
  title,
  summary,
  labels,
  series,
  formatValue = String,
  height = 220,
}: LineChartProps) {
  const width = 600;
  const pad = { top: 12, right: 12, bottom: 28, left: 44 };
  const max = nice(Math.max(...series.flatMap((s) => s.values), 0));
  const inner = {
    w: width - pad.left - pad.right,
    h: height - pad.top - pad.bottom,
  };
  const x = (i: number) =>
    pad.left +
    (labels.length > 1 ? (i / (labels.length - 1)) * inner.w : inner.w / 2);
  const y = (v: number) => pad.top + inner.h - (v / max) * inner.h;
  const ticks = [0, 0.5, 1].map((f) => f * max);
  return (
    <ChartFrame
      title={title}
      summary={summary}
      legend={
        series.length > 1
          ? series.slice(0, 4).map((s, i) => ({
              label: s.name,
              color: seriesColors[i] as string,
              mark: 'line' as const,
            }))
          : undefined
      }
      table={{
        columns: ['', ...series.map((s) => s.name)],
        rows: labels.map((l, i) => [
          l,
          ...series.map((s) => formatValue(s.values[i] ?? 0)),
        ]),
      }}
    >
      <svg
        className={s.svg}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              className={s.grid}
              x1={pad.left}
              x2={width - pad.right}
              y1={y(t)}
              y2={y(t)}
            />
            <text
              className={s.tick}
              x={pad.left - 6}
              y={y(t) + 4}
              textAnchor="end"
            >
              {formatValue(t)}
            </text>
          </g>
        ))}
        {labels.map((l, i) => (
          <text
            key={l}
            className={s.tick}
            x={x(i)}
            y={height - 8}
            textAnchor="middle"
          >
            {l}
          </text>
        ))}
        {series.slice(0, 4).map((ser, si) => (
          <g key={ser.name}>
            <polyline
              className={s.lineSeries({ index: si as 0 })}
              points={ser.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
            />
            {ser.values.map((v, i) => (
              <circle
                key={i}
                className={s.lineDot({ index: si as 0 })}
                cx={x(i)}
                cy={y(v)}
                r={3.5}
              >
                <title>{`${ser.name}, ${labels[i]}: ${formatValue(v)}`}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
    </ChartFrame>
  );
}

export interface RadarChartProps {
  title: string;
  summary: string;
  /** Axis label and a 0–100 value for each. */
  data: Array<{ label: string; value: number }>;
  size?: number;
}

/** A 0–100 profile across several dimensions (readiness, skill coverage). */
export function RadarChart({
  title,
  summary,
  data,
  size = 320,
}: RadarChartProps) {
  const c = size / 2;
  const r = size / 2 - 48;
  const angle = (i: number) => (Math.PI * 2 * i) / data.length - Math.PI / 2;
  const point = (i: number, v: number) => [
    c + Math.cos(angle(i)) * r * (v / 100),
    c + Math.sin(angle(i)) * r * (v / 100),
  ];
  const ring = (v: number) =>
    data.map((_, i) => point(i, v).join(',')).join(' ');
  return (
    <ChartFrame
      title={title}
      summary={summary}
      table={{
        columns: ['Dimension', 'Score'],
        rows: data.map((d) => [d.label, d.value]),
      }}
    >
      <svg className={s.svg} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {[25, 50, 75, 100].map((v) => (
          <polygon key={v} className={s.grid} points={ring(v)} fill="none" />
        ))}
        {data.map((d, i) => {
          const [ex, ey] = point(i, 100);
          const [lx, ly] = point(i, 122);
          return (
            <g key={d.label}>
              <line className={s.grid} x1={c} y1={c} x2={ex} y2={ey} />
              <text
                className={s.tick}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {d.label}
              </text>
            </g>
          );
        })}
        <polygon
          className={s.radarArea}
          points={data.map((d, i) => point(i, d.value).join(',')).join(' ')}
        />
      </svg>
    </ChartFrame>
  );
}
