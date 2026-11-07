import { stat } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

/** Allow render verification to overlap builds without reading stale output. */
export async function themeBuildReady(slug: string) {
  const folder = `packages/themes/jsonresume-theme-${slug}`;
  const sources = await Promise.all(
    ['index.ts', 'design.css.ts'].map((file) => stat(`${folder}/src/${file}`))
  );
  const changed = Math.max(...sources.map((file) => file.mtimeMs));
  const deadline = Date.now() + 15 * 60_000;
  while (Date.now() < deadline) {
    const built = await stat(`${folder}/dist/index.js`).catch(() => null);
    if (built && built.mtimeMs >= changed) return;
    await setTimeout(1000);
  }
  throw new Error(`Timed out waiting for the current build of ${slug}`);
}
