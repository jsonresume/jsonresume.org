#!/usr/bin/env node
// check-theme-dist-sync.mjs
//
// Guards against stale committed theme dist/.
//
// ~46 theme packages under packages/themes/* commit a built dist/ and publish
// with `main: ./dist/index.js`. The release pipeline (`pnpm changeset publish`)
// has NO pre-publish build step, so whatever dist/ is committed is exactly what
// ships to npm. If a contributor edits a theme's src/ without rebuilding dist/,
// npm ships STALE code.
//
// This script rebuilds every dist-tracked theme from source and fails if any
// theme's freshly built dist/ differs from what is committed in git. Run it in
// CI on push(master) + pull_request + merge_group.
//
// Usage: node scripts/check-theme-dist-sync.mjs
// Exit 0 = all committed dist/ in sync. Exit 1 = drift (listed) or error.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

function git(args, opts = {}) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  });
}

// Discover theme packages that (a) track files under dist/ in git and
// (b) declare a build script. These are exactly the packages where stale
// committed dist/ would ship to npm.
function discoverThemes() {
  const tracked = git(['ls-files', '--', 'packages/themes/*/dist/**'])
    .split('\n')
    .filter(Boolean);

  const dirs = new Set();
  for (const file of tracked) {
    // packages/themes/<theme>/dist/...
    const parts = file.split('/');
    if (parts.length < 4 || parts[3] !== 'dist') continue;
    dirs.add(parts.slice(0, 3).join('/'));
  }

  const themes = [];
  for (const rel of [...dirs].sort()) {
    const pkgPath = join(repoRoot, rel, 'package.json');
    if (!existsSync(pkgPath)) continue;
    let pkg;
    try {
      pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    } catch (err) {
      console.error(`Failed to parse ${rel}/package.json: ${err.message}`);
      continue;
    }
    if (!pkg.scripts || !pkg.scripts.build) continue;
    themes.push({ rel, name: pkg.name });
  }
  return themes;
}

function distIsDirty(themeRel) {
  // Untracked dist files (e.g. a newly emitted chunk) also count as drift.
  const status = git([
    'status',
    '--porcelain',
    '--',
    `${themeRel}/dist`,
  ]).trim();
  return status.length > 0;
}

function main() {
  const themes = discoverThemes();
  if (themes.length === 0) {
    console.error('No dist-tracked theme packages found — nothing to check.');
    process.exit(1);
  }

  console.log(
    `Checking committed dist/ for ${themes.length} theme package(s)...`
  );

  // Build all themes in one turbo pass: parallel + respects ^build so each
  // theme's workspace deps (e.g. @jsonresume/core) are built first.
  const filters = themes.flatMap((t) => ['--filter', t.name]);
  const build = spawnSync(
    'pnpm',
    ['exec', 'turbo', 'run', 'build', ...filters],
    { cwd: repoRoot, stdio: 'inherit', env: { ...process.env } }
  );
  if (build.status !== 0) {
    console.error('\nTheme build failed — cannot verify dist sync.');
    process.exit(build.status || 1);
  }

  const drifted = themes.filter((t) => distIsDirty(t.rel));

  if (drifted.length === 0) {
    console.log(
      `\nAll ${themes.length} theme dist/ bundles are in sync with source.`
    );
    process.exit(0);
  }

  console.error(
    `\nStale committed dist/ detected in ${drifted.length} theme(s):\n`
  );
  for (const t of drifted) {
    console.error(
      `  - ${t.name} (${relative(repoRoot, join(repoRoot, t.rel))})`
    );
  }
  console.error(
    '\nThe committed dist/ no longer matches a fresh build of src/.\n' +
      'Because `changeset publish` ships dist/ as-is (no pre-publish build),\n' +
      'this would publish stale code to npm.\n\n' +
      'Fix: rebuild the affected theme(s) and commit dist/, e.g.\n' +
      `  pnpm --filter <theme> build && git add <theme>/dist\n\n` +
      'Drift diff (truncated):'
  );
  try {
    const diff = git([
      'diff',
      '--stat',
      '--',
      ...drifted.map((t) => `${t.rel}/dist`),
    ]);
    console.error(diff);
  } catch {
    /* best-effort diagnostics */
  }
  process.exit(1);
}

main();
