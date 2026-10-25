// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import { ExplorePage, type ExploreLinks } from './ExplorePage';

afterEach(cleanup);

const links: ExploreLinks = {
  person: (u) => `/@${u}`,
  search: (q, page) =>
    `/explore?q=${encodeURIComponent(q)}${page ? `&page=${page}` : ''}`,
  settings: '/dashboard/settings',
};

const ada = {
  username: 'ada',
  name: 'Ada Lovelace',
  label: 'Analyst',
  location: 'London, GB',
  image: null,
  skills: ['Maths', 'Engines'],
  updatedAt: '2026-10-01T00:00:00.000Z',
};

describe('ExplorePage', () => {
  it('lists people, links skills and pages, and passes axe', async () => {
    const { container } = render(
      <ExplorePage
        links={links}
        results={{
          query: 'maths',
          page: 1,
          pageCount: 3,
          total: 60,
          people: [ada],
          popularSkills: ['Maths', 'React'],
        }}
      />
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Find people by their resumes'
    );
    expect(screen.getByRole('searchbox')).toHaveValue('maths');
    expect(screen.getByText('60 people match “maths”')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ada Lovelace/ })).toHaveAttribute(
      'href',
      '/@ada'
    );
    expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute(
      'href',
      '/explore?q=React'
    );
    expect(screen.getByText('Updated Oct 2026')).toBeInTheDocument();
    expect(
      (
        await axe.run(container, {
          rules: { 'color-contrast': { enabled: false } },
        })
      ).violations.map((v) => v.id)
    ).toEqual([]);
  });

  it('says when nobody matches', () => {
    render(
      <ExplorePage
        links={links}
        results={{
          query: 'cobol mars',
          page: 1,
          pageCount: 1,
          total: 0,
          people: [],
          popularSkills: [],
        }}
      />
    );
    expect(screen.getByText('Nobody matches “cobol mars”')).toBeInTheDocument();
  });
});
