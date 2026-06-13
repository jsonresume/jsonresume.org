/**
 * @repo/theme-config (back-compat shim)
 *
 * The theme metadata moved to the publicly published @jsonresume/theme-metadata
 * package. This shim re-exports it under the legacy @repo/theme-config specifier
 * so existing internal consumers (registry, homepage2) keep working unchanged.
 *
 * New code should import from '@jsonresume/theme-metadata' directly.
 */

export {
  THEME_METADATA,
  THEME_NAMES,
  getRandomTheme,
} from '@jsonresume/theme-metadata';
