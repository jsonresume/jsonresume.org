/** How many gallery themes there are, counted at build time (vite.config.ts). */
declare const __THEME_COUNT__: number;
/** @jsonresume/schema's version, at build time (vite.config.ts). */
declare const __SCHEMA_VERSION__: string;

/** Build-time settings (see .env.production). */
interface ImportMetaEnv {
  /** PostHog's project token: public, it ships to every browser. */
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
  /** Where links into PostHog's own app go. */
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
}
