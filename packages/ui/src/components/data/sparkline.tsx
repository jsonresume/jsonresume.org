import * as s from './data.css';

export interface SparklineProps {
  values: ReadonlyArray<number>;
  width?: number;
  height?: number;
}

/** A small trend line: context in gray, the latest point in the accent. */
export function Sparkline({ values, width = 96, height = 28 }: SparklineProps) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pad = 4;
  const x = (i: number) => pad + (i / (values.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);
  const last = values.length - 1;
  const points = values
    .map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(' ');
  return (
    <svg
      className={s.sparkline}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <polyline className={s.sparkLine} points={points} />
      <circle
        className={s.sparkDot}
        cx={x(last)}
        cy={y(values[last] ?? 0)}
        r={3}
      />
    </svg>
  );
}
