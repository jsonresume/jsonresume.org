# @repo/ui

Shared React UI component library for the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org). Built on [Radix UI](https://www.radix-ui.com/) primitives and Tailwind CSS (shadcn-style), it provides the buttons, inputs, and other components used across the `registry` and `homepage2` apps.

This is a private, internal workspace package (`@repo/ui`) consumed via the pnpm workspace — it is not published to npm.

## Usage

Import components from the package barrel within the monorepo:

```js
import { Button } from '@repo/ui';
```

Individual components are also reachable directly (e.g. `@repo/ui/components/button`), and styles are exported via `@repo/ui/styles.css` (alias `@repo/ui/globals.css`).

## Development

From `packages/ui`:

```
pnpm storybook        # run Storybook on port 6006
pnpm build-storybook  # build the static Storybook
pnpm lint             # run ESLint
pnpm ui:add           # add a shadcn-ui component
```

## Issues

Report bugs and request features in the [monorepo issue tracker](https://github.com/jsonresume/jsonresume.org/issues).
