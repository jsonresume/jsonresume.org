/**
 * @resume/core
 * React component library for building ATS-friendly resume themes
 * Design tokens, primitives, and utilities with JSX
 */

// Export all React primitives
export {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  formatDateRange,
  Badge,
  BadgeList,
} from './primitives/index.jsx';

// Export design tokens
export {
  default as tokens,
  typography,
  colors,
  spacing,
  layout,
  radius,
  shadows,
  rawTokens,
} from './tokens/index.js';

// Package metadata
export const version = '0.1.0';
