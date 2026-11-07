import { RegistryProvider } from '@effect/atom-react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ThemeSummary } from '@repo/domain';
import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import {
  facetCounts,
  filterThemes,
  findTheme,
  sortThemes,
  tagCounts,
  themes,
} from './catalog';
import {
  THEME_STYLES,
  THEME_LAYOUTS,
  THEME_COLORS,
} from '@jsonresume/theme-metadata';
import { ThemeGallery } from './ThemeGallery';

const links = {
  image: (t: { slug: string }) => `/img/${t.slug}.webp`,
  href: (t: { slug: string }) => `/preview/${t.slug}`,
};

describe('catalog', () => {
  it('decodes every theme and ranks by public-resume usage', () => {
    // Decode explicitly: the module skips decoding outside SSR (jsdom here).
    expect(() =>
      Schema.decodeUnknownSync(Schema.Array(ThemeSummary))(themes)
    ).not.toThrow();
    expect(themes.length).toBeGreaterThan(50);
    expect(themes[0].slug).toBe('elegant');
    expect(themes[0].usage.inherited).toBeGreaterThan(0);
    expect(themes.map((t) => t.usage.resumes)).toEqual(
      themes.map((t) => t.usage.resumes).sort((a, b) => b - a)
    );
    expect(findTheme('kendall')?.name).toBe('Kendall');
  });

  it('gives every theme independent, valid discovery facets', () => {
    for (const theme of themes) {
      expect(Object.hasOwn(THEME_STYLES, theme.style)).toBe(true);
      expect(Object.hasOwn(THEME_LAYOUTS, theme.layout)).toBe(true);
      expect(Object.hasOwn(THEME_COLORS, theme.color)).toBe(true);
      expect(theme.tags).not.toContain('research-informed');
      expect(theme.usage.chosen + theme.usage.inherited).toBe(
        theme.usage.resumes
      );
    }
    expect(
      facetCounts(themes, 'style').reduce((n, row) => n + row.count, 0)
    ).toBe(themes.length);
  });

  it('combines facets and changes sort without mutating the catalogue', () => {
    const selected = filterThemes(themes, {
      query: '',
      tag: null,
      style: 'modern',
      layout: 'left',
      color: 'green',
    });
    expect(selected.map((t) => t.slug)).toContain('macchiato');
    expect(
      selected.every(
        (t) =>
          t.style === 'modern' && t.layout === 'left' && t.color === 'green'
      )
    ).toBe(true);
    const alphabetical = sortThemes(themes, 'name').map((t) => t.name);
    expect(alphabetical).toEqual(
      [...alphabetical].sort((a, b) => a.localeCompare(b))
    );
    expect(themes[0].slug).toBe('elegant');
    expect(
      filterThemes(themes, { query: '', tag: null, style: 'research-informed' })
    ).toHaveLength(themes.length);
  });

  it('matches the visible colour and layout labels in free-text search', () => {
    expect(
      filterThemes(themes, { query: 'black and white', tag: null }).map(
        (t) => t.slug
      )
    ).toContain('harvard-classic');
    expect(
      filterThemes(themes, { query: 'orange', tag: null }).map((t) => t.slug)
    ).toContain('flat');
    expect(
      filterThemes(themes, { query: 'left sidebar', tag: null }).map(
        (t) => t.slug
      )
    ).toContain('executive-slate');
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
    const style = { tag: 'modern' };
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Modern/ }));
    });
    expect(window.location.search).toBe(`?q=desert&style=${style.tag}`);
  });

  it('offers separate layouts and colours and preserves sort in the URL', async () => {
    window.history.replaceState(null, '', '/themes');
    await act(async () => {
      render(
        <RegistryProvider>
          <ThemeGallery {...links} />
        </RegistryProvider>
      );
    });
    expect(
      screen.queryByRole('button', { name: /research-informed/ })
    ).toBeNull();
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Layout'), {
        target: { value: 'left' },
      });
      fireEvent.change(screen.getByLabelText('Colour'), {
        target: { value: 'green' },
      });
      fireEvent.change(screen.getByLabelText('Sort by'), {
        target: { value: 'name' },
      });
    });
    expect(window.location.search).toContain('layout=left');
    expect(window.location.search).toContain('color=green');
    expect(window.location.search).toContain('sort=name');
    expect(screen.getByRole('link', { name: /Macchiato/ })).toBeInTheDocument();
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
