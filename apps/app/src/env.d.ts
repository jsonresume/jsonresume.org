/** Build-time settings (see .env.production). */
interface ImportMetaEnv {
  /** PostHog's project token: public, it ships to every browser. */
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
  /** Where links into PostHog's own app go. */
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
}
