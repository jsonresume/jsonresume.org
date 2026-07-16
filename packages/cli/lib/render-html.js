import { ThemeNotFoundError } from './theme-errors';

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
  let path;
  if (themePath[0] === '.') {
    path = tryResolve(require('path').join(cwd, themePath), { paths: [cwd] });
    if (!path) {
      throw new ThemeNotFoundError(themePath);
    }
  }
  if (!path) {
    path = tryResolve(themePath, { paths: [cwd] });
  }
  // Only fall back to the `jsonresume-theme-` prefix for bare short names;
  // scoped or otherwise non-alphanumeric-leading specifiers are used as-is.
  if (!path && /^[a-z0-9]/i.test(themePath)) {
    path = tryResolve(`jsonresume-theme-${themePath}`, { paths: [cwd] });
  }
  if (!path) {
    throw new ThemeNotFoundError(themePath);
  }
  return path;
};

export default async ({ resume, themePath }) => {
  const theme = require(resolveThemePath(themePath));
  if (typeof theme?.render !== 'function') {
    throw new Error('theme.render is not a function');
  }

  return theme.render(resume);
};
