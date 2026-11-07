import { describe, expect, it } from 'vitest';
import { runThemeRenderQa } from '@jsonresume/theme-kit';
import { render } from '../dist/index.js';

describe('release-notes-cv', () => {
  it('renders every JSON Resume section through its published entry', async () => {
    const coverage = await runThemeRenderQa({
      render,
      name: 'release-notes-cv',
      expect,
    });
    expect(Object.values(coverage).every(Boolean)).toBe(true);
  });
  it('ships a complete styled document for sparse content', () => {
    const html = render({ basics: { name: 'Ada Lovelace' } });
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('data-theme="release-notes-cv"');
    expect(html).toContain('<style>');
    expect(html).not.toContain('__JSONRESUME_INLINE_CSS__');
    expect(html).not.toMatch(/<script|<link[^>]+\.css["']/);
  });
});
