import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button, Hero, Stat, Stats, Step, Steps } from '../index';
import { axeViolations } from '../test/axe';

describe('Hero', () => {
  it('renders the page heading, lede and actions', async () => {
    const { container } = render(
      <Hero
        title="JSON Resume"
        lede="A JSON-based standard for resumes."
        actions={<Button variant="primary">Get started</Button>}
      />
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'JSON Resume' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('A JSON-based standard for resumes.')
    ).toBeVisible();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('puts media beside the copy when given', async () => {
    const { container } = render(
      <Hero
        eyebrow="Open standard"
        title="Your resume, as data"
        media={<pre>{'{ "basics": {} }'}</pre>}
      />
    );
    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    expect(
      within(section as HTMLElement).getByText('Open standard')
    ).toBeVisible();
    expect(screen.getByText('{ "basics": {} }')).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Steps', () => {
  it('is an ordered list of titled steps', async () => {
    const { container } = render(
      <Steps>
        <Step title="Write">Describe your career in resume.json.</Step>
        <Step title="Theme">Pick a look.</Step>
        <Step title="Publish" level={4}>
          Share a link.
        </Step>
      </Steps>
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Write' })
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { level: 4, name: 'Publish' })
    ).toBeVisible();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Stats', () => {
  it('pairs each figure with its label in a description list', async () => {
    const { container } = render(
      <Stats>
        <Stat value="67" label="Themes" />
        <Stat value="4,800+" label="Hosted resumes" />
      </Stats>
    );
    const terms = container.querySelectorAll('dt');
    const details = container.querySelectorAll('dd');
    expect([...terms].map((t) => t.textContent)).toEqual([
      'Themes',
      'Hosted resumes',
    ]);
    expect([...details].map((d) => d.textContent)).toEqual(['67', '4,800+']);
    expect(await axeViolations(container)).toEqual([]);
  });
});
