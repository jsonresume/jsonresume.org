// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { reloadOnStaleBuild } from './staleBuild';

const stale = () => {
  const event = new Event('vite:preloadError', { cancelable: true });
  window.dispatchEvent(event);
  return event;
};

describe('reloadOnStaleBuild', () => {
  afterEach(() => {
    vi.useRealTimers();
    window.sessionStorage.clear();
  });

  it('reloads once when a chunk of an old build is gone, not again at once', () => {
    vi.useFakeTimers();
    const reload = vi.fn();
    const target = {
      addEventListener: window.addEventListener.bind(window),
      sessionStorage: window.sessionStorage,
      location: { reload },
    } as unknown as Window;
    reloadOnStaleBuild(target);
    expect(stale().defaultPrevented).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    // A build that fails again straight away is broken: no loop.
    expect(stale().defaultPrevented).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(61_000);
    stale();
    expect(reload).toHaveBeenCalledTimes(2);
  });
});
