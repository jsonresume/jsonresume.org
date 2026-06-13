import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHtml } from './renderHtml.jsx';
import {
  Section,
  SectionTitle,
  ListItem,
  Badge,
  BadgeList,
  InlineSeparatorPipe,
} from '../../index.js';

describe('Section', () => {
  it('renders children inside a <section> with resume-section class', () => {
    const { html } = renderHtml(<Section>Work</Section>);
    expect(html).toContain('<section');
    expect(html).toContain('Work');
    expect(html).toContain('resume-section');
  });

  it('applies id and merges custom className', () => {
    const { html } = renderHtml(
      <Section id="work-experience" className="extra">
        x
      </Section>
    );
    expect(html).toContain('id="work-experience"');
    expect(html).toContain('resume-section');
    expect(html).toContain('extra');
  });

  it('renders without children (empty section, no crash)', () => {
    const { html } = renderHtml(<Section />);
    expect(html).toContain('<section');
  });

  it('forwards arbitrary props (e.g. data-attributes)', () => {
    const { html } = renderHtml(<Section data-testid="sec">x</Section>);
    expect(html).toContain('data-testid="sec"');
  });
});

describe('SectionTitle', () => {
  it('renders an <h2> by default with the title text', () => {
    const { html } = renderHtml(<SectionTitle>Experience</SectionTitle>);
    expect(html).toMatch(/<h2[^>]*>/);
    expect(html).toContain('Experience');
    expect(html).toContain('resume-section-title');
  });

  it('renders a dynamic heading level via the level prop', () => {
    const { html } = renderHtml(
      <SectionTitle level={3}>Projects</SectionTitle>
    );
    expect(html).toMatch(/<h3[^>]*>/);
  });

  it('renders an icon when provided, marked aria-hidden', () => {
    const { html } = renderHtml(<SectionTitle icon="*">Skills</SectionTitle>);
    expect(html).toContain('resume-icon');
    expect(html).toContain('aria-hidden="true"');
  });

  it('omits the icon span when no icon is given', () => {
    const { html } = renderHtml(<SectionTitle>Skills</SectionTitle>);
    expect(html).not.toContain('resume-icon');
  });
});

describe('ListItem', () => {
  const full = {
    title: 'Senior Engineer',
    subtitle: 'Acme Corp',
    dateRange: 'Jan 2020 - Present',
    location: 'San Francisco, CA',
    description: 'Built things',
    highlights: ['Led team of 5', 'Increased perf 40%'],
  };

  it('renders all fields when fully populated', () => {
    const { html } = renderHtml(<ListItem {...full} />);
    expect(html).toContain('Senior Engineer');
    expect(html).toContain('Acme Corp');
    expect(html).toContain('Jan 2020 - Present');
    expect(html).toContain('San Francisco, CA');
    expect(html).toContain('Built things');
    expect(html).toContain('Led team of 5');
    expect(html).toContain('Increased perf 40%');
  });

  it('renders nothing when title is missing (guard against crash)', () => {
    const { html } = renderHtml(<ListItem subtitle="Acme" />);
    expect(html).toBe('');
  });

  it('renders title-only item without optional fields', () => {
    const { html } = renderHtml(<ListItem title="Just a title" />);
    expect(html).toContain('Just a title');
    expect(html).not.toContain('resume-item-subtitle');
    expect(html).not.toContain('resume-highlights');
  });

  it('omits the meta separator dot when only dateRange is present', () => {
    const { html } = renderHtml(<ListItem title="t" dateRange="2020" />);
    expect(html).toContain('resume-item-meta');
    expect(html).toContain('2020');
  });

  it('handles an empty highlights array without rendering a list', () => {
    const { html } = renderHtml(<ListItem title="t" highlights={[]} />);
    expect(html).not.toContain('resume-highlights');
  });

  it('renders every highlight as a list item', () => {
    const { html } = renderHtml(
      <ListItem title="t" highlights={['a', 'b', 'c']} />
    );
    const liCount = (html.match(/<li>/g) || []).length;
    expect(liCount).toBe(3);
  });
});

describe('Badge', () => {
  it('renders its children and default class', () => {
    const { html } = renderHtml(<Badge>JavaScript</Badge>);
    expect(html).toContain('JavaScript');
    expect(html).toContain('resume-badge');
    expect(html).toContain('resume-badge-default');
  });

  it.each(['default', 'accent', 'secondary'])(
    'renders variant "%s" with the matching class',
    (variant) => {
      const { html } = renderHtml(<Badge variant={variant}>x</Badge>);
      expect(html).toContain(`resume-badge-${variant}`);
    }
  );

  it.each(['sm', 'md', 'lg'])('renders size "%s" without crashing', (size) => {
    const { html } = renderHtml(<Badge size={size}>x</Badge>);
    expect(html).toContain('resume-badge');
  });

  it('renders empty children without crashing', () => {
    const { html } = renderHtml(<Badge />);
    expect(html).toContain('resume-badge');
  });
});

describe('BadgeList', () => {
  it('renders an items array as individual badges', () => {
    const { html } = renderHtml(
      <BadgeList items={['React', 'TypeScript', 'Node']} />
    );
    expect(html).toContain('React');
    expect(html).toContain('TypeScript');
    expect(html).toContain('Node');
    const badges = (html.match(/resume-badge-default/g) || []).length;
    expect(badges).toBe(3);
  });

  it('renders children when no items array is given', () => {
    const { html } = renderHtml(
      <BadgeList>
        <Badge>Composed</Badge>
      </BadgeList>
    );
    expect(html).toContain('Composed');
    expect(html).toContain('resume-badge-list');
  });

  it('renders an empty list (empty items array) without crashing', () => {
    const { html } = renderHtml(<BadgeList items={[]} />);
    expect(html).toContain('resume-badge-list');
    expect(html).not.toContain('resume-badge-default');
  });

  it('propagates variant to all generated badges', () => {
    const { html } = renderHtml(
      <BadgeList items={['a', 'b']} variant="accent" />
    );
    const accent = (html.match(/resume-badge-accent/g) || []).length;
    expect(accent).toBe(2);
  });
});

describe('InlineSeparatorPipe', () => {
  it('renders a presentation span hidden from assistive tech', () => {
    const { html } = renderHtml(<InlineSeparatorPipe />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('role="presentation"');
    expect(html).toContain('resume-inline-separator-pipe');
  });

  it('renders as a custom element via the as prop', () => {
    const { html } = renderHtml(<InlineSeparatorPipe as="li" />);
    expect(html).toMatch(/<li[^>]*role="presentation"/);
  });
});
