import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';

// Reuse fixture from reference theme
const completeResume = {
  basics: {
    name: 'Alex Chen',
    label: 'Senior Software Engineer',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 123-4567',
    url: 'https://alexchen.dev',
    summary: 'Full-stack engineer with 8+ years experience',
    location: {
      city: 'San Francisco',
      region: 'CA',
    },
    profiles: [
      { network: 'GitHub', url: 'https://github.com/alexchen' },
      { network: 'LinkedIn', url: 'https://linkedin.com/in/alexchen' },
    ],
  },
  work: [
    {
      name: 'TechCorp Inc',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03-01',
      endDate: null,
      summary: 'Tech lead for core product platform',
      highlights: [
        'Led migration from monolith to microservices',
        'Reduced deployment time by 75%',
      ],
    },
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      area: 'Computer Science',
      studyType: 'Bachelor of Science',
      startDate: '2012-09-01',
      endDate: '2016-05-31',
      score: '3.8',
    },
  ],
  skills: [
    {
      name: 'Languages',
      keywords: ['JavaScript', 'TypeScript', 'Python'],
    },
    {
      name: 'Frontend',
      keywords: ['React', 'Next.js', 'Tailwind CSS'],
    },
  ],
  projects: [
    {
      name: 'OpenSource CMS',
      description: 'Headless CMS with visual editor',
      highlights: ['Built plugin architecture', '4.5k GitHub stars'],
      keywords: ['React', 'Node.js', 'PostgreSQL'],
      startDate: '2020-01-01',
      endDate: null,
      url: 'https://github.com/alexchen/opensource-cms',
    },
  ],
};

describe('Modern Theme', () => {
  it('renders complete HTML document', () => {
    const html = render(completeResume);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('</html>');
  });

  it('applies modern purple theme', () => {
    const html = render(completeResume);

    // Purple accent color
    expect(html).toContain('#8b5cf6');
    // Modern container with border radius
    expect(html).toContain('border-radius: 16px');
    expect(html).toContain('box-shadow');
  });

  it('renders hero section', () => {
    const html = render(completeResume);

    expect(html).toContain('Alex Chen');
    expect(html).toContain('Senior Software Engineer');
    expect(html).toContain('alex.chen@example.com');
    expect(html).toContain('alexchen.dev');
  });

  it('renders work experience', () => {
    const html = render(completeResume);

    expect(html).toContain('Experience');
    expect(html).toContain('TechCorp Inc');
    expect(html).toContain('Senior Software Engineer');
    expect(html).toContain('Present');
  });

  it('renders education', () => {
    const html = render(completeResume);

    expect(html).toContain('Education');
    expect(html).toContain('University of California, Berkeley');
    expect(html).toContain('Computer Science');
  });

  it('renders skills with badges', () => {
    const html = render(completeResume);

    expect(html).toContain('Skills');
    expect(html).toContain('JavaScript');
    expect(html).toContain('React');
    expect(html).toContain('resume-badge');
  });

  it('renders projects', () => {
    const html = render(completeResume);

    expect(html).toContain('Projects');
    expect(html).toContain('OpenSource CMS');
    expect(html).toContain('4.5k GitHub stars');
  });

  it('uses @resume/core primitives', () => {
    const html = render(completeResume);

    expect(html).toContain('resume-section');
    expect(html).toContain('resume-section-title');
    expect(html).toContain('resume-item');
    expect(html).toContain('resume-badge');
  });

  it('includes modern styling features', () => {
    const html = render(completeResume);

    // Hover effects
    expect(html).toContain('transition');
    expect(html).toContain(':hover');

    // Modern typography
    expect(html).toContain('-apple-system');
    expect(html).toContain('letter-spacing');

    // Card container
    expect(html).toContain('resume-container');
  });

  it('is print-optimized', () => {
    const html = render(completeResume);

    expect(html).toContain('@media print');
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
