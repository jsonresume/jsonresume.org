declare module '@jsonresume/theme-metadata' {
  export interface ThemeMetadata {
    name: string;
    description: string;
    author: string;
    tags: string[];
  }
  export const THEME_METADATA: Record<string, ThemeMetadata>;
  export const THEME_NAMES: string[];
}
