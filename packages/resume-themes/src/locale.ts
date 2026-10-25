import { createRequire } from 'node:module';

/**
 * Themes built on moment share one copy of it, and its locale is global:
 * lucide sets French when it loads, which turned every other theme's dates
 * French ("mai, 2021") until a restart. So each render first sets the locale
 * its theme expects; themes render synchronously, so nothing runs between.
 */
const themeLocales: Readonly<Record<string, string>> = { lucide: 'fr' };

interface Moment {
  locale: (name: string) => string;
}

const isMoment = (value: unknown): value is Moment =>
  typeof value === 'function' &&
  'locale' in value &&
  typeof value.locale === 'function';

const require = createRequire(import.meta.url);
let shared: Moment | null | undefined;

/** The moment the themes use (one copy in the lockfile), if any. */
const sharedMoment = () => {
  if (shared === undefined) {
    try {
      const theme = require.resolve('jsonresume-theme-elegant');
      const moment: unknown = createRequire(theme)('moment');
      shared = isMoment(moment) ? moment : null;
    } catch {
      shared = null;
    }
  }
  return shared;
};

export const setThemeLocale = (theme: string) => {
  sharedMoment()?.locale(themeLocales[theme] ?? 'en');
};
