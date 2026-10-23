/** Formatting for the dashboard's numbers. Rendered on the client only. */

/** 48s, 2m 05s, 1h 03m. */
export function duration(seconds: number): string {
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, '0')}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
}

export const count = (n: number) => n.toLocaleString('en');

/** The change from `previous` to `current` as a fraction, or none from zero. */
export const change = (current: number, previous: number) =>
  previous > 0 ? (current - previous) / previous : undefined;

const regions =
  typeof Intl.DisplayNames === 'function'
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : undefined;

/** "AU" → "Australia"; anything unknown stays as it came. */
export function country(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return code;
  try {
    return regions?.of(code) ?? code;
  } catch {
    return code;
  }
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const label = (s: string) => capital(s);

export const rangeDays = { '7d': 7, '30d': 30, '90d': 90 } as const;
