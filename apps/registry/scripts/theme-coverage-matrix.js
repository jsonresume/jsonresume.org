#!/usr/bin/env node
/**
 * Theme QA: section-coverage matrix (#360)
 *
 * Renders EVERY theme registered in lib/formatters/template/themeConfig.js
 * with the complete @jsonresume/sample-data fixture and reports which JSON
 * Resume sections each theme actually renders.
 *
 * Detection: per-section sentinel strings. Union of the shared QA sentinels
 * (@jsonresume/theme-kit/qa — same as the vitest gate) and one PLANTED
 * sentinel item appended to every array section (unique token in the
 * name/title, secondary and summary fields), so themes that render only a
 * field the shared sentinels don't cover (e.g. interest names but not
 * keywords) are still detected. Matching is case-insensitive.
 *
 * Usage (after pnpm install, from repo root or apps/registry):
 *   node apps/registry/scripts/theme-coverage-matrix.js [options] > matrix.md
 *
 * Options:
 *   --theme=NAME  Only test a single theme
 *   --json        Emit raw JSON instead of markdown
 *
 * Markdown goes to stdout; progress goes to stderr.
 *
 * Theme loading (mirrors production getTheme.js/format.js as far as plain
 * Node allows):
 * 1. Await the registry's lazy thunk `() => import('pkg')` (#476/#495).
 * 2. If the import target is untransformable src JSX, require() the package
 *    ("default" condition → built dist entry, like webpack in production).
 * 3. Else import the package's dist/index.{js,mjs} directly, running the
 *    package's own `vite build` first when dist is absent (src-only themes).
 * Handlebars themes are fresh-required with the handlebars module evicted
 * from the cache per theme (same singleton fix as format.js).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { completeResume } from '@jsonresume/sample-data';
import { HANDLEBARS_THEMES, SECTION_SENTINELS } from '@jsonresume/theme-kit/qa';
import { normalizeDates } from '@jsonresume/utils/dates';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');
const registryRequire = createRequire(
  path.join(__dirname, '..', 'package.json')
);
const SECTIONS = Object.keys(SECTION_SENTINELS);
// prettier-ignore
const SHORT = {
  basics: 'bas', work: 'wrk', volunteer: 'vol', education: 'edu',
  awards: 'awd', certificates: 'cert', publications: 'pub', skills: 'skl',
  languages: 'lng', interests: 'int', references: 'ref', projects: 'prj',
};

const args = process.argv.slice(2);
const onlyTheme =
  args.find((a) => a.startsWith('--theme='))?.split('=')[1] || null;
const asJson = args.includes('--json');
const progress = (msg) => process.stderr.write(`${msg}\n`);

// Unique per-section tokens planted into an extra item per array section.
const TOKEN = Object.fromEntries(SECTIONS.map((s) => [s, `zx${s}sentinel`]));

function plantedFixture() {
  const r = JSON.parse(JSON.stringify(completeResume)); // deep clone (JSON-safe fixture)
  const t = TOKEN;
  const dates = { startDate: '2001-02-03', endDate: '2002-03-04' };
  const url = 'https://example.com';
  // prettier-ignore
  const extras = {
    work: { name: `${t.work} Industries`, position: `${t.work} Engineer`, summary: `Did ${t.work} things.`, highlights: [`${t.work} highlight`], url, ...dates },
    volunteer: { organization: `${t.volunteer} Society`, position: `${t.volunteer} Helper`, summary: `Helped with ${t.volunteer}.`, highlights: [`${t.volunteer} highlight`], url, ...dates },
    education: { institution: `${t.education} University`, area: `${t.education} Studies`, studyType: 'Bachelor', score: '4.0', courses: [`${t.education} 101`], url, ...dates },
    awards: { title: `${t.awards} Prize`, awarder: `${t.awards} Committee`, summary: `Won the ${t.awards}.`, date: '2003-04-05' },
    certificates: { name: `${t.certificates} Certification`, issuer: `${t.certificates} Institute`, date: '2004-05-06', url },
    publications: { name: `${t.publications} Quarterly`, publisher: `${t.publications} Press`, summary: `About ${t.publications}.`, releaseDate: '2005-06-07', url },
    skills: { name: `${t.skills} Wrangling`, level: 'Master', keywords: [`${t.skills} keyword`] },
    languages: { language: `${t.languages}ish`, fluency: `${t.languages} fluency` },
    interests: { name: `${t.interests} Collecting`, keywords: [`${t.interests} keyword`] },
    references: { name: `${t.references} Person`, reference: `A ${t.references} quote.` },
    projects: { name: `${t.projects} Project`, description: `Built the ${t.projects}.`, highlights: [`${t.projects} highlight`], keywords: [`${t.projects} keyword`], roles: ['Lead'], entity: `${t.projects} Org`, type: 'application', url, ...dates },
  };
  for (const [section, extra] of Object.entries(extras)) {
    r[section].push(extra);
  }
  return normalizeDates(r);
}

function coverageOf(html) {
  const lower = html.toLowerCase();
  const hit = (s) => lower.includes(s.toLowerCase());
  return Object.fromEntries(
    SECTIONS.map((s) => [s, SECTION_SENTINELS[s].some(hit) || hit(TOKEN[s])])
  );
}

/**
 * themeConfig.js uses ESM syntax in a CJS package scope; import it via a temp
 * .mjs copy in the same directory (identical specifier resolution).
 */
