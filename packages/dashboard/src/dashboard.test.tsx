import { Overview } from '@repo/api';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { change, country, duration } from './format';
import { Breakdowns } from './overview/Breakdowns';
import { Kpis } from './overview/Kpis';
import { RecentViews } from './overview/RecentViews';

const totals = {
  views: 120,
  visitors: 80,
  medianSeconds: 75,
  readDepth: 64,
  dataReads: 6,
};
const overview = new Overview({
  range: '7d',
  totals,
  previous: { ...totals, views: 100, visitors: 0 },
  daily: Array.from({ length: 7 }, (_, i) => ({
    date: `2026-10-${17 + i}`,
    views: i * 3,
    visitors: i * 2,
  })),
  referrers: [
    { label: 'linkedin.com', value: 50 },
    { label: 'Direct', value: 40 },
  ],
  countries: [{ label: 'AU', value: 70 }],
  devices: [{ label: 'desktop', value: 90 }],
  browsers: [{ label: 'Firefox', value: 60 }],
  themes: [{ label: 'elegant', value: 120 }],
  recent: [
    {
      viewedAt: new Date().toISOString(),
      kind: 'page',
      country: 'AU',
      device: 'mobile',
      browser: 'Safari',
      referrer: 'linkedin.com',
      seconds: 95,
    },
  ],
});

describe('formatting', () => {
  it('reads durations, changes and countries', () => {
    expect([duration(48), duration(125), duration(3780)]).toEqual([
      '48s',
      '2m 05s',
      '1h 03m',
    ]);
    expect([change(120, 100), change(5, 0)]).toEqual([0.2, undefined]);
    expect([country('AU'), country('Unknown')]).toEqual([
      'Australia',
      'Unknown',
    ]);
  });
});

describe('overview panels', () => {
  it('shows each headline number, with a change only when there was one before', () => {
    render(<Kpis overview={overview} />);
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('1m 15s')).toBeInTheDocument();
    expect(screen.getByText('64%')).toBeInTheDocument();
    expect(screen.getByText(/Plus 6 reads/)).toBeInTheDocument();
    expect(screen.getAllByText(/vs previous 7 days/)).toHaveLength(3);
  });

  it('ranks sources, linking other sites, and names countries', () => {
    render(<Breakdowns overview={overview} />);
    expect(screen.getByRole('link', { name: /linkedin.com/ })).toHaveAttribute(
      'href',
      'https://linkedin.com'
    );
    expect(screen.getByText('Australia')).toBeInTheDocument();
    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });

  it('lists recent views', () => {
    render(<RecentViews overview={overview} />);
    expect(
      screen.getByRole('heading', { name: 'Recent views' })
    ).toBeInTheDocument();
    expect(screen.getByText('Mobile · Safari')).toBeInTheDocument();
    expect(screen.getByText('1m 35s')).toBeInTheDocument();
  });
});
