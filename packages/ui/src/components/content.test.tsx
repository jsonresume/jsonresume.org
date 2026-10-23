import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import {
  ChipGroup,
  CodeTabs,
  LinkCard,
  OnThisPage,
  SectionIntro,
} from '../index';
import { axeViolations } from '../test/axe';

describe('SectionIntro', () => {
  it('renders an overline, a heading at the chosen level and a lede', async () => {
    const { container } = render(
      <SectionIntro
        overline="How it works"
        title="One file"
        level={3}
        headingId="how"
      >
        Your resume as data.
      </SectionIntro>
    );
    expect(
      screen.getByRole('heading', { level: 3, name: 'One file' })
    ).toHaveAttribute('id', 'how');
    expect(screen.getByText('Your resume as data.')).toBeVisible();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('LinkCard', () => {
  it('is one link named by its title and description', async () => {
    const { container } = render(
      <LinkCard
        href="/cli"
        title="CLI"
        description="Export from the terminal"
        eyebrow="Tool"
      />
    );
    expect(screen.getByRole('link', { name: /CLI/ })).toHaveAttribute(
      'href',
      '/cli'
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('can render through your own link element', () => {
    render(
      <LinkCard asChild title="Schema">
        <a href="/schema" data-router="" />
      </LinkCard>
    );
    const link = screen.getByRole('link', { name: /Schema/ });
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveAttribute('href', '/schema');
  });
});

describe('CodeTabs', () => {
  it('switches between variants of the same command', async () => {
    const { container } = render(
      <CodeTabs
        label="Install with"
        tabs={[
          { label: 'npm', code: 'npm i -g resume-cli' },
          { label: 'npx', code: 'npx resume-cli' },
        ]}
      />
    );
    expect(
      screen.getByRole('tablist', { name: 'Install with' })
    ).toBeInTheDocument();
    expect(screen.getByText('npm i -g resume-cli')).toBeVisible();
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'npx' }));
    expect(screen.getByText('npx resume-cli')).toBeVisible();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('OnThisPage', () => {
  it('links to each section', async () => {
    const { container } = render(
      <OnThisPage
        items={[
          { id: 'install', label: 'Install' },
          { id: 'usage', label: 'Usage' },
        ]}
      />
    );
    const nav = screen.getByRole('navigation', { name: 'On this page' });
    expect(within(nav).getByRole('link', { name: 'Usage' })).toHaveAttribute(
      'href',
      '#usage'
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('ChipGroup', () => {
  function Demo() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <ChipGroup
        label="Category"
        allLabel="All"
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'cli', label: 'CLI', count: 5 },
          { value: 'ai', label: 'AI', count: 3 },
        ]}
      />
    );
  }

  it('selects one option, toggles it off, and clears with All', async () => {
    const { container } = render(<Demo />);
    const cli = screen.getByRole('button', { name: /CLI/ });
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    fireEvent.click(cli);
    expect(cli).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    fireEvent.click(cli);
    expect(cli).toHaveAttribute('aria-pressed', 'false');
    expect(await axeViolations(container)).toEqual([]);
  });
});
