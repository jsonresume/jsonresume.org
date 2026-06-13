# Creating a JSON Resume Theme

The fastest, correct way to start a new theme is the scaffolding generator. It
emits an **ecosystem-native** theme built on the published `@jsonresume/*`
suite and bakes in the lessons that historically broke contributed themes, so a
freshly scaffolded theme renders all sections and passes CI on the first try.

## The ecosystem packages

A scaffolded theme is wired to the shared suite instead of reinventing it:

| Package                   | Role in a theme                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `@jsonresume/core`        | `renderResumeDocument` (the SSR document helper) + structural primitives              |
| `@jsonresume/core/ssr`    | the `renderResumeDocument` / `googleFontsLinks` entry used by `index.jsx`             |
| `@jsonresume/utils`       | pure, framework-free helpers: `formatDateRange`, `formatLocation`, `safeUrl`, …       |
| `@jsonresume/theme-kit`   | `runThemeRenderQa` — the exact registry render-QA gate, run from the theme's own test |
| `@jsonresume/sample-data` | `completeResume` — the canonical every-section fixture the gate renders against       |

`@jsonresume/core` and `@jsonresume/utils` are runtime deps;
`@jsonresume/theme-kit` and `@jsonresume/sample-data` are devDeps (test only).

## 1. Scaffold

```bash
pnpm gen:theme <slug> "Display Name"
# e.g.
pnpm gen:theme harbor-light "Harbor Light"
```

- `<slug>` must be lowercase kebab-case (`harbor-light`). It becomes the package
  name `jsonresume-theme-<slug>` and the `?theme=<slug>` query value.
- `"Display Name"` is optional; it defaults to a title-cased slug.

This creates `packages/themes/jsonresume-theme-<slug>/`:

| File                  | Purpose                                                                                                                                                                                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`        | `private:false`, `version 0.1.0`, public `publishConfig`, peer deps `@jsonresume/core` + `react 18\|\|19` + `react-dom`, deps `@jsonresume/core` + `@jsonresume/utils` + `styled-components`, devDeps `@jsonresume/theme-kit` + `@jsonresume/sample-data`, Vite SSR build, `test` script |
| `vite.config.js`      | SSR library build (`vite build` -> `dist/index.js`)                                                                                                                                                                                                                                      |
| `vitest.config.js`    | test config (node env, automatic JSX runtime)                                                                                                                                                                                                                                            |
| `index.jsx`           | SSR render entry — calls `renderResumeDocument` from `@jsonresume/core/ssr` (no hand-rolled `ServerStyleSheet`/`<!DOCTYPE>` boilerplate)                                                                                                                                                 |
| `src/Resume.jsx`      | Complete starter rendering **all** JSON Resume sections with inline styled-components + `@jsonresume/utils` helpers                                                                                                                                                                      |
| `tests/theme.test.js` | render-QA test dogfooding `runThemeRenderQa` (theme-kit) against `completeResume` (sample-data)                                                                                                                                                                                          |
| `README.md`           | Per-theme dev/build/test notes                                                                                                                                                                                                                                                           |

The generator does **not** edit any shared files — it prints the exact manual
registration steps (see below) so you wire the theme in deliberately.

## 2. Build, test, and develop

```bash
pnpm install                                   # picks up the new workspace
pnpm --filter jsonresume-theme-<slug> build    # confirm it vite-builds
pnpm --filter jsonresume-theme-<slug> test     # run the theme-kit render gate

cd apps/registry && pnpm dev                    # dev server on :3000
open http://localhost:3000/thomasdavis?theme=<slug>
```

Redesign the styled-components in `src/Resume.jsx` into your own **visually
distinct** layout. Reach for the `@jsonresume/utils` helpers
(`formatDateRange`, `formatLocation`, `safeUrl`) instead of reimplementing date,
location, or URL handling. See `docs/AGENT_THEME_DEVELOPMENT.md` for the
layout-first design process and the hyper-critical screenshot review checklist.

## 3. Registration checklist

The generator prints these with your slug filled in. You must do them by hand:

1. **`apps/registry/lib/formatters/template/themeConfig.js`** — add the import
   alongside the other themes and an entry in the `THEMES` object:

   ```js
   import * as harborLight from 'jsonresume-theme-harbor-light';
   // ...
   export const THEMES = {
     // ...
     'harbor-light': harborLight,
   };
   ```

2. **`packages/theme-config/src/metadata.js`** — add an entry to
   `THEME_METADATA` (`name`, `description`, `author`, `tags`).

3. **`apps/registry/package.json`** — add the workspace dependency, then
   re-run `pnpm install`:

   ```json
   "jsonresume-theme-harbor-light": "workspace:*",
   ```

4. **Changeset** — run `pnpm changeset`, select the theme package, choose
   `minor`, describe it, and end the summary with `Refs #275.`

## 4. The SSR-inline rule (do not break it)

Themes are rendered **server-side with no client hydration**. The scaffold is
already correct; keep it that way:

- **`index.jsx` calls `renderResumeDocument`** from `@jsonresume/core/ssr`. That
  helper owns the `ServerStyleSheet` collection, the Google Fonts `<link>`s, and
  the full `<!DOCTYPE html>` document — pass it the React tree plus the
  `{ fonts, title, includeTokensCss }` options. Do **not** reintroduce
  hand-rolled `renderToString` + `ServerStyleSheet` boilerplate.
- **styled-components must be declared inline** in `src/Resume.jsx`. No
  `fs.readFileSync`, no external `.css` files — `renderResumeDocument` collects
  and inlines them into `<head>`.
- **Use `@jsonresume/utils` helpers** (`formatDateRange`, `formatLocation`,
  `safeUrl`) instead of reimplementing date/location/URL logic.
- **`<ContactInfo basics={basics} />` takes a single `basics` prop.** The
  component destructures `email`/`phone`/`url`/`location`/`profiles` off
  `basics` itself — do not spread those as individual props.
- **Never name a styled-component `Date`.** It shadows the global `Date` and
  crashes SSR. Use `MetaDate` / `DateLabel` / `Period`.
- **Set `fonts` in `index.jsx`** to the family used by your `src/Resume.jsx`
  `font-family` — they load from the Google Fonts CDN.
- **Render every JSON Resume section** so the theme is complete.

## 5. The render-QA gate (theme-kit + registry)

A scaffolded theme ships its **own** render-QA test at `tests/theme.test.js`. It
dogfoods `runThemeRenderQa` from `@jsonresume/theme-kit` against `completeResume`
from `@jsonresume/sample-data` — the **identical** gate the registry enforces.
It asserts the render does not throw, returns non-empty HTML, emits no raw
artifacts (`[object Object]`, `undefined`, `NaN`), and covers the baseline
sections `basics` / `work` / `education` / `skills`.

Run the theme's own test, then the registry's all-theme gate, before a PR:

```bash
pnpm --filter jsonresume-theme-<slug> test         # this theme's theme-kit gate
pnpm --filter registry test -- --run themeRenderQa  # every registered theme
```

A scaffolded theme passes both out of the box. If you ever see a failure, it
almost always traces back to one of the SSR-inline rules above.

## 6. Quality gates before pushing

```bash
pnpm build         # turbo build (catches ~90% of deploy issues)
pnpm check         # turbo lint + typecheck
pnpm prettier      # formatting
```
