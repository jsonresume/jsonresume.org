import { THEMES } from './themeConfig';
import logger from '../../logger';

// Successful loads are cached so each theme module is evaluated at most once
// per process. Failures are NOT cached: a broken theme errors per-request
// (logged below) without poisoning the cache for a later fixed deploy.
const loaded = new Map();

/**
 * dynamic import() interop: ESM themes expose render() on the namespace,
 * CJS themes (elegant, even, ...) expose it on default (module.exports).
 */
const resolveRenderable = (mod) => {
  if (mod && typeof mod.render === 'function') {
    return mod;
  }
  if (mod?.default && typeof mod.default.render === 'function') {
    return mod.default;
  }
  return mod?.default ?? mod;
};

/**
 * Lazily load a theme module by slug (#476).
 *
 * - unknown slug -> null (format.js maps this to "theme-missing")
 * - module throws at import time -> throws "theme-load-failed: <slug>", which
 *   formatResume.js catches and turns into a per-theme error response, so one
 *   broken theme can no longer take down every theme's rendering.
 */
export const getTheme = async (theme) => {
  const load = THEMES[theme];
  if (typeof load !== 'function') {
    return null;
  }
  if (loaded.has(theme)) {
    return loaded.get(theme);
  }

  try {
    const themeModule = resolveRenderable(await load());
    loaded.set(theme, themeModule);
    return themeModule;
  } catch (e) {
    logger.error(
      { theme, error: e.message, stack: e.stack },
      'Theme module failed to load'
    );
    throw new Error(`theme-load-failed: ${theme}: ${e.message}`, { cause: e });
  }
};
