# @jsonresume/ui

The JSON Resume design system: typed design tokens and accessible React components in the jsonresume.org style. Documentation and live examples: [styleguide.jsonresume.org](https://styleguide.jsonresume.org) (source in `apps/styleguide`).

- **Tokens** are one TypeScript source of truth (`src/tokens/theme.ts`). They compile to CSS custom properties with stable names (`--jr-color-text-default`), typed references (`vars` from `@jsonresume/ui/tokens`) and `tokens.json`.
- **Styles** are written in TypeScript with [vanilla-extract](https://vanilla-extract.style) and compiled to one static stylesheet. No Tailwind, and no runtime styling.
- **Components** build on native elements and Radix primitives, with tests for behavior and axe checks.

## Use

```tsx
import '@jsonresume/ui/fonts.css'; // optional self-hosted Open Sans + Ubuntu
import '@jsonresume/ui/styles.css';
import { base, Button } from '@jsonresume/ui';

<body className={base}>
  <Button variant="primary">Get started</Button>
</body>;
```

Dark mode is opt-in: `data-theme="dark"` (or `"system"`) on any element.

## Develop

```bash
pnpm --filter @jsonresume/ui build      # dist/ (ES modules, styles.css, types, tokens.json)
pnpm --filter @jsonresume/ui test       # vitest + Testing Library + axe + token contrast
pnpm --filter @jsonresume/ui typecheck
pnpm --filter styleguide dev            # docs on http://localhost:3005
```

Adding a component: `src/components/<name>/<name>.css.ts` (styles from `vars` only), `<name>.tsx`, tests, an example in `apps/styleguide/examples/<name>/`, and an entry in `apps/styleguide/lib/components.ts`. See the Contributing page.

`packages/ui-legacy` (`@repo/ui`) is the previous shadcn/Tailwind library, still used by the registry until it migrates.
