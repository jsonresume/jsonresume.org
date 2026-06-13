/**
 * Copies the source design-token stylesheet into dist/ so the published
 * `@jsonresume/core/tokens.css` export stays in lockstep with
 * src/styles/tokens.css. The committed dist/ artifacts are the source of
 * truth for consumers that don't run a build.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dist = join(root, 'dist');

mkdirSync(dist, { recursive: true });
copyFileSync(
  join(root, 'src', 'styles', 'tokens.css'),
  join(dist, 'tokens.css')
);

process.stdout.write('Built dist/tokens.css\n');
