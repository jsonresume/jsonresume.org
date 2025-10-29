import { describe, it, expect } from 'vitest';
import { render } from '../src/index.jsx';

const completeResume = {
  basics: {
    name: 'Sarah Martinez',
    label: 'Data Analytics Manager',
    email: 'sarah.martinez@example.com',
    phone: '+1 (555) 987-6543',
    url: 'https://sarahmartinez.io',
    summary:
      'Analytics leader with 10+ years driving data-driven decision making. Delivered $5M in cost savings through optimization initiatives.',
    location: {
      city: 'Austin',
      region: 'TX',
    },
    profiles: [
      { network: 'LinkedIn', url: 'https://linkedin.com/in/sarahmartinez' },
      { network: 'GitHub', url: 'https://github.com/smartinez' },
    ],
  },
  work: [
    {
      name: 'DataCorp Analytics',
      position: 'Senior Analytics Manager',
      location: 'Austin, TX',
      startDate: '2020-06-01',
      endDate: null,
      summary: 'Leading team of 8 analysts across 3 business units',
      highlights: [
        'Increased revenue forecasting accuracy by 42% through ML model implementation',
        'Reduced operational costs by $2.3M annually via process optimization',
        'Built real-time dashboard serving 500+ daily users with 99.9% uptime',
      ],
    },
  ],
  education: [
    {
      institution: 'University of Texas at Austin',
      area: 'Statistics',
      studyType: 'Master of Science',
      startDate: '2014-09-01',
      endDate: '2016-05-31',
      score: '3.9',
      courses: ['Machine Learning', 'Statistical Modeling', 'Data Mining'],
    },
  ],
  skills: [
    {
      name: 'Analytics',
      keywords: ['Python', 'R', 'SQL', 'Tableau', 'Power BI'],
    },
  ],
  projects: [
    {
      name: 'Predictive Analytics Platform',
      description:
        'Built ML-powered forecasting system processing 50GB daily data',
      highlights: [
        'Achieved 87% prediction accuracy (15% improvement over baseline)',
        'Deployed to 1,200+ users across 5 business units',
      ],
      keywords: ['Python', 'TensorFlow', 'PostgreSQL', 'Docker'],
      startDate: '2021-01-01',
      endDate: '2022-12-31',
      url: 'https://github.com/smartinez/predictive-analytics',
    },
  ],
};

describe('Data-Driven Theme', () => {
  it('renders complete HTML document', () => {
    const html = render(completeResume);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('</html>');
  });

  it('applies data-driven sky blue accent', () => {
    const html = render(completeResume);

    // Sky blue accent color in CSS
    expect(html).toContain('#0ea5e9');
  });

  it('renders basics section', () => {
    const html = render(completeResume);

    expect(html).toContain('Sarah Martinez');
    expect(html).toContain('Data Analytics Manager');
    expect(html).toContain('sarah.martinez@example.com');
  });

  it('renders work experience', () => {
    const html = render(completeResume);

    expect(html).toContain('Professional Experience');
    expect(html).toContain('DataCorp Analytics');
    expect(html).toContain('Senior Analytics Manager');
  });

  it('bolds numbers in summary', () => {
    const html = render(completeResume);

    // Numbers in summary should be wrapped in <strong> tags
    expect(html).toContain('<strong>10+</strong>');
    expect(html).toContain('<strong>$5M</strong>');
  });

  it('bolds numbers in work highlights', () => {
    const html = render(completeResume);

    // Metrics should be emphasized
    expect(html).toContain('<strong>42%</strong>');
    expect(html).toContain('<strong>$2.3M</strong>');
    expect(html).toContain('<strong>99.9%</strong>');
  });

  it('renders education section', () => {
    const html = render(completeResume);

    expect(html).toContain('Education');
    expect(html).toContain('University of Texas at Austin');
    expect(html).toContain('Statistics');
  });

  it('renders skills section', () => {
    const html = render(completeResume);

    expect(html).toContain('Technical Skills');
    expect(html).toContain('Python');
    expect(html).toContain('SQL');
  });

  it('renders projects section', () => {
    const html = render(completeResume);

    expect(html).toContain('Key Projects');
    expect(html).toContain('Predictive Analytics Platform');
  });

  it('bolds numbers in project highlights', () => {
    const html = render(completeResume);

    expect(html).toContain('<strong>87%</strong>');
    expect(html).toContain('<strong>1,200+</strong>');
  });

  it('includes styled-components CSS', () => {
    const html = render(completeResume);

    // Styled-components generates style tags
    expect(html).toContain('<style');
    expect(html).toContain('data-styled');
  });

  it('uses geometric sans-serif font', () => {
    const html = render(completeResume);

    expect(html).toContain('DM Sans');
  });

  it('handles minimal data gracefully', () => {
    const minimalResume = {
      basics: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    };

    const html = render(minimalResume);

    expect(html).toContain('John Doe');
    expect(html).toContain('john@example.com');
    expect(html).toContain('</html>');
  });
});
