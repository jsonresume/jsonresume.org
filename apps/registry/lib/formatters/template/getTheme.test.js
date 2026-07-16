import { describe, it, expect, vi } from 'vitest';
import { getTheme } from './getTheme';
import { format } from './format';
import { THEMES } from './themeConfig';

// THEMES values are lazy loader thunks (see themeConfig.js / #476).
vi.mock('./themeConfig', () => ({
  THEMES: {
    // ESM-shaped module: render on the namespace.
    elegant: vi.fn(async () => ({
      render: (resume) => `<html>elegant:${resume?.basics?.name}</html>`,
    })),
    // CJS-shaped module: render on default (module.exports).
    kendall: vi.fn(async () => ({
      default: { render: () => '<html>kendall</html>' },
    })),
    // Module that throws at import time (the PR #472 failure mode).
    broken: vi.fn(async () => {
      throw new Error('boom at import time');
    }),
  },
}));

vi.mock('../../logger', () => ({
  default: { error: vi.fn() },
}));

describe('getTheme (lazy loader)', () => {
  it('loads an ESM-shaped theme module', async () => {
    const theme = await getTheme('elegant');
    expect(typeof theme.render).toBe('function');
  });

  it('unwraps default export for CJS-shaped theme modules', async () => {
    const theme = await getTheme('kendall');
    expect(theme.render()).toBe('<html>kendall</html>');
  });

  it('caches loaded modules (loader invoked once)', async () => {
    await getTheme('elegant');
    await getTheme('elegant');
    expect(THEMES.elegant.mock.calls.length).toBe(1);
  });

  it('returns null for unknown themes', async () => {
    expect(await getTheme('nonexistent')).toBeNull();
    expect(await getTheme('')).toBeNull();
    expect(await getTheme(null)).toBeNull();
    expect(await getTheme(undefined)).toBeNull();
    expect(await getTheme('ELEGANT')).toBeNull(); // case sensitive
  });

  it('throws a per-theme "theme-load-failed" error when the module throws at import time', async () => {
    await expect(getTheme('broken')).rejects.toThrow(
      'theme-load-failed: broken: boom at import time'
    );
  });

  it('logs load failures via the structured logger', async () => {
    const logger = (await import('../../logger')).default;
    await expect(getTheme('broken')).rejects.toThrow('theme-load-failed');
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'broken' }),
      'Theme module failed to load'
    );
  });

  it('isolates failures: other themes keep loading after a broken one', async () => {
    await expect(getTheme('broken')).rejects.toThrow('theme-load-failed');
    const theme = await getTheme('elegant');
    expect(typeof theme.render).toBe('function');
  });
});

describe('format() with lazy theme loading (end-to-end isolation)', () => {
  const resume = { basics: { name: 'John Doe' } };

  it('renders a healthy theme through the lazy path', async () => {
    const { content } = await format(resume, { theme: 'elegant' });
    expect(content).toContain('elegant:John Doe');
  });

  it('a theme whose module throws rejects with theme-load-failed (per-theme 500)', async () => {
    // formatResume.js catches this and builds a per-theme error response.
    await expect(format(resume, { theme: 'broken' })).rejects.toThrow(
      'theme-load-failed: broken'
    );
  });

  it('other themes still render after a broken theme is requested', async () => {
    await expect(format(resume, { theme: 'broken' })).rejects.toThrow(
      'theme-load-failed'
    );
    const { content } = await format(resume, { theme: 'elegant' });
    expect(content).toContain('elegant:John Doe');
  });

  it('unknown themes still throw theme-missing', async () => {
    await expect(format(resume, { theme: 'nonexistent' })).rejects.toThrow(
      'theme-missing'
    );
  });
});
