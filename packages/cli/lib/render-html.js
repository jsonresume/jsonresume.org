import { ThemeNotFoundError } from './theme-errors';

const { pathToFileURL } = require('url');

const tryResolve = (...args) => {
  try {
    return require.resolve(...args);
  } catch (err) {
    return false;
  }
};

// Resolve a theme reference (relative path, full package name, or short name
// missing the `jsonresume-theme-` prefix) to an absolute module path. Shared
// by every code path that loads a theme (HTML render, PDF export) so a theme
// that renders to HTML can never spuriously fail to resolve elsewhere.
export const resolveThemePath = (themePath) => {
  const cwd = process.cwd();
  // The user's project first, then the CLI's own install, so the themes the
  // CLI ships with resolve on global and npx installs too.
  const paths = [cwd, __dirname];
  let path;
  if (themePath[0] === '.') {
    path = tryResolve(require('path').join(cwd, themePath), { paths: [cwd] });
    if (!path) {
      throw new ThemeNotFoundError(themePath);
    }
  }
  if (!path) {
    path = tryResolve(themePath, { paths });
  }
  // Only fall back to the `jsonresume-theme-` prefix for bare short names;
  // scoped or otherwise non-alphanumeric-leading specifiers are used as-is.
  if (!path && /^[a-z0-9]/i.test(themePath)) {
    path = tryResolve(`jsonresume-theme-${themePath}`, { paths });
  }
  if (!path) {
    throw new ThemeNotFoundError(themePath);
  }
  return path;
};

// Babel compiles `import()` to `require()`, so keep a real dynamic import for
// ESM-only themes on Node versions whose require() cannot load ESM.
// eslint-disable-next-line no-new-func
const importModule = new Function('specifier', 'return import(specifier)');

// Whether Node treats a file as ESM: `.mjs`, or `.js` under a package.json
// with `"type": "module"`.
const isEsm = (file) => {
  const { dirname, extname, join } = require('path');
  const ext = extname(file);
  if (ext === '.mjs') return true;
  if (ext === '.cjs') return false;
  for (let dir = dirname(file); ; dir = dirname(dir)) {
    try {
      const pkg = JSON.parse(
        require('fs').readFileSync(join(dir, 'package.json'), 'utf8'),
      );
      return pkg.type === 'module';
    } catch (err) {
      if (dirname(dir) === dir) return false;
    }
  }
};

// The ESM entry of the package containing `file` (its `exports` `import`
// condition, or `module`), or null.
const esmEntry = (file) => {
  const { dirname, join } = require('path');
  for (let dir = dirname(file); dirname(dir) !== dir; dir = dirname(dir)) {
    let pkg;
    try {
      pkg = JSON.parse(
        require('fs').readFileSync(join(dir, 'package.json'), 'utf8'),
      );
    } catch (err) {
      continue;
    }
    if (!pkg.name) continue;
    const root = pkg.exports?.['.'] ?? pkg.exports;
    let target = root?.import ?? pkg.module;
    if (target && typeof target === 'object') target = target.default;
    return typeof target === 'string' ? join(dir, target) : null;
  }
  return null;
};

// Load a theme module, CommonJS or ESM. ESM themes are imported rather than
// required: require() of ESM resolves the theme's own dependencies with the
// `require` condition, which breaks import-only packages. Likewise, a theme
// whose CommonJS build can't load (e.g. it requires an import-only
// dependency, as jsonresume-theme-even >= 0.2x does) falls back to its ESM
// entry. Themes may export `render` by name or on their default export.
export const loadTheme = async (themePath) => {
  const resolved = resolveThemePath(themePath);
  let mod;
  if (isEsm(resolved)) {
    mod = await importModule(pathToFileURL(resolved).href);
  } else {
    try {
      mod = require(resolved);
    } catch (err) {
      const esm =
        ['ERR_REQUIRE_ESM', 'ERR_PACKAGE_PATH_NOT_EXPORTED'].includes(
          err.code,
        ) && esmEntry(resolved);
      if (!esm) throw err;
      mod = await importModule(pathToFileURL(esm).href);
    }
  }
  return typeof mod?.render === 'function' ? mod : mod?.default ?? mod;
};

// Entry locations may be structured objects (#323); themes written for
// strings would print "[object Object]". Same rule as @jsonresume/utils'
// withStringLocations (kept inline: that package is ESM-only).
const LOCATED_SECTIONS = ['work', 'volunteer', 'education'];
export const withStringLocations = (resume) => {
  if (!resume || typeof resume !== 'object') return resume;
  const out = { ...resume };
  for (const section of LOCATED_SECTIONS) {
    if (!Array.isArray(resume[section])) continue;
    out[section] = resume[section].map((entry) => {
      const location = entry && entry.location;
      if (!location || typeof location !== 'object') return entry;
      const text = [location.city, location.region, location.countryCode]
        .filter(Boolean)
        .join(', ');
      return { ...entry, location: text };
    });
  }
  return out;
};

export default async ({ resume, themePath }) => {
  const theme = await loadTheme(themePath);
  if (typeof theme?.render !== 'function') {
    throw new Error('theme.render is not a function');
  }

  return theme.render(withStringLocations(resume));
};
