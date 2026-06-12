# @repo/theme-config

Shared theme configuration and metadata for JSON Resume themes. This package exposes the theme metadata (names, display info, helpers like `getRandomTheme`) consumed by both the `registry` and `homepage2` apps in the monorepo.

This is a private, internal workspace package (`@repo/theme-config`) — it is not published to npm.

## Usage

```js
import { THEME_METADATA, THEME_NAMES, getRandomTheme } from '@repo/theme-config';
```

Metadata is also available directly via `@repo/theme-config/metadata`.

## Development

From `packages/theme-config`:

```
pnpm lint   # run ESLint
```

## Part of the jsonresume.org monorepo

See the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org). Report issues in the [monorepo issue tracker](https://github.com/jsonresume/jsonresume.org/issues).
