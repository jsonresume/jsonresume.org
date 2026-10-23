import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  AppNav,
  AppPage,
  AppShell,
  AuthCard,
  BarList,
  Button,
  Divider,
  GithubIcon,
  StatTile,
  TimeSeriesChart,
  compactNumber,
  formatDay,
} from '../index';
import { axeViolations } from '../test/axe';
import { niceTicks } from './viz/scale';

const days = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'].map(
  (date, i) => ({
    date,
    values: { views: [3, 8, 5, 12][i] ?? 0, visitors: [2, 6, 4, 9][i] ?? 0 },
  })
);

describe('TimeSeriesChart', () => {
  const chart = (
    <TimeSeriesChart
      title="Views"
      summary="Views per day rose from 3 to 12."
      data={days}
      series={[
        { key: 'views', label: 'Views' },
        { key: 'visitors', label: 'Visitors' },
      ]}
    />
  );

  it('is a named, focusable chart with a legend and a data table', async () => {
    const { container } = render(chart);
    expect(screen.getByRole('figure', { name: 'Views' })).toBeInTheDocument();
    const plot = screen.getByRole('group', { name: /Views per day rose/ });
    expect(plot).toHaveAttribute('tabindex', '0');
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(
      ['Views', 'Visitors']
    );
    expect(screen.getByRole('table')).toHaveTextContent('4 Oct129');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('reads each day with the arrow keys, every series at once', () => {
    render(chart);
    const plot = screen.getByRole('group', { name: /Views per day rose/ });
    fireEvent.keyDown(plot, { key: 'End' });
    fireEvent.keyDown(plot, { key: 'ArrowLeft' });
    expect(plot).toHaveTextContent('3 Oct: Views 5, Visitors 4');
  });

  it('has no legend for one series, and says when there is no data', () => {
    render(
      <TimeSeriesChart
        title="Views"
        summary="No views yet."
        data={days.map((d) => ({ ...d, values: { views: 0 } }))}
        series={[{ key: 'views', label: 'Views' }]}
      />
    );
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByText('No data in this period')).toBeInTheDocument();
  });
});

describe('chart helpers', () => {
  it('rounds ticks to clean steps and formats compactly', () => {
    expect(niceTicks(12)).toEqual([0, 5, 10, 15]);
    expect(niceTicks(3)).toEqual([0, 1, 2, 3]);
    expect(compactNumber(1284)).toBe('1.3K');
    expect(formatDay('2026-10-12')).toBe('12 Oct');
  });
});

describe('BarList', () => {
  it('ranks items, folds the tail into Other, and reads each share', async () => {
    const { container } = render(
      <BarList
        title="Top sources"
        valueLabel="Views"
        limit={2}
        items={[
          { label: 'linkedin.com', value: 10, href: 'https://linkedin.com' },
          { label: 'Direct', value: 30 },
          { label: 'github.com', value: 5 },
          { label: 'news.ycombinator.com', value: 5 },
        ]}
      />
    );
    const rows = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(rows.map((r) => r.textContent?.split(' ')[0])).toEqual([
      'Direct60%30',
      'linkedin.com20%10',
      'Other20%10',
    ]);
    expect(rows[0]).toHaveTextContent('views, 60% of the total');
    expect(
      screen.getByRole('link', { name: 'linkedin.com' })
    ).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('shows the empty label without items', () => {
    render(<BarList title="Countries" items={[]} emptyLabel="No visits yet" />);
    expect(screen.getByText('No visits yet')).toBeInTheDocument();
  });
});

describe('StatTile delta and trend', () => {
  it('shows a signed change named by its period, with direction in words', async () => {
    const { container } = render(
      <StatTile
        label="Views"
        value="1,284"
        delta={{ value: 0.124, label: 'vs previous 30 days' }}
        trend={[1, 4, 2, 8]}
      />
    );
    const tile = screen.getByRole('group', { name: 'Views' });
    expect(tile).toHaveTextContent('Up +12% vs previous 30 days');
    expect(tile.querySelector('svg')).not.toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('marks a fall as good when lower is better', () => {
    render(
      <StatTile
        label="Bounce"
        value="31%"
        delta={{ value: -0.05, label: 'vs last week', positiveIsGood: false }}
      />
    );
    expect(screen.getByRole('group', { name: 'Bounce' })).toHaveTextContent(
      'Down −5% vs last week'
    );
  });
});

describe('AppShell', () => {
  const nav = (
    <AppNav
      label="Dashboard"
      items={[
        { label: 'Overview', href: '/dashboard', current: true },
        { label: 'Settings', href: '/dashboard/settings' },
      ]}
    />
  );

  it('lays out navigation, main and one page title', async () => {
    const { container } = render(
      <AppShell
        brand={<a href="/">JSON Resume</a>}
        nav={nav}
        top={<Button>Account</Button>}
      >
        <AppPage
          title="Overview"
          description="Last 30 days"
          toolbar={<Button>30 days</Button>}
        >
          <p>Body</p>
        </AppPage>
      </AppShell>
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Overview' })
    ).toBeInTheDocument();
    // The sidebar shows from lg up; jsdom has no viewport, so it is hidden here.
    expect(
      screen.getByRole('link', { name: 'Overview', hidden: true })
    ).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('main')).toHaveTextContent('Body');
    expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('opens the navigation in a sheet on small screens, and closes it on a link', async () => {
    render(
      <AppShell brand="JSON Resume" nav={nav}>
        x
      </AppShell>
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Open navigation' })
    );
    const dialog = screen.getByRole('dialog', { name: 'Navigation' });
    await userEvent.click(
      within(dialog).getByRole('link', { name: 'Settings' })
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('AuthCard and labelled Divider', () => {
  it('titles the card, and separates options with "or"', async () => {
    const { container } = render(
      <AuthCard title="Sign in" description="Welcome back" footer="New here?">
        <Button>
          <GithubIcon /> Continue with GitHub
        </Button>
        <Divider label="or" />
      </AuthCard>
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Sign in' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue with GitHub' })
    ).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});
