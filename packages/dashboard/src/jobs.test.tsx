import { RegistryProvider } from '@effect/atom-react';
import type {
  DecidedJob,
  JobDecision,
  JobDecisions,
  JobMark,
  JobPreferences,
} from '@repo/api';
import { act, fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { Decided } from './jobs/Decided';
import { wantText } from './jobs/Wants';

const none: JobPreferences = {
  workplaces: [],
  payFloor: null,
  payTarget: null,
  employment: [],
  levels: [],
  avoidSectors: [],
  likeSectors: [],
  stages: [],
  wantSkills: [],
  avoidSkills: [],
  direction: '',
  priorities: [],
  needsVisa: false,
  weeklyEmail: false,
  dismissed: [],
};

const decision = (over: Partial<JobDecision>): JobDecision => ({
  verdict: 'apply',
  chance: 80,
  appeal: 70,
  value: 63,
  reasons: [
    { factor: 'skills', tone: 'good', text: 'You show all 4 required skills' },
  ],
  shown: ['React'],
  missing: [],
  sectors: [],
  stage: 'unspecified',
  ...over,
});

const job = (
  id: number,
  title: string,
  over: Partial<JobDecision> = {},
  mark: JobMark | null = null
): DecidedJob => ({
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
  postedAt: '2026-11-01T15:00:00Z',
  months: 1,
  score: 82,
  mark,
  role: id === 1 ? 'Design Engineer' : null,
  why: 'you: built this kind of thing',
  decision: decision(over),
});

const decided = (over: Partial<JobDecisions> = {}): JobDecisions => ({
  jobs: [
    job(1, 'Frontend Engineer'),
    job(2, 'Platform Engineer', {
      verdict: 'stretch',
      chance: 45,
      missing: ['Kubernetes'],
    }),
    job(3, 'Casino Engineer', {
      verdict: 'ruled_out',
      reasons: [{ factor: 'sector', tone: 'bad', text: 'Gambling' }],
    }),
    job(4, 'Old Saved Job', {}, 'interested'),
  ],
  counts: { apply: 1, stretch: 1, skip: 0, ruled_out: 1 },
  preferences: none,
  stated: false,
  waitingFor: [],
  suggestions: [],
  ...over,
});

const show = (result: JobDecisions) =>
  render(
    <RegistryProvider>
      <Decided result={result} />
    </RegistryProvider>
  );

const titles = () =>
  screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);

describe('the decided jobs page', () => {
  it('shows each verdict with its count, apply first, and why', async () => {
    const { container } = show(decided());
    expect(titles()).toEqual(['Frontend Engineer']);
    expect(screen.getByRole('button', { name: /Apply\s*1/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(
      screen.getByText('You show all 4 required skills')
    ).toBeInTheDocument();
    expect(screen.getByText('Your role here: Design Engineer')).toBeVisible();
    expect(screen.getByText('Built this kind of thing')).toBeInTheDocument();
    expect(screen.getByRole('meter', { name: 'Chance' })).toHaveAttribute(
      'aria-valuenow',
      '80'
    );

    fireEvent.click(screen.getByRole('button', { name: /Ruled out\s*1/ }));
    expect(titles()).toEqual(['Casino Engineer']);
    expect(screen.getByText('Gambling')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Saved\s*1$/ }));
    expect(titles()).toEqual(['Old Saved Job']);
    const result = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(result.violations.map((v) => v.id)).toEqual([]);
  });

  it('asks why on pass, and moves the job to Passed at once', async () => {
    show(decided());
    fireEvent.click(screen.getByRole('button', { name: 'Pass' }));
    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: 'Pay' }));
    });
    expect(
      screen.queryByRole('heading', { name: 'Frontend Engineer' })
    ).toBeNull();
    expect(
      screen.getByRole('button', { name: /^Passed\s*1$/ })
    ).toBeInTheDocument();
  });

  it('invites them to say what they want, then sums it up', () => {
    const { unmount } = show(decided());
    expect(screen.getByText('Tell us what you want')).toBeInTheDocument();
    unmount();
    const preferences = {
      ...none,
      workplaces: ['remote_global' as const],
      payFloor: 150000,
      avoidSectors: ['gambling' as const],
    };
    show(decided({ stated: true, preferences }));
    expect(wantText(preferences)).toEqual([
      'Remote, anywhere',
      '$150k+',
      'No gambling',
    ]);
    expect(screen.getByText('No gambling')).toBeInTheDocument();
  });

  it('has the weekly email, off until turned on', () => {
    show(decided());
    fireEvent.click(screen.getByRole('button', { name: 'Set what you want' }));
    const weekly = screen.getByRole('switch', {
      name: 'Email me new jobs that fit',
    });
    expect(weekly.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(weekly);
    expect(weekly.getAttribute('aria-checked')).toBe('true');
  });

  it('offers the weekly email when there are jobs for it, until put off', () => {
    window.localStorage.clear();
    const { unmount } = show(
      decided({ preferences: { ...none, weeklyEmail: true } })
    );
    expect(screen.queryByText('New jobs, by email')).toBeNull();
    unmount();
    const nothing = show(
      decided({ counts: { apply: 0, stretch: 0, skip: 0, ruled_out: 1 } })
    );
    expect(screen.queryByText('New jobs, by email')).toBeNull();
    nothing.unmount();
    const offered = show(decided());
    expect(screen.getByText('New jobs, by email')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    expect(screen.queryByText('New jobs, by email')).toBeNull();
    offered.unmount();
    show(decided());
    expect(screen.queryByText('New jobs, by email')).toBeNull();
  });

  it('offers suggestions from marks, and drops one once answered', () => {
    show(
      decided({
        suggestions: [
          {
            id: 'avoid:gambling',
            text: 'You passed on 3 gambling jobs. Leave gambling out?',
            preferences: none,
          },
        ],
      })
    );
    expect(screen.getByText(/Leave gambling out/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'No thanks' }));
    expect(screen.queryByText(/Leave gambling out/)).toBeNull();
  });

  it('says when the AI is still deciding', () => {
    show(decided({ waitingFor: ['jobs'] }));
    expect(screen.getByText('Still deciding')).toBeInTheDocument();
  });
});
