import { describe, it, expect, vi } from 'vitest';
import { getTheme } from './getTheme';

vi.mock('./themeConfig', () => ({
  THEMES: {
    default: { name: 'default', template: 'default-template' },
    elegant: { name: 'elegant', template: 'elegant-template' },
    professional: { name: 'professional', template: 'pro-template' },
  },
}));

describe('getTheme', () => {
  it('returns theme when it exists', () => {
    const theme = getTheme('default');

    expect(theme).toBeDefined();
    expect(theme.name).toBe('default');
  });

  it('returns correct theme configuration', () => {
    const theme = getTheme('elegant');

    expect(theme.name).toBe('elegant');
    expect(theme.template).toBe('elegant-template');
  });

  it('returns undefined for non-existent theme', () => {
    const theme = getTheme('nonexistent');

    expect(theme).toBeUndefined();
  });

  it('handles null theme name', () => {
    const theme = getTheme(null);

    expect(theme).toBeUndefined();
  });

  it('handles undefined theme name', () => {
    const theme = getTheme(undefined);

    expect(theme).toBeUndefined();
  });

  it('returns professional theme', () => {
    const theme = getTheme('professional');

    expect(theme.name).toBe('professional');
    expect(theme.template).toBe('pro-template');
  });

  it('is case sensitive', () => {
    const theme = getTheme('DEFAULT');

    expect(theme).toBeUndefined();
  });

  it('handles empty string', () => {
    const theme = getTheme('');

    expect(theme).toBeUndefined();
  });

  it('retrieves themes from THEMES config', () => {
    const defaultTheme = getTheme('default');
    const elegantTheme = getTheme('elegant');

    expect(defaultTheme).not.toBe(elegantTheme);
    expect(defaultTheme.name).toBe('default');
    expect(elegantTheme.name).toBe('elegant');
  });
});
