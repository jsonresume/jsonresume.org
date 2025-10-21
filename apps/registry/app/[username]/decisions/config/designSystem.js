/**
 * Design System for Decisions Page
 * Inspired by nof1.ai's clean, professional aesthetic
 */

export const colors = {
  // Background colors (light theme)
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC', // Very light gray
    tertiary: '#F1F5F9',
  },

  // Text colors
  text: {
    primary: '#1E293B', // Dark slate
    secondary: '#64748B', // Slate gray
    tertiary: '#94A3B8', // Light slate
    inverse: '#FFFFFF',
  },

  // Decision tree path colors (vibrant, distinct)
  paths: {
    blue: '#3B82F6', // Blue
    purple: '#A855F7', // Purple
    green: '#10B981', // Green
    orange: '#F97316', // Orange
    teal: '#14B8A6', // Teal
    black: '#1E293B', // Black/dark
    gray: '#CBD5E1', // Gray (default/inactive)
  },

  // Outcome colors
  outcomes: {
    strongMatch: {
      bg: '#ECFDF5', // Light green
      border: '#10B981', // Green
      text: '#065F46', // Dark green
      badge: '#10B981',
    },
    possibleMatch: {
      bg: '#FFFBEB', // Light yellow
      border: '#F59E0B', // Orange/yellow
      text: '#92400E', // Dark orange
      badge: '#F59E0B',
    },
    noMatch: {
      bg: '#FEF2F2', // Light red
      border: '#EF4444', // Red
      text: '#991B1B', // Dark red
      badge: '#EF4444',
    },
  },

  // Performance indicators
  performance: {
    positive: '#10B981', // Green
    negative: '#EF4444', // Red
    neutral: '#64748B', // Gray
  },

  // UI elements
  ui: {
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    shadow: 'rgba(0, 0, 0, 0.06)',
    shadowHover: 'rgba(0, 0, 0, 0.1)',
  },
};

export const typography = {
  fonts: {
    sans: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    mono: 'var(--font-mono, "SF Mono", Monaco, "Cascadia Code", monospace)',
  },

  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  // Consistent spacing scale (4px base)
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
};

export const borderRadius = {
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

// Component-specific styles
export const components = {
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius['2xl'],
    boxShadow: shadows.md,
    padding: spacing[6],
  },

  badge: {
    borderRadius: borderRadius.full,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    padding: `${spacing[1]} ${spacing[3]}`,
  },

  button: {
    borderRadius: borderRadius.xl,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    padding: `${spacing[2]} ${spacing[4]}`,
  },

  input: {
    borderRadius: borderRadius.lg,
    fontSize: typography.sizes.sm,
    padding: `${spacing[2]} ${spacing[3]}`,
    borderColor: colors.ui.border,
  },
};

// Layout grid (3-column)
export const layout = {
  leftPane: 'col-span-3', // 25% (3/12)
  centerPane: 'col-span-6', // 50% (6/12)
  rightPane: 'col-span-3', // 25% (3/12)
  gap: spacing[4],
};

// Animation timings (nof1.ai style - smooth and professional)
export const animations = {
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
  edgeAnimation: '200ms', // Per edge in decision tree
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out
};

const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  layout,
  animations,
};

export default designSystem;
