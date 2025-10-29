/**
 * @resume/core
 * Framework-agnostic resume components core
 * Design tokens, primitives, and utilities for building ATS-friendly resume themes
 */

// Export all primitives
export {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  Badge,
  BadgeList,
} from './primitives/index.js';

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
