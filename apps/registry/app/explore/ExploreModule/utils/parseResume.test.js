import { describe, it, expect, vi } from 'vitest';
import { parseResumeRow } from './parseResume';

// Mock gravatar
vi.mock('gravatar', () => ({
  default: {
    url: vi.fn(
      (email, options, protocol) =>
        `https://gravatar.com/avatar/${email || 'default'}?s=${options.s}`
    ),
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('parseResumeRow', () => {
  it('parses valid resume with all fields', () => {
    const row = {
      username: 'johndoe',
      resume: JSON.stringify({
        basics: {
          name: 'John Doe',
          label: 'Software Developer',
          email: 'john@example.com',
          image: 'https://example.com/photo.jpg',
          location: {
            city: 'San Francisco',
            region: 'CA',
          },
        },
      }),
      updated_at: '2024-01-15',
      created_at: '2023-01-01',
    };

    const result = parseResumeRow(row);

    expect(result.username).toBe('johndoe');
    expect(result.name).toBe('John Doe');
    expect(result.label).toBe('Software Developer');
    expect(result.image).toBe('https://example.com/photo.jpg');
    expect(result.location).toEqual({
      city: 'San Francisco',
      region: 'CA',
    });
    expect(result.updated_at).toBe('2024-01-15');
    expect(result.created_at).toBe('2023-01-01');
  });

  it('uses gravatar when no image provided', () => {
    const row = {
      username: 'janedoe',
      resume: JSON.stringify({
        basics: {
          name: 'Jane Doe',
          label: 'Designer',
          email: 'jane@example.com',
        },
      }),
      updated_at: '2024-01-15',
      created_at: '2023-01-01',
    };

    const result = parseResumeRow(row);

    expect(result.image).toContain('gravatar.com');
    expect(result.image).toContain('jane@example.com');
  });

  it('uses default gravatar when no email provided', () => {
    const row = {
      username: 'testuser',
      resume: JSON.stringify({
        basics: {
          name: 'Test User',
          label: 'Developer',
        },
      }),
      updated_at: '2024-01-15',
      created_at: '2023-01-01',
    };

    const result = parseResumeRow(row);

    expect(result.image).toContain('gravatar.com');
  });

  it('handles missing basics section', () => {
    const row = {
      username: 'testuser',
      resume: JSON.stringify({
        work: [],
      }),
      updated_at: '2024-01-15',
      created_at: '2023-01-01',
    };

    const result = parseResumeRow(row);

    expect(result.username).toBe('testuser');
    expect(result.label).toBeUndefined();
    expect(result.name).toBeUndefined();
    expect(result.location).toBeUndefined();
  });

  it('handles invalid JSON with error fallback', () => {
    const row = {
      username: 'testuser',
      resume: 'invalid json {',
      updated_at: '2024-01-15',
      created_at: '2023-01-01',
    };

    const result = parseResumeRow(row);

    expect(result.username).toBe('testuser');
    expect(result.label).toBe('Error parsing resume');
    expect(result.name).toBe('testuser');
    expect(result.location).toBeNull();
    expect(result.image).toContain('gravatar.com');
  });

  it('handles empty basics object', () => {
    const row = {
      username: 'testuser',
      resume: JSON.stringify({
        basics: {},
      }),
      updated_at: '2024-01-15',
      created_at: '2023-01-01',
    };

    const result = parseResumeRow(row);

    expect(result.username).toBe('testuser');
    expect(result.label).toBeUndefined();
    expect(result.name).toBeUndefined();
  });

  it('preserves timestamps', () => {
    const row = {
      username: 'testuser',
      resume: JSON.stringify({ basics: { name: 'Test' } }),
      updated_at: '2024-06-30T12:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
    };

    const result = parseResumeRow(row);

    expect(result.updated_at).toBe('2024-06-30T12:00:00Z');
    expect(result.created_at).toBe('2023-01-01T00:00:00Z');
  });

  it('handles partial location data', () => {
    const row = {
      username: 'testuser',
      resume: JSON.stringify({
        basics: {
          name: 'Test User',
          location: {
            city: 'San Francisco',
          },
        },
      }),
      updated_at: '2024-01-15',
      created_at: '2023-01-01',
    };

    const result = parseResumeRow(row);

    expect(result.location).toEqual({
      city: 'San Francisco',
    });
  });
});
