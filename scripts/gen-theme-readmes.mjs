#!/usr/bin/env node
/**
 * gen-theme-readmes.mjs
 *
 * Generates a per-theme README.md for every theme package under
 * packages/themes/* that does not already have one, driven by the real theme
 * metadata in packages/theme-config/src/metadata.js.
 *
 * npm renders a package's README on its package page, so without these files
 * the theme packages look empty/unmaintained. This generator produces a
 * consistent, metadata-driven README for each theme that lacks one.
 *
 * It is non-destructive and idempotent: themes that already ship a README
 * (including hand-authored ones) are left untouched, and re-running the
 * script produces no changes. It automatically covers any future theme
 * package added under packages/themes/.
 *
 * Usage:
 *   node scripts/gen-theme-readmes.mjs            # generate missing READMEs
 *   node scripts/gen-theme-readmes.mjs --force    # also overwrite existing ones
 */

import {
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
  writeFileSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const THEMES_DIR = join(REPO_ROOT, 'packages', 'themes');
const METADATA_PATH = join(
  REPO_ROOT,
  'packages',
  'theme-config',
  'src',
  'metadata.js'
);
const SCREENSHOTS_DIR = join(
  REPO_ROOT,
  'apps',
  'homepage2',
  'public',
  'img',
  'themes'
);

const RAW_BASE =
  'https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/apps/homepage2/public/img/themes';

const STANDARD_SECTIONS = [
  'work',
  'education',
  'skills',
  'projects',
  'volunteer',
  'awards',
  'publications',
  'languages',
  'interests',
  'references',
];

const FORCE = process.argv.includes('--force');

/** Turn a slug like "new-york-editorial" into "New York Editorial". */
function humanize(slug) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Append a trailing period if the text doesn't already end a sentence. */
function ensureSentence(text) {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

async function loadMetadata() {
  // Imported dynamically so the script works regardless of CWD.
  const mod = await import(`file://${METADATA_PATH}`);
  return mod.THEME_METADATA || {};
}

/** Read a package.json safely; returns null if missing/invalid. */
function readPkg(dir) {
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) return null;
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Derive the registry/CLI slug from a package name: drop any npm scope and
 * the standard theme prefix.
 *   "@jsonresume/theme-stackoverflow"            -> "stackoverflow"
 *   "jsonresume-theme-new-york-editorial"        -> "new-york-editorial"
 *   "@jsonresume/jsonresume-theme-professional"  -> "professional"
 */
function slugFromPkgName(name) {
  const unscoped = name.replace(/^@[^/]+\//, '');
  return unscoped.replace(/^(jsonresume-)?theme-/, '');
}

/** Build the README contents for one theme. */
function buildReadme({ slug, meta, pkg }) {
  const displayName = (meta && meta.name) || humanize(slug);
  const pkgName = pkg.name;
  const license = pkg.license || 'MIT';

  const description =
    meta && meta.description
      ? ensureSentence(meta.description)
      : `A JSON Resume theme. ${displayName} renders your resume.json into a polished, ready-to-share document.`;

  const lines = [];
  lines.push(`# ${displayName}`);
  lines.push('');
  lines.push(description);
  lines.push('');

  // Preview image — only if the screenshot actually exists, so the image
  // never 404s on npmjs.com.
  if (existsSync(join(SCREENSHOTS_DIR, `${slug}.png`))) {
    lines.push(`![${displayName} theme preview](${RAW_BASE}/${slug}.png)`);
    lines.push('');
  }

  // Tags, when present, give npm searchers a quick sense of the theme.
  if (meta && Array.isArray(meta.tags) && meta.tags.length) {
    lines.push(`**Tags:** ${meta.tags.join(', ')}`);
    lines.push('');
  }

  lines.push('## Use it');
  lines.push('');
  lines.push('Preview it live on the JSON Resume registry:');
  lines.push('');
  lines.push(`- https://registry.jsonresume.org/thomasdavis?theme=${slug}`);
  lines.push('');
  lines.push('Install and use it with the JSON Resume CLI:');
  lines.push('');
  lines.push('```sh');
  lines.push(`npm install ${pkgName}`);
  lines.push(`resume export resume.html --theme ${slug}`);
  lines.push('```');
  lines.push('');

  lines.push('## Sections');
  lines.push('');
  lines.push(
    `Renders all standard JSON Resume sections: ${STANDARD_SECTIONS.join(
      ', '
    )}.`
  );
  lines.push('');

  lines.push('## Development');
  lines.push('');
  lines.push(
    'This theme lives in the [jsonresume.org](https://github.com/jsonresume/jsonresume.org) monorepo. Build it from the repo root with:'
  );
  lines.push('');
  lines.push('```sh');
  lines.push(`pnpm --filter ${pkgName} build`);
  lines.push('```');
  lines.push('');

  lines.push('## License');
  lines.push('');
  lines.push(license);

  return lines.join('\n') + '\n';
}

async function main() {
  if (!existsSync(THEMES_DIR)) {
    console.error(`themes directory not found: ${THEMES_DIR}`);
    process.exit(1);
  }

  const metadata = await loadMetadata();

  const dirs = readdirSync(THEMES_DIR)
    .map((name) => join(THEMES_DIR, name))
    .filter((p) => {
      try {
        return statSync(p).isDirectory();
      } catch {
        return false;
      }
    })
    .sort();

  let written = 0;
  let kept = 0;
  let skipped = 0;
  const results = [];

  for (const dir of dirs) {
    const pkg = readPkg(dir);
    if (!pkg || !pkg.name) {
      skipped += 1;
      results.push(`skip  (no package.json): ${dir}`);
      continue;
    }

    const readmePath = join(dir, 'README.md');
    if (existsSync(readmePath) && !FORCE) {
      // Never clobber an existing (often hand-authored) README.
      kept += 1;
      results.push(`keep  (already has README): ${pkg.name}`);
      continue;
    }

    const slug = slugFromPkgName(pkg.name);
    const meta = metadata[slug];
    writeFileSync(readmePath, buildReadme({ slug, meta, pkg }), 'utf8');
    written += 1;
    results.push(
      `write ${pkg.name}${meta ? '' : ' (no metadata, generic intro)'}`
    );
  }

  for (const line of results) console.log(line);
  console.log(
    `\nDone: ${written} written, ${kept} kept, ${skipped} skipped (${dirs.length} theme dirs).`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
