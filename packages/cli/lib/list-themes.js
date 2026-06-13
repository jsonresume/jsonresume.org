const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const THEME_PREFIX = 'jsonresume-theme-';

// Read a theme package's `package.json` (best effort). Returns null if the
// directory is not a readable npm package — keeps discovery dependency-free
// and resilient to half-installed/broken folders.
const readThemePkg = (themeDir) => {
  try {
    const raw = fs.readFileSync(path.join(themeDir, 'package.json'), 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
};

// List the immediate child directories of a node_modules folder that look like
// JSON Resume theme packages (`jsonresume-theme-*`). Returns one entry per
// theme with its slug (the name passed to `--theme`), full package name,
// version and description. Missing/unreadable folders yield an empty list.
const listThemesInDir = (nodeModulesDir) => {
  let entries;
  try {
    entries = fs.readdirSync(nodeModulesDir, { withFileTypes: true });
  } catch (err) {
    return [];
  }
  const themes = [];
  for (const entry of entries) {
    // Tolerate environments where `withFileTypes` is unavailable.
    const name = entry.name || entry;
    if (typeof name !== 'string' || !name.startsWith(THEME_PREFIX)) {
      continue;
    }
    // Ignore the prefix itself with nothing after it.
    const slug = name.slice(THEME_PREFIX.length);
    if (!slug) {
      continue;
    }
    const pkg = readThemePkg(path.join(nodeModulesDir, name));
    if (!pkg) {
      continue;
    }
    themes.push({
      slug,
      name,
      version: typeof pkg.version === 'string' ? pkg.version : null,
      description: typeof pkg.description === 'string' ? pkg.description : null,
    });
  }
  return themes;
};

// Build the list of `node_modules` directories to scan: every `node_modules`
// from `cwd` up to the filesystem root (covers local + monorepo installs),
// plus any directories supplied via `extraNodeModules` (e.g. the global root).
const candidateNodeModules = (cwd, extraNodeModules) => {
  const dirs = [];
  let current = path.resolve(cwd);
  // Walk up the tree collecting node_modules at each level.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    dirs.push(path.join(current, 'node_modules'));
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  for (const extra of extraNodeModules) {
    if (extra) {
      dirs.push(extra);
    }
  }
  return dirs;
};

// Discover installed JSON Resume themes.
//
// Scans `node_modules` from the current working directory up the tree plus any
// `extraNodeModules` (the global install root by default) for
// `jsonresume-theme-*` packages. Returns a list of unique themes sorted by
// slug. The first occurrence of a slug wins, so a project-local install
// shadows a global one — matching how `require.resolve` would pick a theme.
//
// Pure and network-free: callers inject `cwd` and `extraNodeModules` in tests.
const discoverThemes = ({
  cwd = process.cwd(),
  extraNodeModules = [],
} = {}) => {
  const seen = new Set();
  const themes = [];
  for (const dir of candidateNodeModules(cwd, extraNodeModules)) {
    for (const theme of listThemesInDir(dir)) {
      if (seen.has(theme.slug)) {
        continue;
      }
      seen.add(theme.slug);
      themes.push(theme);
    }
  }
  themes.sort((a, b) => a.slug.localeCompare(b.slug));
  return themes;
};

// Render the discovered themes as a clean, copy-pasteable block. Each line
// shows the slug to pass to `--theme`. When nothing is installed we point the
// user at how to install a theme; either way we link the full gallery.
const formatThemesList = (themes) => {
  const lines = [];
  if (themes.length === 0) {
    lines.push(chalk.yellow('No JSON Resume themes found in node_modules.'));
    lines.push(
      `Install one:    ${chalk.cyan('npm install jsonresume-theme-even')}`,
    );
  } else {
    const count = themes.length;
    lines.push(
      chalk.bold(
        `Installed themes (${count}) — pass the slug to ${chalk.cyan(
          '--theme',
        )}:`,
      ),
    );
    const width = themes.reduce((max, t) => Math.max(max, t.slug.length), 0);
    for (const theme of themes) {
      const slug = chalk.green(theme.slug.padEnd(width));
      const version = theme.version ? chalk.dim(` v${theme.version}`) : '';
      lines.push(`  ${slug}${version}`);
    }
    lines.push('');
    lines.push(
      `Use it:         ${chalk.cyan(
        `resume export resume.html --theme ${themes[0].slug}`,
      )}`,
    );
  }
  lines.push(
    `Browse the full gallery:  ${chalk.cyan('https://jsonresume.org/themes/')}`,
  );
  return lines.join('\n');
};

module.exports = {
  THEME_PREFIX,
  discoverThemes,
  listThemesInDir,
  formatThemesList,
};
