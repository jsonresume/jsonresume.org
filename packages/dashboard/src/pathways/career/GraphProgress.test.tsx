import type { CareerGraph } from '@repo/api';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GraphLoading, GraphProgress } from './GraphProgress';

const graph = (waitingFor?: CareerGraph['waitingFor']): CareerGraph => ({
  nodes: [],
  edges: [],
  strengths: [],
  pending: true,
  snapshots: [],
  bands: { meaning: [], distance: [], seniority: [], time: [] },
  planId: null,
  ...(waitingFor && { waitingFor }),
});

const steps = () =>
  [...screen.getByRole('list', { name: 'What’s left' }).children].map(
    (li) => li.textContent ?? ''
  );

it('says which model step is done and which is still under way', () => {
  render(<GraphProgress graph={graph(['jobs'])} />);
  const [resume, jobs] = steps();
  expect(resume).toContain('Done: Reading your resume');
  expect(jobs).toContain('Under way: Judging today’s jobs');
  expect(jobs).toContain('Usually under 30 seconds');
});

it('takes a pending graph without waitingFor as the resume still being read', () => {
  render(<GraphProgress graph={graph()} />);
  const [resume, jobs] = steps();
  expect(resume).toContain('Under way: Reading your resume');
  expect(jobs).toContain('Done: Judging');
});

it('holds the tree’s shape before the first answer', () => {
  render(<GraphLoading />);
  expect(
    screen
      .getByRole('group', { name: 'Your career graph' })
      .getAttribute('aria-busy')
  ).toBe('true');
  expect(screen.getByRole('status').textContent).toContain(
    'Gathering your resume and today’s jobs'
  );
});
