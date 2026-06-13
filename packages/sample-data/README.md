# @jsonresume/sample-data

Sample [JSON Resume](https://jsonresume.org) fixtures for tests, demos, and theme development.

Ships a complete every-section resume plus a minimal subset, so you can render or validate against realistic data without hand-rolling a fixture.

## Install

```bash
npm install --save-dev @jsonresume/sample-data
```

## API

Named exports from the root (`.`):

| Export | Description |
| --- | --- |
| `completeResume` | An every-section resume (`basics` + all 12 standard sections). The canonical fixture used by the registry theme-render QA gate. |
| `minimalResume` | A small `basics` + first `work` / `education` / `skills` subset, derived from `completeResume` so it never drifts from the canonical shape. |
| `resumeSample` | A second, fuller sample resume kept alongside the complete fixture. |

A default export bundles all three: `{ completeResume, minimalResume, resumeSample }`.

The raw JSON is also reachable directly:

```js
import complete from '@jsonresume/sample-data/complete-resume.json';
import sample from '@jsonresume/sample-data/resume-sample.json';
```

## Usage

Render a theme against the complete fixture in a test:

```js
import { completeResume } from '@jsonresume/sample-data';
import { render } from 'jsonresume-theme-flat';

test('theme renders every section', () => {
  const html = render(completeResume);
  expect(html).toContain(completeResume.basics.name);
});
```

Use the minimal fixture for fast, focused tests:

```js
import { minimalResume } from '@jsonresume/sample-data';

expect(minimalResume.work).toHaveLength(1);
expect(minimalResume.basics).toBeDefined();
```

Import the default export when you want everything at once:

```js
import samples from '@jsonresume/sample-data';

const { completeResume, minimalResume, resumeSample } = samples;
```

## Ecosystem

Part of the [JSON Resume](https://jsonresume.org) ecosystem. See the roadmap and related packages in [jsonresume/jsonresume.org#421](https://github.com/jsonresume/jsonresume.org/issues/421).

## License

MIT
