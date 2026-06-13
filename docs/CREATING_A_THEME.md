# Creating a JSON Resume Theme

The fastest, correct way to start a new theme is the scaffolding generator. It
mirrors a known-good template (`berlin-grid`) and bakes in the lessons that
historically broke contributed themes, so a freshly scaffolded theme renders
all sections and passes CI on the first try.

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

| File             | Purpose                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`   | `private:false`, `version 0.1.0`, public `publishConfig`, peer deps `react 18\|\|19` + `react-dom`, deps `@jsonresume/core` + `styled-components`, Vite SSR build |
| `vite.config.js` | SSR library build (`vite build` -> `dist/index.js`)                                                                                                               |
| `index.jsx`      | `ServerStyleSheet` render entry; inlines CSS + Google Fonts CDN                                                                                                   |
| `src/Resume.jsx` | Complete starter rendering **all** JSON Resume sections                                                                                                           |
| `README.md`      | Per-theme dev/build notes                                                                                                                                         |

The generator does **not** edit any shared files — it prints the exact manual
registration steps (see below) so you wire the theme in deliberately.

## 2. Build and develop

```bash
pnpm install                                   # picks up the new workspace
pnpm --filter jsonresume-theme-<slug> build    # confirm it vite-builds

cd apps/registry && pnpm dev                    # dev server on :3000
open http://localhost:3000/thomasdavis?theme=<slug>
```

Redesign the styled-components in `src/Resume.jsx` into your own **visually
distinct** layout. See `docs/AGENT_THEME_DEVELOPMENT.md` for the layout-first
design process and the hyper-critical screenshot review checklist.

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

- **styled-components must be declared inline** in `src/Resume.jsx`. No
  `fs.readFileSync`, no external `.css` files. `index.jsx` collects them via
  `ServerStyleSheet` and inlines the result into `<head>`.
- **`<ContactInfo basics={basics} />` takes a single `basics` prop.** The
  component destructures `email`/`phone`/`url`/`location`/`profiles` off
  `basics` itself — do not spread those as individual props.
- **Never name a styled-component `Date`.** It shadows the global `Date` and
  crashes SSR. Use `MetaDate` / `DateLabel` / `Period`.
- **Load fonts via the Google Fonts CDN** in `index.jsx` (already wired).
- **Render every JSON Resume section** so the theme is complete.

## 5. The permanent `themeRenderQa` gate

Every registered theme is rendered against
`packages/test-fixtures/complete-resume.json` (every section populated) by the
registry vitest job. The gate asserts the render does not throw, returns
non-empty HTML, emits no raw artifacts (`[object Object]`, `undefined`, `NaN`),
and covers the baseline sections `basics` / `work` / `education` / `skills`.

Run it before opening a PR:

```bash
pnpm --filter registry test -- --run themeRenderQa
```

A scaffolded theme passes this gate out of the box. If you ever see a failure,
it almost always traces back to one of the SSR-inline rules above.

## 6. Quality gates before pushing

```bash
pnpm build         # turbo build (catches ~90% of deploy issues)
pnpm check         # turbo lint + typecheck
pnpm prettier      # formatting
```
