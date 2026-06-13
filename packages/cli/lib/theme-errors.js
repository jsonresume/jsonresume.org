const chalk = require('chalk');

// Strip the `jsonresume-theme-` prefix (and any relative-path noise) so the
// message we show the user matches what they would type with `--theme`.
const shortThemeName = (theme) => {
  if (!theme) {
    return theme;
  }
  const base = theme.replace(/^.*jsonresume-theme-/, '');
  return base.replace(/[/\\].*$/, '');
};

// Error raised when a `--theme` cannot be resolved. Carries the requested
// theme name so the CLI can render an actionable, stack-trace-free message.
class ThemeNotFoundError extends Error {
  constructor(theme) {
    super(`Theme not found: ${theme}`);
    this.name = 'ThemeNotFoundError';
    this.theme = theme;
  }
}

// Build the user-facing, actionable message for a missing theme.
const formatThemeNotFound = (theme) => {
  const short = shortThemeName(theme);
  const pkg = short.startsWith('jsonresume-theme-')
    ? short
    : `jsonresume-theme-${short}`;
  return [
    chalk.red(`Theme '${short}' not found.`),
    `Install it:  ${chalk.cyan(`npm install ${pkg}`)}`,
    `Browse themes:  ${chalk.cyan('https://jsonresume.org/themes/')}`,
  ].join('\n');
};

module.exports = {
  ThemeNotFoundError,
  formatThemeNotFound,
  shortThemeName,
};
