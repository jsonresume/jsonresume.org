import { describe, it, expect } from 'vitest';
import { getAuthLinks } from './authLinks';

describe('getAuthLinks', () => {
  it('returns an array of navigation links', () => {
    const links = getAuthLinks('testuser');
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBe(3);
  });

  it('includes dashboard link with username', () => {
    const links = getAuthLinks('johndoe');
    const dashboardLink = links.find((link) => link.label === 'Dashboard');

    expect(dashboardLink).toBeDefined();
    expect(dashboardLink.href).toBe('/johndoe/dashboard');
    expect(dashboardLink.icon).toBeDefined();
  });

  it('includes editor link', () => {
    const links = getAuthLinks('testuser');
    const editorLink = links.find((link) => link.label === 'Editor');

    expect(editorLink).toBeDefined();
    expect(editorLink.href).toBe('/editor');
    expect(editorLink.icon).toBeDefined();
  });

  it('includes settings link', () => {
    const links = getAuthLinks('testuser');
    const settingsLink = links.find((link) => link.label === 'Settings');

    expect(settingsLink).toBeDefined();
    expect(settingsLink.href).toBe('/settings');
    expect(settingsLink.icon).toBeDefined();
  });

  it('all links have required properties', () => {
    const links = getAuthLinks('testuser');

    links.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('label');
      expect(link).toHaveProperty('icon');
      expect(typeof link.href).toBe('string');
      expect(typeof link.label).toBe('string');
      expect(link.icon).toBeDefined();
    });
  });

  it('handles different usernames correctly', () => {
    const links1 = getAuthLinks('user1');
    const links2 = getAuthLinks('different-user');

    expect(links1[0].href).toBe('/user1/dashboard');
    expect(links2[0].href).toBe('/different-user/dashboard');
  });
});
