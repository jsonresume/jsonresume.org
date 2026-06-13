# @jsonresume/theme-metadata

The theme registry metadata for [JSON Resume](https://jsonresume.org) themes — the single source of truth for theme display names, descriptions, tags, and authors used on jsonresume.org.

Use it to build your own theme gallery, theme picker, or any UI/tooling that needs to list or describe the available JSON Resume themes, without depending on the (heavy) theme rendering packages.

> Formerly the private `@repo/theme-config` workspace package. The metadata and exports are identical; it is now published publicly so external consumers can use it.

## Install

```
npm install @jsonresume/theme-metadata
```

## Exports

```js
import {
  THEME_METADATA,
  THEME_NAMES,
  getRandomTheme,
} from '@jsonresume/theme-metadata';
```

- `THEME_METADATA` — an object keyed by theme slug. Each entry has:
  - `name` — human-readable display name
  - `description` — one-line summary of the look/intent
  - `author` — theme author
  - `tags` — string array for filtering/search
- `THEME_NAMES` — `Object.keys(THEME_METADATA)`, the array of theme slugs.
- `getRandomTheme()` — returns a random theme slug (useful for "surprise me" / preview UIs).

The metadata is also available directly via the `./metadata` subpath:

```js
import { THEME_METADATA } from '@jsonresume/theme-metadata/metadata';
```

This package contains metadata only — it does not import or render any themes.

## Example: a theme gallery

```js
import { THEME_METADATA, THEME_NAMES } from '@jsonresume/theme-metadata';

function getGalleryItems() {
  return THEME_NAMES.map((slug) => {
    const { name, description, tags } = THEME_METADATA[slug];
    return {
      slug,
      name,
      description,
      tags,
      // render a live preview from the registry:
      preview: `https://registry.jsonresume.org/thomasdavis?theme=${slug}`,
    };
  });
}
```

## Part of the jsonresume.org monorepo

See the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org). Report issues in the [monorepo issue tracker](https://github.com/jsonresume/jsonresume.org/issues).
