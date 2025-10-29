/**
 * Design Tokens
 * Framework-agnostic design tokens exported as both CSS variables and JS objects
 */

/**
 * Typography tokens
 */
export const typography = {
  fonts: {
    sans: 'var(--resume-font-sans)',
    serif: 'var(--resume-font-serif)',
    mono: 'var(--resume-font-mono)',
  },
  sizes: {
    name: 'var(--resume-size-name)',
    heading: 'var(--resume-size-heading)',
    subheading: 'var(--resume-size-subheading)',
    body: 'var(--resume-size-body)',
    small: 'var(--resume-size-small)',
  },
  weights: {
    normal: 'var(--resume-weight-normal)',
    medium: 'var(--resume-weight-medium)',
    semibold: 'var(--resume-weight-semibold)',
    bold: 'var(--resume-weight-bold)',
  },
  lineHeights: {
    tight: 'var(--resume-line-height-tight)',
    normal: 'var(--resume-line-height-normal)',
    relaxed: 'var(--resume-line-height-relaxed)',
  },
};

/**
 * Color tokens
 */
export const colors = {
  primary: 'var(--resume-color-primary)',
  secondary: 'var(--resume-color-secondary)',
  accent: 'var(--resume-color-accent)',
  background: 'var(--resume-color-background)',
  border: 'var(--resume-color-border)',
};

/**
 * Spacing tokens
 */
export const spacing = {
  section: 'var(--resume-space-section)',
  item: 'var(--resume-space-item)',
  tight: 'var(--resume-space-tight)',
  margin: 'var(--resume-space-margin)',
};

/**
 * Layout tokens
 */
export const layout = {
  maxWidth: 'var(--resume-max-width)',
  columnGap: 'var(--resume-column-gap)',
};

/**
 * Border radius tokens
 */
export const radius = {
  sm: 'var(--resume-radius-sm)',
  md: 'var(--resume-radius-md)',
  lg: 'var(--resume-radius-lg)',
};

/**
 * Shadow tokens
 */
export const shadows = {
  sm: 'var(--resume-shadow-sm)',
  md: 'var(--resume-shadow-md)',
};

/**
 * Combined tokens object
 */
export const tokens = {
  typography,
  colors,
  spacing,
  layout,
  radius,
  shadows,
};

/**
 * Raw token values (for non-CSS use cases like PDF generation)
 */
export const rawTokens = {
  typography: {
    fonts: {
      sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      serif: 'Cambria, Georgia, "Times New Roman", serif',
      mono: '"Courier New", Courier, monospace',
    },
    sizes: {
      name: '36px',
      heading: '16px',
      subheading: '14px',
      body: '11px',
      small: '10px',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  colors: {
    professional: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
      accent: '#2563eb',
      background: '#ffffff',
      border: '#e5e7eb',
    },
    modern: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#8b5cf6',
      background: '#ffffff',
      border: '#e5e7eb',
    },
    classic: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#0066cc',
      background: '#ffffff',
      border: '#cccccc',
    },
    minimal: {
      primary: '#18181b',
      secondary: '#71717a',
      accent: '#000000',
      background: '#ffffff',
      border: '#e4e4e7',
    },
  },
  spacing: {
    section: '24px',
    item: '16px',
    tight: '8px',
    margin: '48px',
  },
  layout: {
    maxWidth: '660px',
    columnGap: '24px',
  },
};

export default tokens;
