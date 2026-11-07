import { describe, expect, it } from 'vitest';
import { runThemeRenderQa } from '@jsonresume/theme-kit';
import { render } from '../dist/index.js';

describe('french-professionnel', () => {
  it('renders every JSON Resume section through its published entry', async () => {
    const coverage = await runThemeRenderQa({
      render,
      name: 'french-professionnel',
      expect,
    });
    expect(Object.values(coverage).every(Boolean)).toBe(true);
  });
  it('ships a complete styled document for sparse content', () => {
    const html = render({ basics: { name: 'Ada Lovelace' } });
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('data-theme="french-professionnel"');
    expect(html).toContain('<style>');
    expect(html).not.toContain('__JSONRESUME_INLINE_CSS__');
    expect(html).not.toMatch(/<script|<link[^>]+\.css["']/);
  });
});
