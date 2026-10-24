import { describe, expect, it } from 'vitest';
import { registryRedirect } from './registry';

const from = (path: string) =>
  registryRedirect(new URL(path, 'https://registry.jsonresume.org'));

describe('registryRedirect', () => {
  it('moves resumes to /@username, keeping format and query', () => {
    expect(from('/thomasdavis')).toBe('https://jsonresume.org/@thomasdavis');
    expect(from('/ThomasDavis.json')).toBe(
      'https://jsonresume.org/@thomasdavis.json'
    );
    expect(from('/thomasdavis?theme=even&gistname=cv.json')).toBe(
      'https://jsonresume.org/@thomasdavis?theme=even&gistname=cv.json'
    );
    expect(from('/thomasdavis.html')).toBe(
      'https://jsonresume.org/@thomasdavis'
    );
    expect(from('/thomasdavis.pdf')).toBe(
      'https://jsonresume.org/@thomasdavis.pdf'
    );
    expect(from('/api/thomasdavis.yaml')).toBe(
      'https://jsonresume.org/@thomasdavis.yaml'
    );
  });

  it('sends pages with a counterpart to it', () => {
    expect(from('/login')).toBe('https://jsonresume.org/signin');
    expect(from('/editor')).toBe('https://jsonresume.org/dashboard/editor');
    expect(from('/docs/schema')).toBe('https://jsonresume.org/docs');
    expect(from('/jobs')).toBe('https://jsonresume.org/jobs');
    expect(from('/jobs/49922593')).toBe('https://jsonresume.org/jobs/49922593');
    expect(from('/my-jobs')).toBe('https://jsonresume.org/dashboard/jobs');
    expect(from('/api-keys')).toBe('https://jsonresume.org/dashboard/settings');
    expect(from('/api/v1/jobs?top=5')).toBe(
      'https://jsonresume.org/api/v1/jobs?top=5'
    );
  });

  it('sends everything else to the page about the move', () => {
    for (const path of [
      '/',
      '/pathways',
      '/thomasdavis/jobs',
      '/api/jobs/123',
      '/api/jobs',
      '/api/letter',
      '/not_a_user',
      '/%E0%A4%A',
      '/explore',
    ]) {
      expect(from(path)).toBe('https://jsonresume.org/registry');
    }
  });
});
