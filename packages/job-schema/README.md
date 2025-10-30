# @jsonresume/job-schema

Shared Job Description schema, validation helpers, and JSON Schema artifacts used across the JSON Resume ecosystem.

## Features

- ✅ **Type-safe Zod schema** for job descriptions.
- ✅ **Generated JSON Schema** (`schema.json`) for tooling or API validation.
- ✅ **Helper utilities** to parse and validate job description payloads.

## Usage

Install via workspace:

```bash
pnpm add @jsonresume/job-schema
```

Import the schema, JSON Schema, or helpers:

```ts
import {
  jobDescriptionSchema,
  jobDescriptionJsonSchema,
  parseJobDescription,
  validateJobDescription,
} from '@jsonresume/job-schema';

const parsed = parseJobDescription(payload);
```

Need the JSON Schema file directly?

```ts
import jobSchemaJson from '@jsonresume/job-schema/schema.json' assert { type: 'json' };
```

## Scripts

- `pnpm run build` – cleans, compiles TypeScript, and regenerates `schema.json`.
- `pnpm run typecheck` – runs TypeScript without emitting files.

## License

MIT © JSON Resume
