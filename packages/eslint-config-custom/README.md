# @repo/eslint-config-custom

Shared ESLint configuration for the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org). It centralizes lint rules (extending `eslint:recommended`, `prettier`, and `next`, plus TypeScript and React variants) so every app and package lints consistently.

## Usage

Extend the appropriate config from a package's `.eslintrc`:

```js
module.exports = {
  root: true,
  extends: ['@repo/eslint-config-custom/next'],
};
```

Available configs:

- `@repo/eslint-config-custom` — base config (`index.js`)
- `@repo/eslint-config-custom/next` — Next.js apps
- `@repo/eslint-config-custom/react` — React libraries
- `@repo/eslint-config-custom/typescript` — TypeScript projects

## Part of the jsonresume.org monorepo

Report issues in the [monorepo issue tracker](https://github.com/jsonresume/jsonresume.org/issues).
