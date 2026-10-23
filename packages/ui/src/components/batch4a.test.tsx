import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Button,
  Checklist,
  CopyButton,
  DescriptionList,
  JobCard,
  Markdown,
  ResumeCard,
  SecretField,
  StatTile,
} from '../index';
import { axeViolations } from '../test/axe';

describe('StatTile', () => {
  it('names the group and words the trend for screen readers', async () => {
    const { container } = render(
      <StatTile
        label="Applications"
        value={24}
        change={{ value: 12, period: 'vs last month' }}
      />
    );
    const tile = screen.getByRole('group', { name: 'Applications' });
    expect(tile).toHaveTextContent('Up 12% vs last month');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('DescriptionList', () => {
  it('renders term and description pairs', async () => {
    const { container } = render(
      <DescriptionList
        items={[
          { term: 'Location', description: 'Remote' },
          { term: 'Salary', description: '$180k' },
        ]}
      />
    );
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toEqual([
      'Location',
      'Salary',
    ]);
    expect(screen.getAllByRole('definition')[1]).toHaveTextContent('$180k');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('entity cards', () => {
  it('makes the title the link, keeps actions separately focusable', async () => {
    const { container } = render(
      <JobCard
        title="Senior Engineer"
        company="Stripe"
        href="/jobs/1"
        remote
        salary="$180k–$220k"
        match={87}
        tags={['Go']}
        actions={<Button size="sm">Save</Button>}
      />
    );
    const card = screen.getByRole('article');
    expect(
      within(card).getByRole('heading', { name: 'Senior Engineer' })
    ).toBeInTheDocument();
    expect(
      within(card).getByRole('link', { name: 'Senior Engineer' })
    ).toHaveAttribute('href', '/jobs/1');
    expect(card).toHaveTextContent('87%');
    expect(
      within(card).getByRole('button', { name: 'Save' })
    ).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('summarises a person and collapses long skill lists', async () => {
    const { container } = render(
      <ResumeCard
        name="Ada Lovelace"
        label="Analyst"
        href="/ada"
        skills={['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']}
      />
    );
    expect(screen.getByRole('link', { name: 'Ada Lovelace' })).toHaveAttribute(
      'href',
      '/ada'
    );
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Markdown', () => {
  it('renders GFM and ignores raw HTML', () => {
    const { container } = render(
      <Markdown externalLinks>
        {
          '## Tips\n\n- [x] Add metrics\n\n<script>alert(1)</script>\n\n[schema](https://jsonresume.org)'
        }
      </Markdown>
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Tips' })
    ).toBeInTheDocument();
    expect(screen.getByText('Done:', { exact: false })).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByRole('link', { name: 'schema' })).toHaveAttribute(
      'target',
      '_blank'
    );
  });
});

describe('CopyButton', () => {
  it('copies and confirms', async () => {
    const user = userEvent.setup();
    render(
      <CopyButton
        value="https://registry.jsonresume.org/ada"
        label="Copy link"
      />
    );
    await user.click(screen.getByRole('button', { name: 'Copy link' }));
    expect(await navigator.clipboard.readText()).toBe(
      'https://registry.jsonresume.org/ada'
    );
    expect(screen.getByRole('button', { name: /Copied/ })).toBeInTheDocument();
  });
});

describe('Checklist', () => {
  it('states each outcome in words and counts them', async () => {
    const { container } = render(
      <Checklist
        summary
        items={[
          { status: 'pass', title: 'Contact details present' },
          {
            status: 'fail',
            title: 'No dates on two roles',
            description: 'Add start and end dates.',
          },
        ]}
      />
    );
    const items = within(
      screen.getByRole('list', { name: 'Results' })
    ).getAllByRole('listitem');
    expect(items[1]).toHaveTextContent('Failed: No dates on two roles');
    expect(screen.getByText('1 failed')).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('SecretField', () => {
  it('masks the secret, reveals on demand, and copies the full value', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SecretField label="API key for CI" value="jr_live_abcdefghijkl1234" />
    );
    const group = screen.getByRole('group', { name: 'API key for CI' });
    expect(group).toHaveTextContent('Hidden, ends in 1234');
    expect(group).not.toHaveTextContent('jr_live_abcdefghijkl1234');
    expect(await axeViolations(container)).toEqual([]);
    await user.click(screen.getByRole('button', { name: 'Reveal' }));
    expect(group).toHaveTextContent('jr_live_abcdefghijkl1234');
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await navigator.clipboard.readText()).toBe(
      'jr_live_abcdefghijkl1234'
    );
  });
});
