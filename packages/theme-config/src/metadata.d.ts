/** Registry metadata for one theme. */
export interface ThemeMetadata {
  name: string;
  description: string;
  author: string;
  tags: string[];
}

/** Every theme the registry can render, keyed by slug. */
export declare const THEME_METADATA: Record<string, ThemeMetadata>;

/** Slugs of every theme, in metadata order. */
export declare const THEME_NAMES: string[];

/** A random theme slug. */
export declare function getRandomTheme(): string;
