import { describe, it, expect, vi } from 'vitest';
import { formatResumes } from './formatResumes';

// Mock gravatar
vi.mock('gravatar', () => ({
  default: {
    url: vi.fn(
      (email, options) => `https://gravatar.com/avatar/${email}?s=${options.s}`
    ),
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('formatResumes', () => {
  it('formats array of resume rows correctly', () => {
    const data = [
      {
        username: 'johndoe',
        resume: JSON.stringify({
          basics: {
            name: 'John Doe',
            label: 'Developer',
            email: 'john@example.com',
            image: 'https://example.com/photo.jpg',
            location: { city: 'SF' },
          },
        }),
        updated_at: '2024-01-15',
        created_at: '2023-01-01',
      },
    ];

    const result = formatResumes(data);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      username: 'johndoe',
      name: 'John Doe',
      label: 'Developer',
      image: 'https://example.com/photo.jpg',
      location: { city: 'SF' },
      updated_at: '2024-01-15',
      created_at: '2023-01-01',
    });
  });

  it('uses gravatar when no image provided', () => {
    const data = [
      {
        username: 'janedoe',
        resume: JSON.stringify({
          basics: {
            name: 'Jane Doe',
            email: 'jane@example.com',
          },
        }),
        updated_at: '2024-01-15',
        created_at: '2023-01-01',
      },
    ];

    const result = formatResumes(data);

    expect(result[0].image).toContain('gravatar.com');
    expect(result[0].image).toContain('jane@example.com');
  });

  it('handles invalid JSON with error fallback', () => {
    const data = [
      {
        username: 'testuser',
        resume: 'invalid json {',
        updated_at: '2024-01-15',
        created_at: '2023-01-01',
      },
    ];

    const result = formatResumes(data);

    expect(result[0]).toEqual({
      username: 'testuser',
      label: 'Error parsing resume',
      name: 'testuser',
      image: expect.stringContaining('gravatar.com'),
      location: null,
      updated_at: '2024-01-15',
      created_at: '2023-01-01',
    });
  });

  it('formats multiple resumes', () => {
    const data = [
      {
        username: 'user1',
        resume: JSON.stringify({ basics: { name: 'User 1' } }),
        updated_at: '2024-01-15',
        created_at: '2023-01-01',
      },
      {
        username: 'user2',
        resume: JSON.stringify({ basics: { name: 'User 2' } }),
        updated_at: '2024-01-16',
        created_at: '2023-01-02',
      },
    ];

    const result = formatResumes(data);

    expect(result).toHaveLength(2);
    expect(result[0].username).toBe('user1');
    expect(result[1].username).toBe('user2');
  });

  it('handles missing basics section', () => {
    const data = [
      {
        username: 'user1',
        resume: JSON.stringify({ work: [] }),
        updated_at: '2024-01-15',
        created_at: '2023-01-01',
      },
    ];

    const result = formatResumes(data);

    expect(result[0].name).toBeUndefined();
    expect(result[0].label).toBeUndefined();
    expect(result[0].location).toBeUndefined();
  });

  it('handles empty basics object', () => {
    const data = [
      {
        username: 'user1',
        resume: JSON.stringify({ basics: {} }),
        updated_at: '2024-01-15',
        created_at: '2023-01-01',
      },
    ];

    const result = formatResumes(data);

    expect(result[0].name).toBeUndefined();
    expect(result[0].label).toBeUndefined();
  });

  it('returns empty array for empty input', () => {
    const result = formatResumes([]);
    expect(result).toEqual([]);
  });

  it('handles mix of valid and invalid resumes', () => {
    const data = [
      {
        username: 'valid',
        resume: JSON.stringify({ basics: { name: 'Valid User' } }),
        updated_at: '2024-01-15',
        created_at: '2023-01-01',
      },
      {
        username: 'invalid',
        resume: 'bad json',
        updated_at: '2024-01-16',
        created_at: '2023-01-02',
      },
    ];

    const result = formatResumes(data);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Valid User');
    expect(result[1].label).toBe('Error parsing resume');
  });

  it('preserves timestamps correctly', () => {
    const data = [
      {
        username: 'user1',
        resume: JSON.stringify({ basics: {} }),
        updated_at: '2024-06-30T12:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    const result = formatResumes(data);

    expect(result[0].updated_at).toBe('2024-06-30T12:00:00Z');
    expect(result[0].created_at).toBe('2023-01-01T00:00:00Z');
  });
});
