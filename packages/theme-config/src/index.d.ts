export {
  THEME_METADATA,
  THEME_NAMES,
  getRandomTheme,
  type ThemeMetadata,
} from './metadata.js';

export declare const THEME_STYLES: Record<string, string>;
export declare const THEME_LAYOUTS: Record<string, string>;
export declare const THEME_COLORS: Record<string, string>;
export declare const THEME_USAGE_SOURCE: {
  asOf: string;
  metric: string;
  population: number;
  inheritedDefault: number;
  unlistedThemeChoices: number;
  firstRecordedView: string | null;
  viewWindowDays: number;
};

/**
 * Slugs of the recommended themes (ATS-safe and print-tested), in the
 * order to show them.
 */
export declare const RECOMMENDED_THEMES: readonly string[];
