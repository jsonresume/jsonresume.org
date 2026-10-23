import { palette as p } from './palette';

/**
 * The design tokens: one typed source of truth. `contract.css.ts` turns
 * these into CSS custom properties (`--jr-color-text`, ...), `vars` gives
 * components typed references to them, and `tokens.json` exports them for
 * non-React consumers.
 *
 * Only `color` differs between light and dark; every other group is shared.
 */

export const lightColor = {
  surface: {
    page: p.white,
    subtle: p.gray[50],
    muted: p.gray[100],
    brand: p.yellow[200],
    brandSubtle: p.yellow[50],
    raised: p.white,
    inverse: p.gray[900],
  },
  text: {
    default: p.gray[800],
    strong: p.gray[900],
    muted: p.gray[500],
    inverse: p.white,
    onBrand: p.gray[900],
    link: p.red[700],
    linkHover: p.red[800],
  },
  border: {
    default: p.gray[200],
    subtle: p.gray[150],
    strong: p.gray[300],
  },
  action: {
    primary: p.red[500],
    primaryHover: p.red[600],
    primaryText: p.white,
    ink: p.gray[900],
    inkHover: p.gray[700],
    inkText: p.white,
    neutral: p.white,
    neutralHover: p.gray[50],
    neutralText: p.gray[600],
    neutralBorder: p.gray[200],
    neutralBorderHover: p.gray[400],
  },
  status: {
    info: p.blue[700],
    infoSurface: p.blue[50],
    success: p.green[700],
    successSurface: p.green[50],
    warning: p.amber[700],
    warningSurface: p.amber[50],
    danger: p.red[700],
    dangerSurface: p.red[50],
  },
  focus: p.gray[900],
  overlay: 'rgba(17, 17, 17, 0.45)',
};

/** Token tree with every leaf widened to string, so themes can differ. */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export type ColorTokens = Widen<typeof lightColor>;

export const darkColor: ColorTokens = {
  surface: {
    page: p.gray[950],
    subtle: p.gray[850],
    muted: '#242424',
    brand: p.yellow[200],
    brandSubtle: '#26230f',
    raised: p.gray[850],
    inverse: p.white,
  },
  text: {
    default: '#ededed',
    strong: p.white,
    muted: '#a3a3a3',
    inverse: p.gray[900],
    onBrand: p.gray[900],
    link: p.red[300],
    linkHover: '#ffa3a3',
  },
  border: {
    default: p.gray[700],
    subtle: '#2a2a2a',
    strong: p.gray[600],
  },
  action: {
    primary: p.red[500],
    primaryHover: p.red[600],
    primaryText: p.white,
    ink: p.white,
    inkHover: p.gray[200],
    inkText: p.gray[900],
    neutral: p.gray[850],
    neutralHover: '#242424',
    neutralText: '#d4d4d4',
    neutralBorder: p.gray[700],
    neutralBorderHover: p.gray[400],
  },
  status: {
    info: p.blue[300],
    infoSurface: '#14213a',
    success: p.green[300],
    successSurface: '#12291c',
    warning: p.amber[300],
    warningSurface: '#2e2211',
    danger: p.red[300],
    dangerSurface: '#2e1515',
  },
  focus: p.yellow[200],
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const font = {
  family: {
    sans: "'Open Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    wordmark: "'Ubuntu', 'Open Sans', system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
  },
  weight: { light: '300', regular: '400', semibold: '600', bold: '700' },
  size: {
    '2xs': '0.6875rem', // 11px: button labels, overlines
    xs: '0.75rem',
    sm: '0.875rem', // 14px: body copy
    md: '1rem',
    lg: '1.125rem',
    xl: '1.375rem',
    '2xl': '1.75rem',
    '3xl': '2.5rem', // 40px: page titles
    '4xl': '3.25rem',
  },
  lineHeight: { tight: '1.15', snug: '1.35', normal: '1.6' },
  tracking: { normal: '0', caps: '0.09em' },
};

/** 4px base grid. */
export const space = {
  0: '0',
  px: '1px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  30: '7.5rem',
};

export const radius = {
  none: '0',
  sm: '2px',
  md: '3px',
  lg: '6px',
  full: '9999px',
};

export const shadow = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 12px rgba(0, 0, 0, 0.08)',
  lg: '0 12px 32px rgba(0, 0, 0, 0.14)',
};

export const motion = {
  duration: { instant: '0ms', fast: '100ms', base: '250ms', slow: '400ms' },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
  },
};

export const layout = {
  container: '970px',
  wide: '1200px',
  prose: '72ch',
  gutter: '30px',
  gutterNarrow: '16px',
};

export const zIndex = {
  dropdown: '1000',
  sticky: '1100',
  overlay: '1300',
  modal: '1400',
  toast: '1500',
  tooltip: '1600',
};

export const tokens = {
  color: lightColor,
  font,
  space,
  radius,
  shadow,
  motion,
  layout,
  zIndex,
};

export type Tokens = typeof tokens;

/** Breakpoints as plain values: CSS custom properties can't be used in media queries. */
export const breakpoints = {
  sm: 600,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

export const media = {
  sm: `screen and (min-width: ${breakpoints.sm}px)`,
  md: `screen and (min-width: ${breakpoints.md}px)`,
  lg: `screen and (min-width: ${breakpoints.lg}px)`,
  xl: `screen and (min-width: ${breakpoints.xl}px)`,
  reducedMotion: '(prefers-reduced-motion: reduce)',
  dark: '(prefers-color-scheme: dark)',
} as const;
