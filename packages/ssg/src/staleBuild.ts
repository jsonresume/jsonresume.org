const KEY = 'ssg:reloaded-for-stale-build';
/** Long enough to tell a deploy from a broken build that fails every load. */
const AGAIN_AFTER_MS = 60_000;

/**
 * After a deploy, a page opened before it still names the old build's
 * chunks, which are gone (404): the next lazy route fails with "Failed to
 * fetch dynamically imported module". Vite reports that as
 * `vite:preloadError`; reloading loads the new build. At most once a
 * minute, so a build that really is broken doesn't reload forever.
 */
export const reloadOnStaleBuild = (target: Window = window) => {
  target.addEventListener('vite:preloadError', (event) => {
    const now = Date.now();
    let last = 0;
    try {
      last = Number(target.sessionStorage.getItem(KEY) ?? 0);
      target.sessionStorage.setItem(KEY, String(now));
    } catch {
      // Storage blocked: reload anyway, the guard is only a nicety.
    }
    if (now - last < AGAIN_AFTER_MS) return;
    event.preventDefault();
    target.location.reload();
  });
};