async function loadThemeRegistry() {
  const src = path.join(__dirname, '../lib/formatters/template/themeConfig.js');
  const tmp = path.join(
    path.dirname(src),
    `.theme-config.tmp-${process.pid}.mjs`
  );
  fs.copyFileSync(src, tmp);
  try {
    const { THEMES } = await import(pathToFileURL(tmp).href);
    return THEMES;
  } finally {
    fs.unlinkSync(tmp);
  }
}

// Interop identical to getTheme.js: render() on the namespace or on default.
const resolveRenderable = (mod) => {
  if (mod && typeof mod.render === 'function') {
    return mod;
  }
  if (mod?.default && typeof mod.default.render === 'function') {
    return mod.default;
  }
  return mod?.default ?? mod;
};

const specifierOf = (thunk) =>
  String(thunk).match(/import\(['"]([^'"]+)['"]\)/)?.[1] ?? null;

async function importDist(spec) {
  let dir = path.dirname(registryRequire.resolve(spec));
  while (!fs.existsSync(path.join(dir, 'package.json'))) {
    dir = path.dirname(dir);
  }
  const distEntry = () =>
    ['dist/index.js', 'dist/index.mjs']
      .map((f) => path.join(dir, f))
      .find(fs.existsSync);
  let file = distEntry();
  if (!file) {
    progress(`  ${spec}: no dist — running its vite build`);
    execSync(`pnpm --filter ${spec} run build`, {
      cwd: REPO_ROOT,
      stdio: ['ignore', 2, 2],
    });
    file = distEntry();
  }
  if (!file) {
    throw new Error(`no dist entry found for ${spec}`);
  }
  return import(pathToFileURL(file).href);
}

async function loadTheme(name, thunk) {
  const spec = specifierOf(thunk);
  if (HANDLEBARS_THEMES.includes(name)) {
    delete registryRequire.cache[registryRequire.resolve('handlebars')];
    delete registryRequire.cache[registryRequire.resolve(spec)];
    return resolveRenderable(registryRequire(spec));
  }
  try {
    return resolveRenderable(await thunk());
  } catch {
    /* src JSX etc. — fall through */
  }
  try {
    return resolveRenderable(registryRequire(spec));
  } catch {
    return resolveRenderable(await importDist(spec));
  }
}

