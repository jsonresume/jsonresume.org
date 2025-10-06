import { describe, it, expect } from 'vitest';
import { NAV_LINKS } from './navLinks';

describe('NAV_LINKS', () => {
  it('exports array of navigation links', () => {
    expect(Array.isArray(NAV_LINKS)).toBe(true);
    expect(NAV_LINKS.length).toBeGreaterThan(0);
  });

  it('all links have required properties', () => {
    NAV_LINKS.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('label');
      expect(link).toHaveProperty('icon');
      expect(typeof link.href).toBe('string');
      expect(typeof link.label).toBe('string');
      expect(link.icon).toBeDefined();
    });
  });

  it('includes Explore link', () => {
    const exploreLink = NAV_LINKS.find((link) => link.label === 'Explore');
    expect(exploreLink).toBeDefined();
    expect(exploreLink?.href).toBe('/explore');
    expect(exploreLink?.external).toBeUndefined();
  });

  it('includes Jobs link', () => {
    const jobsLink = NAV_LINKS.find((link) => link.label === 'Jobs');
    expect(jobsLink).toBeDefined();
    expect(jobsLink?.href).toBe('/jobs');
  });

  it('includes Similarity link', () => {
    const similarityLink = NAV_LINKS.find(
      (link) => link.label === 'Similarity'
    );
    expect(similarityLink).toBeDefined();
    expect(similarityLink?.href).toBe('/job-similarity');
  });

  it('includes Github link as external', () => {
    const githubLink = NAV_LINKS.find((link) => link.label === 'Github');
    expect(githubLink).toBeDefined();
    expect(githubLink?.href).toContain('github.com');
    expect(githubLink?.external).toBe(true);
  });

  it('includes Discord link as external', () => {
    const discordLink = NAV_LINKS.find((link) => link.label === 'Discord');
    expect(discordLink).toBeDefined();
    expect(discordLink?.href).toContain('discord');
    expect(discordLink?.external).toBe(true);
  });

  it('marks external links correctly', () => {
    const externalLinks = NAV_LINKS.filter((link) => link.external);
    const internalLinks = NAV_LINKS.filter((link) => !link.external);

    // External links should use full URLs
    externalLinks.forEach((link) => {
      expect(link.href).toMatch(/^https?:\/\//);
    });

    // Internal links should use relative paths
    internalLinks.forEach((link) => {
      expect(link.href).toMatch(/^\//);
      expect(link.href).not.toMatch(/^https?:\/\//);
    });
  });

  it('has exactly 5 navigation links', () => {
    expect(NAV_LINKS).toHaveLength(5);
  });

  it('all internal links start with /', () => {
    const internalLinks = NAV_LINKS.filter((link) => !link.external);
    internalLinks.forEach((link) => {
      expect(link.href.startsWith('/')).toBe(true);
    });
  });

  it('all external links have valid URLs', () => {
    const externalLinks = NAV_LINKS.filter((link) => link.external);
    externalLinks.forEach((link) => {
      expect(() => new URL(link.href)).not.toThrow();
    });
  });
});
