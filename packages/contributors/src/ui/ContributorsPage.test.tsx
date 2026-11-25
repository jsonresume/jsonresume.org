// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import type { Contributors } from '../model';
import { ContributorsPage } from './ContributorsPage';

afterEach(cleanup);

const data: Contributors = {
  collected: '2026-11-25',
  repositories: 31,
  people: [
    {
      name: 'Ada Lovelace',
      github: 'ada',
      id: 1,
      credits: [
        { kind: 'team', where: 'Core team', count: 1 },
        { kind: 'code', where: 'resume-cli', count: 312 },
        ...Array.from({ length: 7 }, (_, i) => ({
          kind: 'comments' as const,
          where: `repo-${i}`,
          count: 2,
        })),
      ],
    },
    {
      name: 'lin',
      npm: 'lin',
      credits: [{ kind: 'themes', where: 'jsonresume-theme-lin', count: 1 }],
    },
    {
      name: 'Old Committer',
      credits: [
        {
          kind: 'code',
          where: 'resume-website',
          count: 4,
          href: 'https://github.com/jsonresume/resume-website/commit/abc',
        },
      ],
    },
  ],
};

describe('ContributorsPage', () => {
  it('credits everyone, links them and their work, and passes axe', async () => {
    const { container } = render(<ContributorsPage data={data} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Everyone who has built JSON Resume'
    );
    expect(
      screen.getByText('All 3 contributors, most involved first')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ada Lovelace' })).toHaveAttribute(
      'href',
      'https://github.com/ada'
    );
    expect(
      screen.getByRole('link', { name: '312 commits to resume-cli' })
    ).toHaveAttribute(
      'href',
      'https://github.com/jsonresume/resume-cli/commits?author=ada'
    );
    expect(screen.getByRole('link', { name: 'Core team' })).toHaveAttribute(
      'href',
      '/team'
    );
    expect(screen.getByRole('link', { name: 'lin' })).toHaveAttribute(
      'href',
      'https://www.npmjs.com/~lin'
    );
    expect(screen.getByRole('link', { name: 'Old Committer' })).toHaveAttribute(
      'href',
      'https://github.com/jsonresume/resume-website/commit/abc'
    );
    // Every credit is on the page; the long tail folds away.
    expect(screen.getByText('and 3 more')).toBeInTheDocument();
    expect(container.querySelectorAll('a[href*="repo-"]')).toHaveLength(7);
    expect(container.textContent?.replace(/\s+/g, ' ')).toContain(
      'Collected 25 November 2026 from the 31 public repositories'
    );
    expect(
      (
        await axe.run(container, {
          rules: { 'color-contrast': { enabled: false } },
        })
      ).violations.map((v) => v.id)
    ).toEqual([]);
  });

  it('searches and filters', () => {
    render(<ContributorsPage data={data} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'theme-lin' },
    });
    expect(screen.getByText('1 of 3 contributors')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Code' }));
    const list = screen.getByRole('list', { name: /contributors/ });
    expect(within(list).getByText('Ada Lovelace')).toBeInTheDocument();
    expect(within(list).queryByText('lin')).not.toBeInTheDocument();
  });
});
