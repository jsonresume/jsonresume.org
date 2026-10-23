import {
  normalizeDates,
  withProjectSummaries,
  withStringLocations,
} from '@jsonresume/utils';
import { Effect, Schema } from 'effect';
import { createRequire } from 'node:module';
import { ensureHtmlCharset } from './charset.ts';
import { themeLoaders } from './loaders.ts';

/** The theme used when neither the request nor the resume names one. */
export const DEFAULT_THEME = 'elegant';

export const themeSlugs: ReadonlyArray<string> = Object.keys(themeLoaders);

export const isTheme = (slug: string) => Object.hasOwn(themeLoaders, slug);

export class ThemeNotFound extends Schema.TaggedError<ThemeNotFound>()(
  'ThemeNotFound',
  {
    theme: Schema.String,
  }
) {}

/** The theme threw while loading or rendering this resume. */
export class ThemeFailed extends Schema.TaggedError<ThemeFailed>()(
  'ThemeFailed',
  {
    theme: Schema.String,
    message: Schema.String,
  }
) {}

interface Renderable {
  render: (resume: unknown) => string | Promise<string>;
}

const hasRender = (value: unknown): value is Renderable =>
  typeof value === 'object' &&
  value !== null &&
  'render' in value &&
  typeof value.render === 'function';

/** ESM themes export render; CommonJS ones put it on module.exports. */
const resolveRenderable = (mod: unknown): Renderable | undefined => {
  if (hasRender(mod)) return mod;
  if (
    typeof mod === 'object' &&
    mod !== null &&
    'default' in mod &&
    hasRender(mod.default)
  ) {
    return mod.default;
  }
  return undefined;
};

/**
 * Handlebars themes share one global Handlebars and register same-named
 * helpers when loaded, so the last one loaded wins. These are loaded fresh,
 * with Handlebars itself, for every render.
 */
const handlebarsThemes: Readonly<Record<string, string>> = {
  macchiato: 'jsonresume-theme-macchiato',
  pumpkin: 'jsonresume-theme-pumpkin',
  lucide: 'jsonresume-theme-lucide',
  minyma: 'jsonresume-theme-minyma',
  'paper-plus-plus': 'jsonresume-theme-paper-plus-plus',
};
const require = createRequire(import.meta.url);

const freshRequire = (name: string): unknown => {
  const theme = require.resolve(name);
  const handlebars = createRequire(theme).resolve('handlebars');
  delete require.cache[handlebars];
  delete require.cache[theme];
  return require(name);
};

/** A resume as themes take it: any JSON object. */
export const ResumeDocument = Schema.Record(Schema.String, Schema.Unknown);
export type ResumeDocument = typeof ResumeDocument.Type;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Elegant (the default), professional and paper-plus-plus crash without
 * basics.location or basics.profiles; empty ones render as nothing.
 */
const withBasics = (resume: ResumeDocument): ResumeDocument => {
  const basics = isObject(resume['basics']) ? resume['basics'] : {};
  return {
    ...resume,
    basics: {
      ...basics,
      location: isObject(basics['location']) ? basics['location'] : {},
      profiles: Array.isArray(basics['profiles']) ? basics['profiles'] : [],
    },
  };
};

const loaded = new Map<string, Renderable>();

const load = (theme: string) =>
  Effect.tryPromise({
    try: async () => {
      const cached = loaded.get(theme);
      if (cached) return cached;
      const packageName = handlebarsThemes[theme];
      const loader = themeLoaders[theme];
      const mod = packageName ? freshRequire(packageName) : await loader?.();
      const renderable = resolveRenderable(mod);
      if (!renderable) throw new Error('the theme has no render function');
      if (!packageName) loaded.set(theme, renderable);
      return renderable;
    },
    catch: (error) => new ThemeFailed({ theme, message: String(error) }),
  });

/**
 * Render a resume as a complete HTML page with a gallery theme. Dates,
 * locations, project summaries and the basics are normalised first, the
 * way every theme expects them (#296, #323).
 */
export const renderTheme = Effect.fn('renderTheme')(function* (
  theme: string,
  resume: ResumeDocument
) {
  if (!isTheme(theme)) return yield* new ThemeNotFound({ theme });
  const renderable = yield* load(theme);
  const prepared = withProjectSummaries(
    withStringLocations(normalizeDates(withBasics(resume)))
  );
  const html = yield* Effect.tryPromise({
    try: async () => renderable.render(prepared),
    catch: (error) => new ThemeFailed({ theme, message: String(error) }),
  });
  if (typeof html !== 'string') {
    return yield* new ThemeFailed({
      theme,
      message: 'the theme did not return HTML',
    });
  }
  return ensureHtmlCharset(html);
});
