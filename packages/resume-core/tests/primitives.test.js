import { describe, it, expect } from 'vitest';
import {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  Badge,
  BadgeList,
} from '../src/primitives/index.js';

describe('Section', () => {
  it('generates section HTML', () => {
    const html = Section({ content: '<p>Test</p>' });
    expect(html).toContain('<section');
    expect(html).toContain('resume-section');
    expect(html).toContain('<p>Test</p>');
  });

  it('accepts custom className', () => {
    const html = Section({ content: 'test', className: 'custom-class' });
    expect(html).toContain('custom-class');
  });

  it('accepts id attribute', () => {
    const html = Section({ content: 'test', id: 'work' });
    expect(html).toContain('id="work"');
  });
});

describe('SectionTitle', () => {
  it('generates heading with title', () => {
    const html = SectionTitle({ title: 'Work Experience' });
    expect(html).toContain('<h2');
    expect(html).toContain('Work Experience');
    expect(html).toContain('resume-section-title');
  });

  it('includes icon when provided', () => {
    const html = SectionTitle({ title: 'Work', icon: '💼' });
    expect(html).toContain('💼');
    expect(html).toContain('resume-icon');
  });

  it('supports custom heading level', () => {
    const html = SectionTitle({ title: 'Test', level: 'h3' });
    expect(html).toContain('<h3');
    expect(html).toContain('</h3>');
  });
});

describe('ListItem', () => {
  it('generates list item with title', () => {
    const html = ListItem({ title: 'Software Engineer' });
    expect(html).toContain('resume-item');
    expect(html).toContain('Software Engineer');
  });

  it('includes all optional fields', () => {
    const html = ListItem({
      title: 'Senior Developer',
      subtitle: 'Acme Corp',
      dateRange: 'Jan 2020 - Present',
      location: 'San Francisco, CA',
      description: 'Led development team',
      highlights: ['Achievement 1', 'Achievement 2'],
    });

    expect(html).toContain('Senior Developer');
    expect(html).toContain('Acme Corp');
    expect(html).toContain('Jan 2020 - Present');
    expect(html).toContain('San Francisco, CA');
    expect(html).toContain('Led development team');
    expect(html).toContain('Achievement 1');
    expect(html).toContain('Achievement 2');
  });
});

describe('DateRange', () => {
  it('formats date range', () => {
    const result = DateRange({
      startDate: '2020-01-15',
      endDate: '2022-06-30',
    });
    expect(result).toContain('2020');
    expect(result).toContain('2022');
    expect(result).toContain('-');
  });

  it('uses "Present" for missing end date', () => {
    const result = DateRange({
      startDate: '2020-01-15',
      endDate: null,
    });
    expect(result).toContain('Present');
  });

  it('handles different formats', () => {
    const shortFormat = DateRange({
      startDate: '2020-01-15',
      endDate: null,
      format: 'short',
    });
    expect(shortFormat).toMatch(/Jan|January/i);

    const longFormat = DateRange({
      startDate: '2020-01-15',
      endDate: null,
      format: 'long',
    });
    expect(longFormat).toContain('January');
  });
});

describe('Badge', () => {
  it('generates badge HTML', () => {
    const html = Badge({ text: 'JavaScript' });
    expect(html).toContain('resume-badge');
    expect(html).toContain('JavaScript');
  });

  it('supports variants', () => {
    const html = Badge({ text: 'React', variant: 'accent' });
    expect(html).toContain('resume-badge-accent');
  });

  it('supports sizes', () => {
    const html = Badge({ text: 'Vue', size: 'lg' });
    expect(html).toContain('resume-badge-lg');
  });
});

describe('BadgeList', () => {
  it('generates list of badges', () => {
    const html = BadgeList({ items: ['React', 'Vue', 'Angular'] });
    expect(html).toContain('resume-badge-list');
    expect(html).toContain('React');
    expect(html).toContain('Vue');
    expect(html).toContain('Angular');
  });

  it('returns empty string for empty array', () => {
    const html = BadgeList({ items: [] });
    expect(html).toBe('');
  });

  it('applies variant to all badges', () => {
    const html = BadgeList({
      items: ['TypeScript', 'Node.js'],
      variant: 'accent',
    });
    expect(html).toContain('resume-badge-accent');
  });
});
