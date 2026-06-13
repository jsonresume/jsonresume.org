/**
 * @repo/theme-config/metadata (back-compat shim)
 *
 * Re-exports the metadata subpath from @jsonresume/theme-metadata so the legacy
 * '@repo/theme-config/metadata' import specifier keeps resolving.
 */

export {
  THEME_METADATA,
  THEME_NAMES,
  getRandomTheme,
} from '@jsonresume/theme-metadata/metadata';
