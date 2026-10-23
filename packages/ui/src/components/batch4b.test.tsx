import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ActivityFeed,
  BarChart,
  CalendarHeatmap,
  ChatMessage,
  ChatMessages,
  ChatToolCall,
  LineChart,
  PreviewFrame,
  RadarChart,
  Timeline,
  relativeTime,
} from '../index';
import { axeViolations } from '../test/axe';

describe('Chat', () => {
  it('is a labelled log of attributed messages with tool calls and a typing state', async () => {
    const { container } = render(
      <ChatMessages label="Copilot conversation">
        <ChatMessage role="user">Add Rust to my skills</ChatMessage>
        <ChatMessage role="assistant" author="Copilot">
          Done.
          <ChatToolCall
            name="update_resume"
            status="done"
            summary="skills +1"
            details='{"skills":["Rust"]}'
          />
        </ChatMessage>
        <ChatMessage role="assistant" author="Copilot" pending />
      </ChatMessages>
    );
    const log = screen.getByRole('log', { name: 'Copilot conversation' });
    expect(
      within(log).getByRole('article', { name: 'You said' })
    ).toHaveTextContent('Add Rust');
    expect(
      within(log).getAllByRole('article', { name: 'Copilot said' })[1]
    ).toHaveTextContent('Copilot is typing');
    expect(screen.getByText('update_resume')).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('ActivityFeed and Timeline', () => {
  it('formats relative times from a fixed now', () => {
    const now = new Date('2026-10-23T12:00:00Z');
    expect(relativeTime(new Date('2026-10-23T09:00:00Z'), now)).toBe(
      '3 hours ago'
    );
    expect(relativeTime(new Date('2026-10-22T12:00:00Z'), now)).toBe(
      'yesterday'
    );
  });

  it('lists activity with machine-readable times', async () => {
    const now = new Date('2026-10-23T12:00:00Z');
    const { container } = render(
      <ActivityFeed
        now={now}
        items={[
          { id: 1, time: '2026-10-23T11:00:00Z', title: 'Applied to Stripe' },
        ]}
      />
    );
    const item = screen.getByRole('listitem');
    expect(within(item).getByText('1 hour ago')).toHaveAttribute(
      'datetime',
      '2026-10-23T11:00:00.000Z'
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('renders an ordered timeline with headings', async () => {
    const { container } = render(
      <Timeline
        items={[
          {
            date: '2021 – Present',
            title: 'Principal Engineer',
            subtitle: 'Independent',
            current: true,
          },
        ]}
      />
    );
    expect(screen.getByRole('list', { name: 'Timeline' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Principal Engineer' })
    ).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Charts', () => {
  it('give every chart a summary and a data table', async () => {
    const { container } = render(
      <>
        <BarChart
          title="Applications by stage"
          summary="Most applications are at screening."
          data={[
            { label: 'Applied', value: 12 },
            { label: 'Screen', value: 5 },
          ]}
        />
        <LineChart
          title="Matches"
          summary="Matches rose over three weeks."
          labels={['W1', 'W2', 'W3']}
          series={[{ name: 'Matches', values: [3, 6, 9] }]}
        />
        <RadarChart
          title="Readiness"
          summary="Strongest in experience."
          data={[
            { label: 'Skills', value: 70 },
            { label: 'Experience', value: 90 },
            { label: 'Education', value: 50 },
          ]}
        />
      </>
    );
    expect(
      screen.getByRole('img', { name: 'Most applications are at screening.' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('figure')).toHaveLength(3);
    const tables = screen.getAllByRole('table', { hidden: true });
    expect(
      within(tables[0] as HTMLElement).getByText('Screen')
    ).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('CalendarHeatmap', () => {
  it('summarises activity and lists active days', async () => {
    const { container } = render(
      <CalendarHeatmap
        label="Applications"
        end={new Date('2026-10-23T00:00:00Z')}
        weeks={4}
        data={{ '2026-10-20': 2, '2026-10-21': 1 }}
        formatCount={(n) => `${n} applications`}
      />
    );
    expect(
      screen.getByRole('img', {
        name: 'Applications: 3 applications over 4 weeks, on 2 days',
      })
    ).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('PreviewFrame', () => {
  it('is a titled, sandboxed iframe', () => {
    render(
      <PreviewFrame title="Resume preview, Pro theme" srcDoc="<h1>Ada</h1>" />
    );
    const frame = screen.getByTitle('Resume preview, Pro theme');
    expect(frame).toHaveAttribute('sandbox', '');
  });
});
