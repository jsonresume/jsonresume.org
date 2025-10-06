import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cacheResume } from './cacheResume';

describe('cacheResume', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores resume in localStorage', () => {
    const username = 'johndoe';
    const resumeData = { basics: { name: 'John Doe' } };
    const gistId = 'abc123';

    cacheResume(username, resumeData, gistId);

    const stored = localStorage.getItem('resume_johndoe');
    expect(stored).toBeDefined();
  });

  it('stores resume with correct key format', () => {
    const username = 'testuser';
    const resumeData = { basics: {} };
    const gistId = 'gist123';

    cacheResume(username, resumeData, gistId);

    expect(localStorage.getItem('resume_testuser')).toBeDefined();
  });

  it('stores resume data as JSON string', () => {
    const username = 'user1';
    const resumeData = { basics: { name: 'Test User' } };
    const gistId = 'xyz789';

    cacheResume(username, resumeData, gistId);

    const stored = localStorage.getItem('resume_user1');
    const parsed = JSON.parse(stored);

    expect(parsed.resume).toEqual(resumeData);
    expect(parsed.gistId).toBe(gistId);
    expect(parsed.username).toBe(username);
  });

  it('includes all fields in cached data', () => {
    const username = 'alice';
    const resumeData = { work: [{ company: 'Acme' }] };
    const gistId = 'gist456';

    cacheResume(username, resumeData, gistId);

    const stored = JSON.parse(localStorage.getItem('resume_alice'));

    expect(stored).toHaveProperty('resume');
    expect(stored).toHaveProperty('gistId');
    expect(stored).toHaveProperty('username');
  });

  it('overwrites existing cache for same username', () => {
    const username = 'bob';

    cacheResume(username, { basics: { name: 'Bob 1' } }, 'gist1');
    cacheResume(username, { basics: { name: 'Bob 2' } }, 'gist2');

    const stored = JSON.parse(localStorage.getItem('resume_bob'));

    expect(stored.resume.basics.name).toBe('Bob 2');
    expect(stored.gistId).toBe('gist2');
  });

  it('handles empty resume data', () => {
    cacheResume('user', {}, 'gist');

    const stored = JSON.parse(localStorage.getItem('resume_user'));

    expect(stored.resume).toEqual({});
  });

  it('handles special characters in username', () => {
    cacheResume('user-name_123', { basics: {} }, 'gist');

    expect(localStorage.getItem('resume_user-name_123')).toBeDefined();
  });

  it('preserves resume data structure', () => {
    const complexResume = {
      basics: { name: 'Test', profiles: [{ network: 'GitHub' }] },
      work: [{ company: 'A' }],
      education: [],
    };

    cacheResume('user', complexResume, 'gist');

    const stored = JSON.parse(localStorage.getItem('resume_user'));

    expect(stored.resume).toEqual(complexResume);
  });
});
