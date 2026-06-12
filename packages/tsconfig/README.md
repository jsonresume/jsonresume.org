# tsconfig

Shared TypeScript configurations for the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org). Apps and packages extend these base configs instead of duplicating compiler options.

## Usage

Reference the relevant config from a package's `tsconfig.json`:

```json
{
  "extends": "tsconfig/nextjs.json"
}
```

Available configs:

- `base.json` — default base compiler options
- `nextjs.json` — Next.js apps
- `react-library.json` — React libraries

## Part of the jsonresume.org monorepo

Report issues in the [monorepo issue tracker](https://github.com/jsonresume/jsonresume.org/issues).
