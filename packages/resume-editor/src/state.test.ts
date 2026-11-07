import {
  RECOMMENDED_THEMES,
  THEME_METADATA,
  THEME_NAMES,
} from '@jsonresume/theme-metadata';
import { describe, expect, it } from 'vitest';
import { themeOptions } from './state';

describe('themeOptions', () => {
  it('offers the recommended themes first, then every other theme by name', () => {
    const [recommended, rest] = themeOptions;
    expect(recommended?.label).toBe('Recommended');
    expect(recommended?.options.map((o) => o.value)).toEqual([
      ...RECOMMENDED_THEMES,
    ]);
    expect(recommended?.options[0]?.label).toBe(
      THEME_METADATA[RECOMMENDED_THEMES[0] ?? '']?.name
    );
    const others = rest?.options.map((o) => o.label) ?? [];
    expect(others).toEqual([...others].sort((a, b) => a.localeCompare(b)));
    const all = themeOptions.flatMap((g) => g.options.map((o) => o.value));
    expect(all.sort()).toEqual([...THEME_NAMES].sort());
  });
});
