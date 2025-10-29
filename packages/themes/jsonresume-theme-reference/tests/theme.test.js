import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';
import completeResume from './fixtures/complete-resume.json';

describe('Reference Theme', () => {
  it('renders complete resume HTML', () => {
    const html = render(completeResume);

    // Should be valid HTML document
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('</html>');
  });

  it('renders hero section with basics', () => {
    const html = render(completeResume);

    // Name and label
    expect(html).toContain('Alex Chen');
    expect(html).toContain('Senior Software Engineer');

    // Contact info
    expect(html).toContain('alex.chen@example.com');
    expect(html).toContain('+1 (555) 123-4567');
    expect(html).toContain('https://alexchen.dev');

    // Location
    expect(html).toContain('San Francisco');

    // Summary
    expect(html).toContain('Full-stack engineer with 8+ years');

    // Social profiles
    expect(html).toContain('GitHub');
    expect(html).toContain('LinkedIn');
  });

  it('renders work experience section', () => {
    const html = render(completeResume);

    expect(html).toContain('Work Experience');
    expect(html).toContain('TechCorp Inc');
    expect(html).toContain('Senior Software Engineer');
    expect(html).toContain('Present'); // Current role
    expect(html).toContain('Led migration from monolith to microservices');
  });

  it('renders education section', () => {
    const html = render(completeResume);

    expect(html).toContain('Education');
    expect(html).toContain('University of California, Berkeley');
    expect(html).toContain('Bachelor of Science');
    expect(html).toContain('Computer Science');
    expect(html).toContain('GPA: 3.8');
  });

  it('renders skills section with badges', () => {
    const html = render(completeResume);

    expect(html).toContain('Skills');
    expect(html).toContain('resume-badge'); // Badge component used
    expect(html).toContain('JavaScript');
    expect(html).toContain('TypeScript');
    expect(html).toContain('React');
    expect(html).toContain('PostgreSQL');
  });

  it('renders projects section', () => {
    const html = render(completeResume);

    expect(html).toContain('Projects');
    expect(html).toContain('OpenSource CMS');
    expect(html).toContain('DevTools Extension');
    expect(html).toContain('4.5k GitHub stars');
  });

  it('renders volunteer section', () => {
    const html = render(completeResume);

    expect(html).toContain('Volunteer Experience');
    expect(html).toContain('Code for America');
    expect(html).toContain('Volunteer Developer');
  });

  it('renders awards section', () => {
    const html = render(completeResume);

    expect(html).toContain('Awards & Honors');
    expect(html).toContain('Hackathon Winner');
    expect(html).toContain('Employee of the Year');
  });

  it('renders publications section', () => {
    const html = render(completeResume);

    expect(html).toContain('Publications');
    expect(html).toContain('Building Scalable GraphQL APIs');
    expect(html).toContain('Medium Engineering');
  });

  it('renders languages section', () => {
    const html = render(completeResume);

    expect(html).toContain('Languages');
    expect(html).toContain('English');
    expect(html).toContain('Mandarin');
    expect(html).toContain('Native');
  });

  it('renders interests section', () => {
    const html = render(completeResume);

    expect(html).toContain('Interests');
    expect(html).toContain('Open Source');
    expect(html).toContain('Rock Climbing');
  });

  it('renders references section', () => {
    const html = render(completeResume);

    expect(html).toContain('References');
    expect(html).toContain('Sarah Johnson');
    expect(html).toContain('most talented engineers');
  });

  it('handles empty sections gracefully', () => {
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

  it('includes @resume/core stylesheet', () => {
    const html = render(completeResume);

    expect(html).toContain('@resume/core');
    expect(html).toContain('tokens.css');
  });

  it('uses all @resume/core primitives', () => {
    const html = render(completeResume);

    // Section wrapper used
    expect(html).toContain('resume-section');

    // SectionTitle used
    expect(html).toContain('resume-section-title');

    // ListItem used
    expect(html).toContain('resume-item');

    // DateRange used (Present indicates DateRange component)
    expect(html).toContain('Present');

    // Badge/BadgeList used
    expect(html).toContain('resume-badge');
  });

  it('generates ATS-friendly HTML structure', () => {
    const html = render(completeResume);

    // Semantic HTML tags
    expect(html).toContain('<header');
    expect(html).toContain('<section');
    expect(html).toContain('<h1');
    expect(html).toContain('<h2');

    // No tables or complex layouts
    expect(html).not.toContain('<table');

    // Standard fonts (defined in inline styles)
    expect(html).toContain('font-family: var(--resume-font-sans)');
  });

  it('is print-ready', () => {
    const html = render(completeResume);

    // Should be single-page optimized
    expect(html).toContain('max-width: var(--resume-max-width)');

    // Standard A4/Letter dimensions assumed via CSS variables
  });
});
