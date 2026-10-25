import { niceTicks } from './scale';

export interface Geometry {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  /** Plot width and height inside the padding. */
  innerW: number;
  innerH: number;
  ticks: number[];
  x: (index: number) => number;
  y: (value: number) => number;
  /** The data index nearest a horizontal pixel position. */
  indexAt: (px: number) => number;
}

/** Scales and padding for a time series `width` px wide; the y axis starts at 0. */
export function geometry(
  width: number,
  height: number,
  count: number,
  max: number,
  format: (value: number) => string
): Geometry {
  const ticks = niceTicks(max);
  const widest = Math.max(...ticks.map((t) => format(t).length));
  const left = Math.max(28, widest * 7 + 10);
  const right = 12;
  const top = 12;
  const bottom = 26;
  const innerW = Math.max(1, width - left - right);
  const innerH = Math.max(1, height - top - bottom);
  const ceiling = ticks[ticks.length - 1] ?? 1;
  const x = (i: number) =>
    left + (count > 1 ? (i / (count - 1)) * innerW : innerW / 2);
  const y = (v: number) => top + innerH - (v / ceiling) * innerH;
  const indexAt = (px: number) =>
    count <= 1
      ? 0
      : Math.min(
          count - 1,
          Math.max(0, Math.round(((px - left) / innerW) * (count - 1)))
        );
  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
    innerW,
    innerH,
    ticks,
    x,
    y,
    indexAt,
  };
}

/**
 * Which dates get an x label: evenly strided back from the latest, with
 * at least `gap` px between label centres so they never collide.
 */
export function xLabelIndices(count: number, g: Geometry, gap = 64): number[] {
  if (count === 0) return [];
  const fit = Math.max(1, Math.floor(g.innerW / gap));
  const stride = Math.max(1, Math.ceil(count / fit));
  const picked: number[] = [];
  for (let i = count - 1; i >= 0; i -= stride) picked.unshift(i);
  return picked;
}

/** An SVG path through the points; `close` drops it to the baseline for an area. */
export function path(
  values: ReadonlyArray<number>,
  g: Geometry,
  close = false
): string {
  if (values.length === 0) return '';
  const points = values.map(
    (v, i) => `${g.x(i).toFixed(1)},${g.y(v).toFixed(1)}`
  );
  const line = `M${points.join('L')}`;
  if (!close) return line;
  const base = (g.top + g.innerH).toFixed(1);
  return `${line}L${g.x(values.length - 1).toFixed(1)},${base}L${g
    .x(0)
    .toFixed(1)},${base}Z`;
}
