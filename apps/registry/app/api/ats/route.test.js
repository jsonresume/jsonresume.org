import { describe, it, expect, vi } from 'vitest';
import { POST, GET } from './route';

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ATS API Endpoint', () => {
  describe('POST /api/ats', () => {
    it('returns ATS score for valid resume', async () => {
      const request = new Request('http://localhost:3000/api/ats', {
        method: 'POST',
        body: JSON.stringify({
          resume: {
            basics: {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+1-555-0100',
              summary: 'Experienced software engineer',
              location: { city: 'San Francisco' },
            },
            work: [
              {
                name: 'Tech Corp',
                position: 'Senior Engineer',
                startDate: '2020-01-01',
                highlights: ['Achievement 1', 'Achievement 2'],
              },
            ],
            education: [
              {
                institution: 'University',
                studyType: 'Bachelor',
                area: 'Computer Science',
              },
            ],
            skills: [
              {
                name: 'Languages',
                keywords: ['JavaScript', 'Python'],
              },
            ],
          },
          theme: 'jsonresume-theme-stackoverflow',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('score');
      expect(data).toHaveProperty('rating');
      expect(data).toHaveProperty('checks');
      expect(data).toHaveProperty('recommendations');
      expect(data).toHaveProperty('summary');
      expect(typeof data.score).toBe('number');
      expect(data.score).toBeGreaterThanOrEqual(0);
      expect(data.score).toBeLessThanOrEqual(100);
      expect(data.checks).toHaveLength(7);
    });

    it('handles missing theme parameter', async () => {
      const request = new Request('http://localhost:3000/api/ats', {
        method: 'POST',
        body: JSON.stringify({
          resume: {
            basics: {
              name: 'John Doe',
              email: 'john@example.com',
            },
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('score');
    });

    it('returns 400 for missing resume data', async () => {
      const request = new Request('http://localhost:3000/api/ats', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain('Resume data is required');
    });

    it('returns 400 for invalid resume data type', async () => {
      const request = new Request('http://localhost:3000/api/ats', {
        method: 'POST',
        body: JSON.stringify({ resume: 'invalid' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain('must be a valid object');
    });

    it('handles empty resume gracefully', async () => {
      const request = new Request('http://localhost:3000/api/ats', {
        method: 'POST',
        body: JSON.stringify({
          resume: {},
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.score).toBeLessThan(50); // Empty resume should score poorly
      expect(data.recommendations.length).toBeGreaterThan(0);
    });

    it('includes cache headers in response', async () => {
      const request = new Request('http://localhost:3000/api/ats', {
        method: 'POST',
        body: JSON.stringify({
          resume: {
            basics: { name: 'Test', email: 'test@example.com' },
          },
        }),
      });

      const response = await POST(request);

      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Cache-Control')).toBeTruthy();
    });
  });

  describe('GET /api/ats', () => {
    it('returns endpoint documentation', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('endpoint');
      expect(data).toHaveProperty('method');
      expect(data).toHaveProperty('description');
      expect(data).toHaveProperty('requestBody');
      expect(data).toHaveProperty('response');
      expect(data).toHaveProperty('categories');
      expect(data.categories).toHaveLength(7);
    });

    it('includes cache headers for documentation', async () => {
      const response = await GET();

      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Cache-Control')).toContain('86400');
    });
  });
});
