import { RegistryProvider } from '@effect/atom-react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ThemeSummary } from '@repo/domain';
import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { filterThemes, findTheme, tagCounts, themes } from './catalog';
import { ThemeGallery } from './ThemeGallery';

const links = {
  image: (t: { slug: string }) => `/img/${t.slug}.webp`,
  href: (t: { slug: string }) => `/preview/${t.slug}`,
};

describe('catalog', () => {
  it('decodes every theme, A to Z', () => {
    // Decode explicitly: the module skips decoding outside SSR (jsdom here).
    expect(() =>
      Schema.decodeUnknownSync(Schema.Array(ThemeSummary))(themes)
    ).not.toThrow();
    expect(themes.length).toBeGreaterThan(50);
    const names = themes.map((t) => t.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(findTheme('kendall')?.name).toBe('Kendall');
  });

  it('matches every word of the query, and the tag', () => {
    const tag = tagCounts(themes)[0].tag;
    const tagged = filterThemes(themes, { query: '', tag });
    expect(tagged.length).toBe(tagCounts(themes)[0].count);
    expect(tagged.every((t) => t.tags.includes(tag))).toBe(true);
    expect(
      filterThemes(themes, { query: 'desert southwest', tag: null }).map(
        (t) => t.slug
      )
    ).toContain('desert-modern');
    expect(
      filterThemes(themes, { query: 'zzzz-no-such-theme', tag: null })
    ).toEqual([]);
  });
});

describe('ThemeGallery', () => {
  it('shows every theme, then narrows as you search', async () => {
    window.history.replaceState(null, '', '/themes');
    render(
      <RegistryProvider>
        <ThemeGallery {...links} />
      </RegistryProvider>
    );
    const list = screen.getByRole('list', { name: 'Themes' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(themes.length);
    await act(async () => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'desert' },
      });
    });
    const items = within(
      screen.getByRole('list', { name: 'Themes' })
    ).getAllByRole('listitem');
    expect(items.length).toBeLessThan(themes.length);
    expect(screen.getByRole('link', { name: /Desert Modern/ })).toHaveAttribute(
      'href',
      '/preview/desert-modern'
    );
    expect(window.location.search).toBe('?q=desert');
  });

  it('reads a shared filter from the URL after the first render', async () => {
    window.history.replaceState(null, '', '/themes?q=kendall');
    await act(async () => {
      render(
        <RegistryProvider>
          <ThemeGallery {...links} />
        </RegistryProvider>
      );
    });
    expect(
      within(screen.getByRole('list', { name: 'Themes' })).getAllByRole(
        'listitem'
      )
    ).toHaveLength(
      filterThemes(themes, { query: 'kendall', tag: null }).length
    );
  });
});
