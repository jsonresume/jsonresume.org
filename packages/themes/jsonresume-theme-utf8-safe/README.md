# jsonresume-theme-utf8-safe

> UTF-8 Safe — a theme for [JSON Resume](https://jsonresume.org).

Scaffolded with `pnpm gen:theme`. It is **ecosystem-native**: built on the
published `@jsonresume/*` suite, it renders every JSON Resume section and ships
with the permanent `themeRenderQa` gate as its own test. Make it your own by
editing the styled-components in `src/Resume.jsx`.

## Built on

| Package                 | Used for                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| `@jsonresume/core`      | `renderResumeDocument` (SSR doc) + structural primitives          |
| `@jsonresume/utils`     | `formatDateRange` / `formatLocation` / `safeUrl` (pure helpers)   |
| `@jsonresume/theme-kit` | `runThemeRenderQa` render-QA gate (dev)                           |
| `@jsonresume/sample-data` | `completeResume` fixture for the test (dev)                     |

## Structure

| File                 | Purpose                                                      |
| -------------------- | ------------------------------------------------------------ |
| `index.jsx`          | SSR entry — calls `renderResumeDocument` from core/ssr       |
| `src/Resume.jsx`     | The theme: all sections + inline styled-components           |
| `tests/theme.test.js`| theme-kit render-QA gate against the sample resume           |
| `vite.config.js`     | SSR library build (`vite build` -> `dist/`)                  |
| `vitest.config.js`   | test config (node env, automatic JSX)                        |

## Develop

```bash
# From the repo root, with the registry dev server running:
cd apps/registry && pnpm dev
# Preview at:
open http://localhost:3000/thomasdavis?theme=utf8-safe
```

## Test

```bash
pnpm --filter jsonresume-theme-utf8-safe test
```

## Build

```bash
pnpm --filter jsonresume-theme-utf8-safe build
```

## Rules baked in (keep these)

- styled-components are declared **inline** in `src/Resume.jsx` — no `fs` reads.
  `index.jsx` hands the tree to `renderResumeDocument`, which collects + inlines
  the CSS server-side.
- Reach for **`@jsonresume/utils`** helpers instead of reimplementing dates,
  location, or URL handling.
- `<ContactInfo basics={basics} />` takes a **single** `basics` prop.
- Never name a styled-component `Date` (it shadows the global and crashes SSR).
- Render **all** JSON Resume sections so the theme stays complete.

See `docs/CREATING_A_THEME.md` for the full registration checklist.
