import { RegistryProvider } from '@effect/atom-react';
import type { JobMatch } from '@repo/api';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Matches } from './JobsPage';

const match = (
  id: number,
  title: string,
  mark: JobMatch['mark']
): JobMatch => ({
  id,
  title,
  company: 'Acme',
  location: null,
  remote: 'remote_global',
  remoteRegions: [],
  seniority: 'senior',
  employmentType: 'full_time',
  salary: null,
  salaryMin: null,
  salaryMax: null,
  skills: ['React'],
  postedAt: '2026-10-01T15:00:00Z',
  months: 1,
  score: 82,
  mark,
});

it('shows jobs to review, and those marked under their own chip', async () => {
  render(
    <RegistryProvider>
      <Matches
        jobs={[
          match(1, 'Frontend Engineer', null),
          match(2, 'Sales Engineer', 'not_interested'),
        ]}
      />
    </RegistryProvider>
  );
  const titles = () =>
    screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
  expect(titles()).toEqual(['Frontend Engineer']);
  expect(screen.getByText('82% fit')).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /^Not for me\s*1$/ }));
  });
  expect(titles()).toEqual(['Sales Engineer']);
});
