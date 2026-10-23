/* Scales and number formats for charts: pure, usable on the server. */

/** The nearest "nice" number at or above `max`: 1, 2, 2.5 or 5 times a power of ten. */
export const nice = (max: number) => {
  if (max <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  return (
    [1, 2, 2.5, 5, 10].map((f) => f * magnitude).find((v) => v >= max) ?? max
  );
};

/** A nice step for about `count` intervals up to `max`; whole numbers for counts. */
export function niceStep(max: number, count = 4): number {
  if (max <= 0) return 1;
  const rough = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step =
    [1, 2, 2.5, 5, 10].map((f) => f * magnitude).find((v) => v >= rough) ??
    rough;
  return Math.max(step, Number.isInteger(max) ? 1 : step);
}

/** Ticks from 0 to the first step at or above `max`. */
export function niceTicks(max: number, count = 4): number[] {
  const step = niceStep(max, count);
  const top = Math.max(step, Math.ceil(max / step) * step);
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step)
    ticks.push(Number(v.toFixed(6)));
  return ticks;
}

const compactFormat = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** 1,284 → "1.3K"; small numbers as they are. */
export const compactNumber = (value: number) => compactFormat.format(value);
