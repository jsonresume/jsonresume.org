import { RegistryProvider } from '@effect/atom-react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { projects } from '@repo/content/data';
import { describe, expect, it } from 'vitest';
import { filterProjects, ProjectDirectory } from './index';

describe('filterProjects', () => {
  it('matches words across name, description and language, within a category', () => {
    expect(
      filterProjects(projects, { query: '', category: 'cli' }).every(
        (p) => p.category === 'cli'
      )
    ).toBe(true);
    expect(
      filterProjects(projects, { query: 'resumed', category: null }).map(
        (p) => p.name
      )
    ).toContain('resumed');
    expect(
      filterProjects(projects, { query: 'zzz-nothing', category: null })
    ).toEqual([]);
  });
});

describe('ProjectDirectory', () => {
  it('lists every project, then filters by category and search, keeping it in the URL', async () => {
    window.history.replaceState(null, '', '/projects');
    await act(async () => {
      render(
        <RegistryProvider>
          <ProjectDirectory />
        </RegistryProvider>
      );
    });
    const cards = () =>
      screen
        .getAllByRole('link')
        .filter((a) => projects.some((p) => p.link === a.getAttribute('href')));
    expect(cards()).toHaveLength(projects.length);
    await act(async () =>
      fireEvent.click(
        screen.getByRole('button', { name: /^Command-line tools/ })
      )
    );
    expect(cards()).toHaveLength(
      filterProjects(projects, { query: '', category: 'cli' }).length
    );
    expect(window.location.search).toBe('?category=cli');
  });
});