async function run() {
  const THEMES = await loadThemeRegistry();
  const names = Object.keys(THEMES)
    .filter((n) => !onlyTheme || n === onlyTheme)
    .sort();
  if (names.length === 0) {
    throw new Error(`no themes matched "${onlyTheme}"`);
  }

  const resume = plantedFixture();
  const results = {};
  // Some themes (e.g. rickosborne) console.log during render; stdout is
  // reserved for the report, so divert their writes to stderr while rendering.
  const stdoutWrite = process.stdout.write.bind(process.stdout);
  for (const name of names) {
    process.stdout.write = (...a) => process.stderr.write(...a);
    try {
      const theme = await loadTheme(name, THEMES[name]);
      const html = await theme.render(resume);
      if (typeof html !== 'string' || html.length === 0) {
        throw new Error('rendered empty output');
      }
      results[name] = { coverage: coverageOf(html) };
    } catch (error) {
      results[name] = { error: error.message };
    } finally {
      process.stdout.write = stdoutWrite;
    }
    const r = results[name];
    const missing = r.coverage
      ? SECTIONS.filter((s) => !r.coverage[s])
      : SECTIONS;
    progress(
      `${name}: ${
        r.error
          ? `ERROR ${r.error}`
          : missing.length
          ? `missing ${missing.join(', ')}`
          : 'full coverage'
      }`
    );
  }
  process.stdout.write(asJson ? JSON.stringify(results, null, 2) : md(results));
}

function md(results) {
  const names = Object.keys(results);
  const ok = names.filter((n) => !results[n].error);
  const missingOf = (n) =>
    results[n].error
      ? SECTIONS
      : SECTIONS.filter((s) => !results[n].coverage[s]);
  const full = ok.filter((n) => missingOf(n).length === 0);
  const lines = [
    `## Theme section-coverage matrix (${names.length} themes)`,
    '',
    `Fixture: \`@jsonresume/sample-data\` complete resume, all ${SECTIONS.length} sections populated (plus one planted sentinel item per section). ✓ = section content found in rendered HTML.`,
    '',
    `Themes: **${names.length}** | render OK: **${
      ok.length
    }** | render errors: **${names.length - ok.length}** | full coverage: **${
      full.length
    }**`,
    '',
    `| theme | ${SECTIONS.map((s) => SHORT[s]).join(' | ')} | missing |`,
    `|---|${SECTIONS.map(() => '---').join('|')}|---|`,
  ];
  for (const n of names) {
    const { coverage, error } = results[n];
    const cells = SECTIONS.map((s) => (error ? '—' : coverage[s] ? '✓' : '✗'));
    const note = error
      ? `RENDER ERROR: ${error}`
      : missingOf(n).join(', ') || '— (full)';
    lines.push(`| \`${n}\` | ${cells.join(' | ')} | ${note} |`);
  }
  lines.push('', '### Per-section totals', '');
  lines.push('| section | rendered by | missing in |', '|---|---|---|');
  for (const s of SECTIONS) {
    const misses = ok.filter((n) => !results[n].coverage[s]);
    lines.push(
      `| ${s} | ${ok.length - misses.length}/${ok.length} | ${
        misses.map((n) => `\`${n}\``).join(', ') || '—'
      } |`
    );
  }
  const gaps = ok
    .map((n) => [n, missingOf(n)])
    .filter(([, m]) => m.length > 0)
    .sort((a, b) => b[1].length - a[1].length);
  const mostMissed = SECTIONS.map((s) => [
    s,
    ok.filter((n) => !results[n].coverage[s]).length,
  ])
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1]);
  lines.push(
    '',
    '### Summary',
    '',
    `- Full coverage: ${full.length}/${ok.length} rendering themes`,
    `- Most-missed sections: ${
      mostMissed.map(([s, c]) => `${s} (${c})`).join(', ') || 'none'
    }`,
    `- Themes with gaps: ${
      gaps.map(([n, m]) => `\`${n}\` (${m.length})`).join(', ') || 'none'
    }`,
    ''
  );
  return lines.join('\n');
}

run().catch((error) => {
  progress(`fatal: ${error.stack || error.message}`);
  process.exit(1);
});
